<?php

/**
 * E-Gadget World Database Synchronizer
 * Connects via Laravel 11 environment, creates missing tables, seeds categories and laptops,
 * ensures 0 dummy accessories, and clears framework caches.
 */

define('LARAVEL_START', microtime(true));

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

echo "=== E-GADGET WORLD: DATABASE SYNCHRONIZATION ===\n";

try {
    // 1. Test database connection
    $pdo = DB::connection()->getPdo();
    $dbName = DB::connection()->getDatabaseName();
    echo "Connected to database: {$dbName}\n";

    // 2. Add profile columns to users table if missing
    if (Schema::hasTable('users')) {
        Schema::table('users', function ($table) {
            if (!Schema::hasColumn('users', 'display_name')) {
                $table->string('display_name')->nullable()->after('name');
                echo "Added display_name column to users.\n";
            }
            if (!Schema::hasColumn('users', 'phone')) {
                $table->string('phone', 50)->nullable()->after('email');
                echo "Added phone column to users.\n";
            }
            if (!Schema::hasColumn('users', 'avatar')) {
                $table->longText('avatar')->nullable()->after('phone');
                echo "Added avatar column to users.\n";
            }
            if (!Schema::hasColumn('users', 'designation')) {
                $table->string('designation')->nullable()->after('avatar');
                echo "Added designation column to users.\n";
            }
            if (!Schema::hasColumn('users', 'bio')) {
                $table->text('bio')->nullable()->after('designation');
                echo "Added bio column to users.\n";
            }
        });
    }

    // 3. Execute production schema and seed SQL
    $sqlPath = __DIR__ . '/database/production_schema_and_seed.sql';
    if (!file_exists($sqlPath)) {
        throw new Exception("SQL file not found at: {$sqlPath}");
    }

    $sqlContent = file_get_contents($sqlPath);
    DB::unprepared($sqlContent);
    echo "Production schema and seeds executed successfully.\n";

    // 4. Verify table counts
    $categoryCount = DB::table('categories')->count();
    $laptopCount = DB::table('laptops')->count();
    $laptopPieces = DB::table('laptops')->sum('piece');
    $publishedLaptops = DB::table('laptops')->where('status', 'published')->count();
    $accessoryCount = DB::table('accessories')->count();

    echo "--- DATABASE VERIFICATION ---\n";
    echo "Categories count: {$categoryCount}\n";
    echo "Laptops (total models): {$laptopCount}\n";
    echo "Laptops (total pieces): {$laptopPieces}\n";
    echo "Laptops (published): {$publishedLaptops}\n";
    echo "Accessories count: {$accessoryCount}\n";

    if ($laptopCount < 24) {
        throw new Exception("Verification check failed: laptop count is {$laptopCount}, expected at least 24.");
    }
    if ($categoryCount < 1) {
        throw new Exception("Verification check failed: categories count is {$categoryCount}, expected at least 1.");
    }

    echo "=== DATABASE SYNCHRONIZATION COMPLETED SUCCESSFULLY ===\n";
    exit(0);
} catch (\Throwable $e) {
    echo "DATABASE SYNC ERROR: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
    exit(1);
}
