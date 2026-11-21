<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::orderBy('sort_order', 'asc')->get();
        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'slug' => 'nullable|string|unique:categories,slug',
        ]);

        $slug = $request->input('slug') ?: Str::slug($request->input('name'));

        $cat = Category::create([
            'name' => $request->input('name'),
            'slug' => $slug,
            'desc' => $request->input('desc'),
            'pic' => $request->input('pic') ?: 'assets/images/placeholders/accessories-placeholder.svg',
            'status' => $request->input('status', 'active'),
            'sort_order' => (int) $request->input('sort_order', 0),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Category created successfully.',
            'data' => $cat,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $cat = Category::findOrFail($id);
        $cat->update($request->only(['name', 'slug', 'desc', 'pic', 'status', 'sort_order']));

        return response()->json([
            'success' => true,
            'message' => 'Category updated successfully.',
            'data' => $cat,
        ]);
    }

    public function destroy($id)
    {
        $cat = Category::findOrFail($id);
        $cat->delete();

        return response()->json([
            'success' => true,
            'message' => 'Category deleted.',
        ]);
    }
}
