<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::post('/api/admin/login', [AuthController::class, 'login']);
Route::get('/api/admin/me', [AuthController::class, 'me']);
Route::post('/api/admin/logout', [AuthController::class, 'logout']);
