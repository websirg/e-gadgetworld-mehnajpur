<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Laptop extends Model
{
    protected $fillable = [
        'lp_no',
        'brand',
        'model',
        'processor',
        'generation',
        'ram',
        'storage',
        'piece',
        'price',
        'pic',
        'status',
        'featured',
        'badge',
        'desc',
        'gallery',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'piece' => 'integer',
        'featured' => 'boolean',
        'gallery' => 'array',
    ];
}
