<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('accessories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('category_id')->nullable()->index();
            $table->string('sku')->unique();
            $table->string('name')->index();
            $table->string('brand')->index();
            $table->string('type')->index();
            $table->string('model')->nullable();
            $table->string('compatibility')->nullable();
            $table->unsignedInteger('piece')->default(1);
            $table->decimal('price', 10, 2)->index();
            $table->string('pic')->nullable();
            $table->string('status', 20)->default('published')->index();
            $table->text('desc')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('accessories');
    }
};
