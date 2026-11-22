<?php

namespace App\Http\Controllers;

use App\Models\Accessory;
use App\Models\ActivityLog;
use App\Models\Laptop;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\StockLog;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class SaleController extends Controller
{
    public function index(Request $request)
    {
        $query = Sale::with(['items', 'user']);

        if ($request->filled('search')) {
            $s = trim($request->input('search'));
            $query->where(function ($q) use ($s) {
                $q->where('inv_no', 'like', "%{$s}%")
                  ->orWhere('customer', 'like', "%{$s}%")
                  ->orWhere('phone', 'like', "%{$s}%");
            });
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->input('date_from'));
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->input('date_to'));
        }

        if ($request->filled('filter')) {
            $filter = $request->input('filter');
            if ($filter === 'today') {
                $query->whereDate('created_at', Carbon::today());
            } elseif ($filter === 'yesterday') {
                $query->whereDate('created_at', Carbon::yesterday());
            } elseif ($filter === 'week') {
                $query->where('created_at', '>=', Carbon::now()->subDays(7));
            } elseif ($filter === 'month') {
                $query->where('created_at', '>=', Carbon::now()->subDays(30));
            }
        }

        $perPage = min((int) $request->input('per_page', 20), 100);
        $sales = $query->orderBy('id', 'desc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $sales->items(),
            'total' => $sales->total(),
            'current_page' => $sales->currentPage(),
            'last_page' => $sales->lastPage(),
        ]);
    }

    public function show($id)
    {
        $sale = Sale::with(['items', 'user'])->findOrFail($id);
        return response()->json(['success' => true, 'data' => $sale]);
    }

    /**
     * Process product sale transaction with row-locking and stock reduction.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'item_type' => 'required|in:laptop,accessory,accessories',
            'item_id' => 'required',
            'qty' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'customer' => 'nullable|string',
            'phone' => 'nullable|string',
            'payment' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $rawType = $request->input('item_type');
        $itemType = in_array($rawType, ['accessory', 'accessories']) ? 'accessory' : 'laptop';
        $itemId = $request->input('item_id');
        $qty = (int) $request->input('qty');
        $unitPrice = (float) $request->input('price');
        $user = $request->get('auth_user');

        try {
            $sale = DB::transaction(function () use ($itemType, $itemId, $qty, $unitPrice, $request, $user) {
                // 1. Lock the inventory row to prevent race conditions & overselling
                if ($itemType === 'laptop') {
                    $item = Laptop::where('id', $itemId)
                        ->orWhere('lp_no', (string) $itemId)
                        ->lockForUpdate()
                        ->first();
                } else {
                    $item = Accessory::where('id', $itemId)
                        ->orWhere('sku', (string) $itemId)
                        ->lockForUpdate()
                        ->first();
                }

                if (!$item) {
                    throw new \Exception("Product record not found in inventory.");
                }

                if ($item->piece < $qty) {
                    throw new \Exception("Insufficient stock! Available piece: {$item->piece}, Requested: {$qty}");
                }

                $oldQty = $item->piece;
                $newQty = $oldQty - $qty;

                // 2. Decrement stock
                $item->piece = $newQty;
                $item->save();

                // 3. Generate Unique Invoice Number
                $todayDate = date('Ymd');
                $countToday = Sale::whereDate('created_at', Carbon::today())->count() + 1;
                $invNo = 'INV-' . $todayDate . '-' . str_pad($countToday, 4, '0', STR_PAD_LEFT);

                $totalAmount = $unitPrice * $qty;

                // 4. Create Sale
                $sale = Sale::create([
                    'inv_no' => $invNo,
                    'user_id' => $user['id'] ?? null,
                    'customer' => $request->input('customer'),
                    'phone' => $request->input('phone'),
                    'payment' => $request->input('payment', 'cash'),
                    'total' => $totalAmount,
                    'notes' => $request->input('notes'),
                ]);

                // 5. Create Sale Item
                $itemTitle = ($itemType === 'laptop')
                    ? "{$item->brand} {$item->model} ({$item->processor})"
                    : $item->name;
                $skuLp = ($itemType === 'laptop') ? $item->lp_no : $item->sku;

                SaleItem::create([
                    'sale_id' => $sale->id,
                    'item_type' => $itemType,
                    'item_id' => $item->id,
                    'title' => $itemTitle,
                    'sku_lp' => $skuLp,
                    'price' => $unitPrice,
                    'qty' => $qty,
                    'total' => $totalAmount,
                ]);

                // 6. Record Stock Log
                StockLog::create([
                    'item_type' => $itemType,
                    'item_id' => $item->id,
                    'user_id' => $user['id'] ?? null,
                    'action' => 'sale',
                    'qty_change' => -$qty,
                    'old_qty' => $oldQty,
                    'new_qty' => $newQty,
                    'notes' => "Sold via Invoice {$invNo}",
                ]);

                // 7. Activity Log
                ActivityLog::create([
                    'user_id' => $user['id'] ?? null,
                    'action' => 'record_sale',
                    'detail' => "Sold {$qty}x {$itemTitle} ({$skuLp}) for ₹" . number_format($totalAmount, 2),
                    'ip' => $request->ip(),
                ]);

                return $sale;
            });

            return response()->json([
                'success' => true,
                'message' => 'Sale transaction completed successfully. Inventory stock updated.',
                'data' => $sale->load(['items', 'user']),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}
