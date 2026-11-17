<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('/admin/login', [AuthController::class, 'login']);
Route::get('/admin/me', [AuthController::class, 'me']);
Route::post('/admin/logout', [AuthController::class, 'logout']);
