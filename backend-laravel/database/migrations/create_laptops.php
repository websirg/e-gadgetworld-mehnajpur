<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('laptops', function (Blueprint $table) {
            $table->id();
            $table->string('lp_no')->unique();
            $table->string('brand')->index();
            $table->string('model')->index();
            $table->string('processor');
            $table->string('generation');
            $table->string('ram');
            $table->string('storage');
            $table->unsignedInteger('piece')->default(1);
            $table->decimal('price', 10, 2)->index();
            $table->string('pic');
            $table->string('status', 20)->default('published')->index();
            $table->boolean('featured')->default(false)->index();
            $table->string('badge')->nullable();
            $table->text('desc')->nullable();
            $table->json('gallery')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('laptops');
    }
};
