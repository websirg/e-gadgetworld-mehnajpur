<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockLog extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'item_type',
        'item_id',
        'user_id',
        'action',
        'qty_change',
        'old_qty',
        'new_qty',
        'notes',
        'created_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
