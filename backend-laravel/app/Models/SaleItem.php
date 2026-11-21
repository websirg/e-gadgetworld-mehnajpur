<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SaleItem extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'sale_id',
        'item_type',
        'item_id',
        'title',
        'sku_lp',
        'price',
        'qty',
        'total',
        'created_at',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'qty' => 'integer',
        'total' => 'decimal:2',
    ];

    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }
}
