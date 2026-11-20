<?php

use App\Models\User;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;

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
