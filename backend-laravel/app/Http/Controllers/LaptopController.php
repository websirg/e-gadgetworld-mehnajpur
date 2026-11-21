<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Laptop;
use App\Models\StockLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LaptopController extends Controller
{
    public function index(Request $request)
    {
        $query = Laptop::query();

        if ($request->filled('search')) {
            $s = trim($request->input('search'));
            $query->where(function ($q) use ($s) {
                $q->where('lp_no', 'like', "%{$s}%")
                  ->orWhere('brand', 'like', "%{$s}%")
                  ->orWhere('model', 'like', "%{$s}%")
                  ->orWhere('processor', 'like', "%{$s}%");
            });
        }

        if ($request->filled('brand')) {
            $query->where('brand', $request->input('brand'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', (float) $request->input('min_price'));
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', (float) $request->input('max_price'));
        }

        $sort = $request->input('sort', 'lp_no');
        $dir = $request->input('dir', 'desc');

        if ($sort === 'price') {
            $query->orderBy('price', $dir);
        } elseif ($sort === 'piece') {
            $query->orderBy('piece', $dir);
        } else {
            $query->orderBy('id', $dir);
        }

        $perPage = min((int) $request->input('per_page', 24), 100);
        $laptops = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $laptops->items(),
            'total' => $laptops->total(),
            'current_page' => $laptops->currentPage(),
            'last_page' => $laptops->lastPage(),
        ]);
    }

    public function show($id)
    {
        $laptop = is_numeric($id) ? Laptop::find($id) : Laptop::where('lp_no', $id)->first();

        if (!$laptop) {
            return response()->json([
                'success' => false,
                'message' => 'Laptop record not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $laptop,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'lp_no' => 'required|string|unique:laptops,lp_no',
            'brand' => 'required|string',
            'model' => 'required|string',
            'processor' => 'required|string',
            'generation' => 'required|string',
            'ram' => 'required|string',
            'storage' => 'required|string',
            'piece' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
            'pic' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $request->only([
            'lp_no', 'brand', 'model', 'processor', 'generation',
            'ram', 'storage', 'piece', 'price', 'pic', 'status',
            'featured', 'badge', 'desc', 'gallery',
        ]);

        if (empty($data['pic'])) {
            $data['pic'] = 'assets/images/placeholders/laptop-placeholder.svg';
        }
        if (empty($data['status'])) {
            $data['status'] = 'published';
        }

        $laptop = Laptop::create($data);

        $user = $request->get('auth_user');
        ActivityLog::create([
            'user_id' => $user['id'] ?? null,
            'action' => 'create_laptop',
            'detail' => "Added laptop LP #{$laptop->lp_no}: {$laptop->brand} {$laptop->model} (Qty: {$laptop->piece})",
            'ip' => $request->ip(),
        ]);

        StockLog::create([
            'item_type' => 'laptop',
            'item_id' => $laptop->id,
            'user_id' => $user['id'] ?? null,
            'action' => 'restock',
            'qty_change' => (int) $laptop->piece,
            'old_qty' => 0,
            'new_qty' => (int) $laptop->piece,
            'notes' => 'Initial stock on creation',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Laptop added successfully.',
            'data' => $laptop,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $laptop = Laptop::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'lp_no' => 'sometimes|required|string|unique:laptops,lp_no,' . $laptop->id,
            'brand' => 'sometimes|required|string',
            'model' => 'sometimes|required|string',
            'piece' => 'sometimes|required|integer|min:0',
            'price' => 'sometimes|required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $oldPiece = $laptop->piece;
        $laptop->update($request->only([
            'lp_no', 'brand', 'model', 'processor', 'generation',
            'ram', 'storage', 'piece', 'price', 'pic', 'status',
            'featured', 'badge', 'desc', 'gallery',
        ]));

        $user = $request->get('auth_user');

        if ($request->has('piece') && (int) $request->input('piece') !== $oldPiece) {
            $newPiece = (int) $request->input('piece');
            StockLog::create([
                'item_type' => 'laptop',
                'item_id' => $laptop->id,
                'user_id' => $user['id'] ?? null,
                'action' => 'adjust',
                'qty_change' => $newPiece - $oldPiece,
                'old_qty' => $oldPiece,
                'new_qty' => $newPiece,
                'notes' => 'Manual stock adjustment via edit',
            ]);
        }

        ActivityLog::create([
            'user_id' => $user['id'] ?? null,
            'action' => 'update_laptop',
            'detail' => "Updated laptop LP #{$laptop->lp_no}",
            'ip' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Laptop updated successfully.',
            'data' => $laptop,
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $laptop = Laptop::findOrFail($id);
        $lpNo = $laptop->lp_no;
        $laptop->delete();

        $user = $request->get('auth_user');
        ActivityLog::create([
            'user_id' => $user['id'] ?? null,
            'action' => 'delete_laptop',
            'detail' => "Deleted laptop LP #{$lpNo}",
            'ip' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'message' => "Laptop LP #{$lpNo} deleted successfully.",
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
            $lpNo = trim((string)($item['lp_no'] ?? $item['lpNumber'] ?? ''));
            if (empty($lpNo)) {
                continue;
            }

            $brand = trim((string)($item['brand'] ?? 'HP'));
            $model = trim((string)($item['model'] ?? 'Laptop'));
            $processor = trim((string)($item['processor'] ?? 'Intel Core i5'));
            $generation = trim((string)($item['generation'] ?? '8th Gen'));
            $ram = trim((string)($item['ram'] ?? '8GB'));
            $storage = trim((string)($item['storage'] ?? '256GB SSD'));
            $piece = isset($item['piece']) ? (int)$item['piece'] : (isset($item['quantity']) ? (int)$item['quantity'] : 1);
            $price = isset($item['price']) ? (float)$item['price'] : 20000;
            $pic = !empty($item['pic']) ? $item['pic'] : (!empty($item['image']) ? $item['image'] : 'assets/images/placeholders/laptop-placeholder.svg');
            $status = !empty($item['status']) ? $item['status'] : 'published';
            $desc = $item['desc'] ?? $item['description'] ?? '';

            $laptop = Laptop::updateOrCreate(
                ['lp_no' => $lpNo],
                [
                    'brand' => $brand,
                    'model' => $model,
                    'processor' => $processor,
                    'generation' => $generation,
                    'ram' => $ram,
                    'storage' => $storage,
                    'piece' => $piece,
                    'price' => $price,
                    'pic' => $pic,
                    'status' => $status,
                    'desc' => $desc,
                ]
            );

            StockLog::create([
                'item_type' => 'laptop',
                'item_id' => $laptop->id,
                'user_id' => $user['id'] ?? null,
                'action' => 'import',
                'qty_change' => $piece,
                'old_qty' => 0,
                'new_qty' => $piece,
                'notes' => 'Imported via Excel/CSV',
            ]);

            $imported[] = $laptop;
        }

        ActivityLog::create([
            'user_id' => $user['id'] ?? null,
            'action' => 'import_laptops',
            'detail' => 'Bulk imported ' . count($imported) . ' laptops',
            'ip' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Successfully imported ' . count($imported) . ' laptops.',
            'count' => count($imported),
            'data' => $imported,
        ]);
    }
}
