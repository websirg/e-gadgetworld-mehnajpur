<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'desc',
        'pic',
        'status',
        'sort_order',
    ];

    public function accessories()
    {
        return $this->hasMany(Accessory::class);
    }
}
