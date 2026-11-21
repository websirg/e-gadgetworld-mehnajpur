<?php

use App\Http\Controllers\AccessoryController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LaptopController;
use App\Http\Controllers\PublicApiController;
use App\Http\Controllers\SaleController;
use App\Http\Middleware\AdminAuthenticate;
use Illuminate\Support\Facades\Route;

$registerRoutes = function () {
    // Public Endpoints
    Route::prefix('public')->group(function () {
        Route::get('/laptops', [PublicApiController::class, 'laptops']);
        Route::get('/laptops/{lpNo}', [PublicApiController::class, 'laptopDetail']);
        Route::get('/accessories', [PublicApiController::class, 'accessories']);
        Route::get('/categories', [PublicApiController::class, 'categories']);
    });

    // Admin Auth
    Route::post('/admin/login', [AuthController::class, 'login']);
    Route::get('/admin/me', [AuthController::class, 'me']);
    Route::post('/admin/logout', [AuthController::class, 'logout']);

    // Admin Protected Routes
    Route::prefix('admin')->middleware(AdminAuthenticate::class)->group(function () {
        // Dashboard metrics
        Route::get('/dashboard', [DashboardController::class, 'index']);

        // Laptops CRUD & Bulk Import
        Route::get('/laptops', [LaptopController::class, 'index']);
        Route::post('/laptops/import', [LaptopController::class, 'bulkImport']);
        Route::post('/laptops', [LaptopController::class, 'store']);
        Route::get('/laptops/{id}', [LaptopController::class, 'show']);
        Route::put('/laptops/{id}', [LaptopController::class, 'update']);
        Route::delete('/laptops/{id}', [LaptopController::class, 'destroy']);

        // Accessories CRUD & Bulk Import
        Route::get('/accessories', [AccessoryController::class, 'index']);
        Route::post('/accessories/import', [AccessoryController::class, 'bulkImport']);
        Route::post('/accessories', [AccessoryController::class, 'store']);
        Route::get('/accessories/{id}', [AccessoryController::class, 'show']);
        Route::put('/accessories/{id}', [AccessoryController::class, 'update']);
        Route::delete('/accessories/{id}', [AccessoryController::class, 'destroy']);

        // Categories
        Route::get('/categories', [CategoryController::class, 'index']);
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{id}', [CategoryController::class, 'update']);
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

        // Sales Management
        Route::get('/sales', [SaleController::class, 'index']);
        Route::post('/sales', [SaleController::class, 'store']);
        Route::get('/sales/{id}', [SaleController::class, 'show']);
    });
};

$registerRoutes();
Route::prefix('api')->group($registerRoutes);
