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

        // 4. Import 12 Accessories
        $accessories = [
            [
                'sku' => 'ACC-CHG-65W-HP-01',
                'name' => 'HP 65W Blue Pin Smart AC Power Adapter',
                'brand' => 'HP',
                'type' => 'Charger',
                'model' => '710412-001',
                'compatibility' => 'HP EliteBook 840 G3/G4/G5, ProBook 440 G1',
                'piece' => 8,
                'price' => 1250,
                'pic' => 'assets/images/placeholders/accessory-charger.svg',
                'desc' => '100% Genuine HP 65W Smart AC adapter with surge protection.',
            ],
            [
                'sku' => 'ACC-CHG-65W-DEL-02',
                'name' => 'Dell 65W 7.4mm Barrel Original Laptop Charger',
                'brand' => 'Dell',
                'type' => 'Charger',
                'model' => 'HA65NS5-00',
                'compatibility' => 'Dell Latitude E7450, 3490, 5480, Inspiron N4110',
                'piece' => 6,
                'price' => 1350,
                'pic' => 'assets/images/placeholders/accessory-charger.svg',
                'desc' => 'High durability OEM Dell laptop power brick with center pin.',
            ],
            [
                'sku' => 'ACC-CHG-65W-LEN-03',
                'name' => 'Lenovo 65W Type-C Rapid Charging Adapter',
                'brand' => 'Lenovo',
                'type' => 'Charger',
                'model' => 'ADLX65YLC3A',
                'compatibility' => 'Lenovo ThinkPad L14, T480, Universal Type-C',
                'piece' => 4,
                'price' => 1650,
                'pic' => 'assets/images/placeholders/accessory-charger.svg',
                'desc' => 'Lenovo ThinkPad official 65W USB-PD fast power adapter.',
            ],
            [
                'sku' => 'ACC-SSD-256G-NVME-04',
                'name' => 'Samsung PM991a 256GB NVMe M.2 High-Speed SSD',
                'brand' => 'Samsung',
                'type' => 'Storage',
                'model' => 'MZ-VLQ256B',
                'compatibility' => 'M.2 PCIe Gen3/Gen4 supported laptops & PCs',
                'piece' => 10,
                'price' => 1850,
                'pic' => 'assets/images/placeholders/accessory-ssd.svg',
                'desc' => 'Blazing fast NVMe SSD with up to 3100MB/s read speeds.',
            ],
            [
                'sku' => 'ACC-SSD-512G-NVME-05',
                'name' => 'Crucial P3 Plus 512GB PCIe M.2 2280 NVMe SSD',
                'brand' => 'Crucial',
                'type' => 'Storage',
                'model' => 'CT500P3PSSD8',
                'compatibility' => 'All modern Dell, HP, Lenovo & Asus laptops',
                'piece' => 7,
                'price' => 2950,
                'pic' => 'assets/images/placeholders/accessory-ssd.svg',
                'desc' => 'Gen4 NVMe technology delivering rapid boot & load times.',
            ],
            [
                'sku' => 'ACC-RAM-08G-DDR4-06',
                'name' => 'Crucial 8GB DDR4 3200MHz SODIMM Laptop Memory',
                'brand' => 'Crucial',
                'type' => 'RAM',
                'model' => 'CT8G4SFRA32A',
                'compatibility' => 'Dell Latitude, HP EliteBook, Lenovo ThinkPad',
                'piece' => 12,
                'price' => 1450,
                'pic' => 'assets/images/placeholders/accessory-ram.svg',
                'desc' => 'Low voltage 1.2V CL22 laptop memory upgrade.',
            ],
            [
                'sku' => 'ACC-RAM-16G-DDR4-07',
                'name' => 'Kingston Fury 16GB DDR4 3200MHz SODIMM RAM',
                'brand' => 'Kingston',
                'type' => 'RAM',
                'model' => 'KF432S20IB/16',
                'compatibility' => 'Gaming, commercial workstations, Intel 8th-12th Gen',
                'piece' => 5,
                'price' => 2800,
                'pic' => 'assets/images/placeholders/accessory-ram.svg',
                'desc' => 'Plug N Play automatic overclocking high reliability memory.',
            ],
            [
                'sku' => 'ACC-MOU-WIR-LOG-08',
                'name' => 'Logitech B170 Wireless Ergonomic Optical Mouse',
                'brand' => 'Logitech',
                'type' => 'Mouse',
                'model' => 'B170-Black',
                'compatibility' => 'Windows, macOS, Linux, ChromeOS',
                'piece' => 15,
                'price' => 599,
                'pic' => 'assets/images/placeholders/accessory-mouse.svg',
                'desc' => '10-meter reliable 2.4GHz wireless connection, 12-month battery life.',
            ],
            [
                'sku' => 'ACC-KEY-USB-DEL-09',
                'name' => 'Dell KB216 Wired Multimedia Silent Keyboard',
                'brand' => 'Dell',
                'type' => 'Keyboard',
                'model' => 'KB216-BK',
                'compatibility' => 'Universal USB-A compatible with all computers',
                'piece' => 8,
                'price' => 649,
                'pic' => 'assets/images/placeholders/accessories-placeholder.svg',
                'desc' => 'Chiclet-style key design providing quiet, comfortable typing.',
            ],
            [
                'sku' => 'ACC-BAG-BAC-HP-10',
                'name' => 'HP Odyssey 15.6-inch Durable Waterproof Backpack',
                'brand' => 'HP',
                'type' => 'Bag',
                'model' => 'L8J88AA',
                'compatibility' => 'Laptops up to 15.6 inch screen size',
                'piece' => 6,
                'price' => 1199,
                'pic' => 'assets/images/placeholders/accessories-placeholder.svg',
                'desc' => 'Contoured shoulder straps with air mesh padding and water resistance.',
            ],
            [
                'sku' => 'ACC-HUB-TPC-POR-11',
                'name' => 'Portronics 6-in-1 Type-C Multiport Adapter Hub',
                'brand' => 'Portronics',
                'type' => 'Adapter',
                'model' => 'M-Port 61',
                'compatibility' => 'MacBook, Dell Latitude, ThinkPad, USB-C Laptops',
                'piece' => 4,
                'price' => 1499,
                'pic' => 'assets/images/placeholders/accessories-placeholder.svg',
                'desc' => '4K HDMI, 100W PD charging, 3x USB 3.0 ports, and SD card reader.',
            ],
            [
                'sku' => 'ACC-CLN-KIT-PRO-12',
                'name' => 'Antigravity Professional Screen & Keyboard Cleaning Kit',
                'brand' => 'ProClean',
                'type' => 'Cleaning Kit',
                'model' => 'CLN-500ML',
                'compatibility' => 'LED screens, laptop bodies, keyboards, smartphones',
                'piece' => 20,
                'price' => 199,
                'pic' => 'assets/images/placeholders/accessories-placeholder.svg',
                'desc' => 'Anti-static, alcohol-free cleaning spray with microfiber cloth & brush.',
            ],
        ];

        foreach ($accessories as $acc) {
            Accessory::updateOrCreate(
                ['sku' => $acc['sku']],
                array_merge($acc, [
                    'category_id' => $catAccessories->id,
                    'status' => 'published',
                ])
            );
        }

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
