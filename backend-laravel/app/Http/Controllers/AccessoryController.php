<?php

namespace App\Http\Controllers;

use App\Models\Accessory;
use App\Models\ActivityLog;
use App\Models\StockLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AccessoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Accessory::query();

        if ($request->filled('search')) {
            $s = trim($request->input('search'));
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")
                  ->orWhere('sku', 'like', "%{$s}%")
                  ->orWhere('brand', 'like', "%{$s}%")
                  ->orWhere('type', 'like', "%{$s}%");
            });
        }

        if ($request->filled('type')) {
            $query->where('type', $request->input('type'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $perPage = min((int) $request->input('per_page', 24), 100);
        $accessories = $query->orderBy('id', 'desc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $accessories->items(),
            'total' => $accessories->total(),
            'current_page' => $accessories->currentPage(),
            'last_page' => $accessories->lastPage(),
        ]);
    }

    public function show($id)
    {
        $acc = Accessory::findOrFail($id);
        return response()->json(['success' => true, 'data' => $acc]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'sku' => 'required|string|unique:accessories,sku',
            'name' => 'required|string',
            'brand' => 'required|string',
            'type' => 'required|string',
            'piece' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $request->only([
            'category_id', 'sku', 'name', 'brand', 'type',
            'model', 'compatibility', 'piece', 'price', 'pic',
            'status', 'desc',
        ]);

        if (empty($data['pic'])) {
            $data['pic'] = 'assets/images/placeholders/accessories-placeholder.svg';
        }
        if (empty($data['status'])) {
            $data['status'] = 'published';
        }

        $acc = Accessory::create($data);

        $user = $request->get('auth_user');
        ActivityLog::create([
            'user_id' => $user['id'] ?? null,
            'action' => 'create_accessory',
            'detail' => "Added accessory {$acc->name} (SKU: {$acc->sku})",
            'ip' => $request->ip(),
        ]);

        StockLog::create([
            'item_type' => 'accessory',
            'item_id' => $acc->id,
            'user_id' => $user['id'] ?? null,
            'action' => 'restock',
            'qty_change' => (int) $acc->piece,
            'old_qty' => 0,
            'new_qty' => (int) $acc->piece,
            'notes' => 'Initial accessory stock',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Accessory added successfully.',
            'data' => $acc,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $acc = Accessory::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'sku' => 'sometimes|required|string|unique:accessories,sku,' . $acc->id,
            'name' => 'sometimes|required|string',
            'piece' => 'sometimes|required|integer|min:0',
            'price' => 'sometimes|required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $oldPiece = $acc->piece;
        $acc->update($request->only([
            'category_id', 'sku', 'name', 'brand', 'type',
            'model', 'compatibility', 'piece', 'price', 'pic',
            'status', 'desc',
        ]));

        $user = $request->get('auth_user');
        if ($request->has('piece') && (int) $request->input('piece') !== $oldPiece) {
            $newPiece = (int) $request->input('piece');
            StockLog::create([
                'item_type' => 'accessory',
                'item_id' => $acc->id,
                'user_id' => $user['id'] ?? null,
                'action' => 'adjust',
                'qty_change' => $newPiece - $oldPiece,
                'old_qty' => $oldPiece,
                'new_qty' => $newPiece,
                'notes' => 'Stock adjusted via edit',
            ]);
        }

        ActivityLog::create([
            'user_id' => $user['id'] ?? null,
            'action' => 'update_accessory',
            'detail' => "Updated accessory {$acc->name}",
            'ip' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Accessory updated successfully.',
            'data' => $acc,
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $acc = Accessory::findOrFail($id);
        $name = $acc->name;
        $acc->delete();

        $user = $request->get('auth_user');
        ActivityLog::create([
            'user_id' => $user['id'] ?? null,
            'action' => 'delete_accessory',
            'detail' => "Deleted accessory {$name}",
            'ip' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'message' => "Accessory deleted successfully.",
        ]);
    }

    public function bulkImport(Request $request)
    {
        $items = $request->input('items');
        if (!is_array($items) || empty($items)) {
            return response()->json([
                'success' => false,
                'message' => 'No items provided for import.',
            ], 422);
        }

        $imported = [];
        $user = $request->get('auth_user');

        foreach ($items as $item) {
            $sku = trim((string)($item['sku'] ?? ''));
            $name = trim((string)($item['name'] ?? ''));
            if (empty($sku) && empty($name)) {
                continue;
            }
            if (empty($sku)) {
                $sku = 'ACC-' . strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', $name), 0, 8)) . '-' . rand(100, 999);
            }

            $brand = trim((string)($item['brand'] ?? 'Generic'));
            $type = trim((string)($item['type'] ?? 'Accessories'));
            $model = trim((string)($item['model'] ?? ''));
            $compatibility = trim((string)($item['compatibility'] ?? ''));
            $piece = isset($item['piece']) ? (int)$item['piece'] : (isset($item['quantity']) ? (int)$item['quantity'] : 1);
            $price = isset($item['price']) ? (float)$item['price'] : 1000;
            $pic = !empty($item['pic']) ? $item['pic'] : (!empty($item['image']) ? $item['image'] : 'assets/images/placeholders/accessories-placeholder.svg');
            $status = !empty($item['status']) ? $item['status'] : 'published';
            $desc = $item['desc'] ?? $item['description'] ?? '';

            $acc = Accessory::updateOrCreate(
                ['sku' => $sku],
                [
                    'name' => $name ?: 'Showroom Accessory',
                    'brand' => $brand,
                    'type' => $type,
                    'model' => $model,
                    'compatibility' => $compatibility,
                    'piece' => $piece,
                    'price' => $price,
                    'pic' => $pic,
                    'status' => $status,
                    'desc' => $desc,
                ]
            );

            StockLog::create([
                'item_type' => 'accessory',
                'item_id' => $acc->id,
                'user_id' => $user['id'] ?? null,
                'action' => 'import',
                'qty_change' => $piece,
                'old_qty' => 0,
                'new_qty' => $piece,
                'notes' => 'Imported via Excel/CSV',
            ]);

            $imported[] = $acc;
        }

        ActivityLog::create([
            'user_id' => $user['id'] ?? null,
            'action' => 'import_accessories',
            'detail' => 'Bulk imported ' . count($imported) . ' accessories',
            'ip' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Successfully imported ' . count($imported) . ' accessories.',
            'count' => count($imported),
            'data' => $imported,
        ]);
    }
}
