<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_logs', function (Blueprint $table) {
            $table->id();
            $table->string('item_type', 20);
            $table->unsignedBigInteger('item_id');
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('action', 20); // 'sale', 'restock', 'adjust', 'return'
            $table->integer('qty_change');
            $table->unsignedInteger('old_qty');
            $table->unsignedInteger('new_qty');
            $table->string('notes')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['item_type', 'item_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_logs');
    }
};
