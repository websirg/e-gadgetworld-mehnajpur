<?php

namespace App\Http\Controllers;

use App\Models\Accessory;
use App\Models\Category;
use App\Models\Laptop;
use Illuminate\Http\Request;

class PublicApiController extends Controller
{
    /**
     * Get published laptops for public catalog.
     */
    public function laptops(Request $request)
    {
        $query = Laptop::where('status', 'published');

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
            $brand = trim($request->input('brand'));
            if (strtolower($brand) !== 'all') {
                $query->where('brand', $brand);
            }
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', (float) $request->input('min_price'));
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', (float) $request->input('max_price'));
        }

        $sort = $request->input('sort', 'default');
        if ($sort === 'price-low') {
            $query->orderBy('price', 'asc');
        } elseif ($sort === 'price-high') {
            $query->orderBy('price', 'desc');
        } else {
            $query->orderBy('id', 'asc');
        }

        $laptops = $query->get()->map(function ($lap) {
            // Dynamic badge rule:
            // > 2: In Stock
            // 2: Only 2 Left
            // 1: Only 1 Left
            // 0: Sold Out
            $stockBadge = 'In Stock';
            $stockClass = 'badge-in-stock';
            if ($lap->piece == 0) {
                $stockBadge = 'Sold Out';
                $stockClass = 'badge-sold-out';
            } elseif ($lap->piece == 1) {
                $stockBadge = 'Only 1 Left';
                $stockClass = 'badge-urgent-1';
            } elseif ($lap->piece == 2) {
                $stockBadge = 'Only 2 Left';
                $stockClass = 'badge-urgent-2';
            }

            return array_merge($lap->toArray(), [
                'stockBadge' => $stockBadge,
                'stockClass' => $stockClass,
                'isAvailable' => $lap->piece > 0,
            ]);
        });

        return response()->json([
            'success' => true,
            'total' => $laptops->count(),
            'data' => $laptops,
        ]);
    }

    /**
     * Get single laptop details by LP number or ID.
     */
    public function laptopDetail($lpNo)
    {
        $laptop = Laptop::where('status', 'published')
            ->where(function ($q) use ($lpNo) {
                $q->where('lp_no', $lpNo)->orWhere('id', $lpNo);
            })
            ->first();

        if (!$laptop) {
            return response()->json([
                'success' => false,
                'message' => "Laptop record #{$lpNo} not found.",
            ], 404);
        }

        $stockBadge = 'In Stock';
        if ($laptop->piece == 0) {
            $stockBadge = 'Sold Out';
        } elseif ($laptop->piece == 1) {
            $stockBadge = 'Only 1 Left';
        } elseif ($laptop->piece == 2) {
            $stockBadge = 'Only 2 Left';
        }

        return response()->json([
            'success' => true,
            'data' => array_merge($laptop->toArray(), [
                'stockBadge' => $stockBadge,
                'isAvailable' => $laptop->piece > 0,
            ]),
        ]);
    }

    /**
     * Get published accessories for public catalog.
     */
    public function accessories(Request $request)
    {
        $query = Accessory::where('status', 'published');

        if ($request->filled('type')) {
            $query->where('type', $request->input('type'));
        }

        $accessories = $query->orderBy('id', 'asc')->get();

        return response()->json([
            'success' => true,
            'total' => $accessories->count(),
            'data' => $accessories,
        ]);
    }

    /**
     * Get active categories.
     */
    public function categories()
    {
        $categories = Category::where('status', 'active')
            ->orderBy('sort_order', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }
}
