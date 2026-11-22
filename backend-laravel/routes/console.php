<?php

use App\Models\User;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('admin:setup {--email=egadgetworld@websirg.com} {--password=} {--name=Sonu} {--branch=MEHNAJPUR}', function () {
    $email = strtolower(trim($this->option('email') ?: 'egadgetworld@websirg.com'));
    $password = $this->option('password') ?: env('ADMIN_SETUP_PASSWORD');

    if (empty($password)) {
        $password = $this->secret('Enter new password for Admin (' . $email . '):');
    }

    if (empty($password) || strlen($password) < 6) {
        $this->error('Password must be at least 6 characters long.');
        return 1;
    }

    $name = $this->option('name') ?: 'Sonu';
    $branch = strtoupper($this->option('branch') ?: 'MEHNAJPUR');

    $user = User::where('email', $email)->first();

    if ($user) {
        $user->name = $name;
        $user->password = Hash::make($password);
        $user->role = 'owner';
        $user->branch = $branch;
        $user->save();
        $this->info("✓ Admin account updated successfully: {$user->email} (ID: {$user->id}, Role: {$user->role}, Branch: {$user->branch})");
    } else {
        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'role' => 'owner',
            'branch' => $branch,
        ]);
        $this->info("✓ Admin account created successfully: {$user->email} (ID: {$user->id}, Role: {$user->role}, Branch: {$user->branch})");
    }

    return 0;
})->purpose('Idempotently configure or reset the E-Gadget World Admin staff account');

Artisan::command('db:sync-egadget', function () {
    $this->info('=== STARTING E-GADGET WORLD DATABASE SYNCHRONIZATION ===');

    try {
        // 1. Alter users table for profile fields if missing
        if (Schema::hasTable('users')) {
            Schema::table('users', function ($table) {
                if (!Schema::hasColumn('users', 'display_name')) {
                    $table->string('display_name')->nullable()->after('name');
                    $this->info('Added display_name to users.');
                }
                if (!Schema::hasColumn('users', 'phone')) {
                    $table->string('phone', 50)->nullable()->after('email');
                    $this->info('Added phone to users.');
                }
                if (!Schema::hasColumn('users', 'avatar')) {
                    $table->longText('avatar')->nullable()->after('phone');
                    $this->info('Added avatar to users.');
                }
                if (!Schema::hasColumn('users', 'designation')) {
                    $table->string('designation')->nullable()->after('avatar');
                    $this->info('Added designation to users.');
                }
                if (!Schema::hasColumn('users', 'bio')) {
                    $table->text('bio')->nullable()->after('designation');
                    $this->info('Added bio to users.');
                }
            });
        }

        // 2. Execute SQL schema and non-destructive seeds
        $sqlPath = database_path('production_schema_and_seed.sql');
        if (!file_exists($sqlPath)) {
            $this->error("SQL file not found at: {$sqlPath}");
            return 1;
        }

        $queries = file_get_contents($sqlPath);
        DB::unprepared($queries);
        $this->info('Production schema and seeds executed successfully.');

        // 3. Verification
        $categoryCount = DB::table('categories')->count();
        $laptopCount = DB::table('laptops')->count();
        $laptopPieces = (int) DB::table('laptops')->sum('piece');
        $publishedLaptops = DB::table('laptops')->where('status', 'published')->count();
        $accessoryCount = DB::table('accessories')->count();

        $this->info('--- DATABASE VERIFICATION ---');
        $this->info("Categories count: {$categoryCount}");
        $this->info("Laptop models count: {$laptopCount}");
        $this->info("Laptop total pieces: {$laptopPieces}");
        $this->info("Published laptops: {$publishedLaptops}");
        $this->info("Accessories count: {$accessoryCount}");

        if ($laptopCount < 24) {
            $this->error("Verification failed: laptop count is {$laptopCount}, expected >= 24.");
            return 1;
        }
        if ($categoryCount < 1) {
            $this->error("Verification failed: category count is {$categoryCount}, expected >= 1.");
            return 1;
        }

        $this->info('=== DATABASE SYNCHRONIZATION COMPLETED SUCCESSFULLY ===');
        return 0;
    } catch (\Throwable $e) {
        $this->error('DATABASE SYNC EXCEPTION: ' . $e->getMessage());
        $this->error($e->getTraceAsString());
        return 1;
    }
})->purpose('Synchronize production MySQL schema and showroom laptop data');
