<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Accessory extends Model
{
    protected $fillable = [
        'category_id',
        'sku',
        'name',
        'brand',
        'type',
        'model',
        'compatibility',
        'piece',
        'price',
        'pic',
        'status',
        'desc',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'piece' => 'integer',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
