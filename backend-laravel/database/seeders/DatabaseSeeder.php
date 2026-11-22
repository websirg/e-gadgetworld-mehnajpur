<?php

namespace Database\Seeders;

use App\Models\Accessory;
use App\Models\Category;
use App\Models\Laptop;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Provision Two Admin Accounts
        $superAdminPassword = env('SUPER_ADMIN_PASSWORD', 'Sonu@2026');
        $adminPassword = env('ADMIN_PASSWORD', 'Mansi@2026');

        User::updateOrCreate(
            ['email' => 'egadgetworld@websirg.com'],
            [
                'name' => 'Sunil Kumar Maurya (Sonu)',
                'password' => Hash::make($superAdminPassword),
                'role' => 'super_admin',
                'branch' => 'MEHNAJPUR',
            ]
        );

        User::updateOrCreate(
            ['email' => 'mansi@websirg.com'],
            [
                'name' => 'Mansi',
                'password' => Hash::make($adminPassword),
                'role' => 'admin',
                'branch' => 'MEHNAJPUR',
            ]
        );

        // 2. Categories
        $catLaptops = Category::updateOrCreate(
            ['slug' => 'laptops'],
            [
                'name' => 'Laptops',
                'desc' => 'Certified Refurbished Business Laptops',
                'pic' => 'assets/images/placeholders/laptop-placeholder.svg',
                'status' => 'active',
                'sort_order' => 1,
            ]
        );

        $catAccessories = Category::updateOrCreate(
            ['slug' => 'accessories'],
            [
                'name' => 'Accessories',
                'desc' => 'Laptop Chargers, SSDs, RAM, and Peripherals',
                'pic' => 'assets/images/placeholders/accessories-placeholder.svg',
                'status' => 'active',
                'sort_order' => 2,
            ]
        );

        Category::updateOrCreate(
            ['slug' => 'chargers'],
            [
                'name' => 'Chargers',
                'desc' => 'Original HP, Dell, and Lenovo Adapters',
                'pic' => 'assets/images/placeholders/accessory-charger.svg',
                'status' => 'active',
                'sort_order' => 3,
            ]
        );

        Category::updateOrCreate(
            ['slug' => 'ram-storage'],
            [
                'name' => 'RAM & Storage',
                'desc' => 'High-Speed NVMe, SATA SSDs, and DDR4 RAM',
                'pic' => 'assets/images/placeholders/accessory-ssd.svg',
                'status' => 'active',
                'sort_order' => 4,
            ]
        );

        // 3. Import 24 Laptops from data/products.json
        $productsJsonPath = base_path('../data/products.json');
        if (file_exists($productsJsonPath)) {
            $rawLaptops = json_decode(file_get_contents($productsJsonPath), true);
            if (is_array($rawLaptops)) {
                foreach ($rawLaptops as $item) {
                    $lpNo = (string) ($item['lpNumber'] ?? $item['id']);
                    $image = !empty($item['images'][0]) ? $item['images'][0] : 'assets/images/placeholders/laptop-placeholder.svg';

                    Laptop::updateOrCreate(
                        ['lp_no' => $lpNo],
                        [
                            'brand' => $item['brand'] ?? 'Universal',
                            'model' => $item['model'] ?? 'Laptop',
                            'processor' => $item['processor'] ?? 'Intel Core i5',
                            'generation' => $item['generation'] ?? 'N/A',
                            'ram' => $item['ram'] ?? '8GB',
                            'storage' => $item['storage'] ?? '256GB SSD',
                            'piece' => (int) ($item['quantity'] ?? 1),
                            'price' => (float) ($item['price'] ?? 15000),
                            'pic' => $image,
                            'status' => 'published',
                            'featured' => (bool) ($item['featured'] ?? false),
                            'badge' => $item['badge'] ?? null,
                            'desc' => $item['description'] ?? null,
                            'gallery' => $item['images'] ?? [$image],
                        ]
                    );
                }
            }
        }

        // 4. Accessories: 0 real accessories in showroom inventory initially.
        // In accordance with showroom reality, no dummy accessories are auto-seeded.
        // Accessories will only be populated when real products are entered by admin.


        // 5. Initial Store Settings
        Setting::updateOrCreate(
            ['key' => 'store_name'],
            ['val' => 'E-Gadget World']
        );
        Setting::updateOrCreate(
            ['key' => 'store_phone'],
            ['val' => '+91 9984359860']
        );
        Setting::updateOrCreate(
            ['key' => 'store_branch'],
            ['val' => 'Mehnajpur HQ, Azamgarh']
        );
    }
}
