-- E-Gadget World Production Database Schema and Non-Destructive Seed
-- Compatible with MySQL 8+ and MariaDB 10.3+

-- 1. Categories Table
CREATE TABLE IF NOT EXISTS `categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `desc` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pic` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `sort_order` int NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Laptops Table
CREATE TABLE IF NOT EXISTS `laptops` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `lp_no` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `brand` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `processor` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `generation` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ram` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `storage` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `piece` int unsigned NOT NULL DEFAULT 1,
  `price` decimal(10,2) NOT NULL,
  `pic` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'published',
  `featured` tinyint(1) NOT NULL DEFAULT 0,
  `badge` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `desc` text COLLATE utf8mb4_unicode_ci,
  `gallery` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `laptops_lp_no_unique` (`lp_no`),
  KEY `laptops_brand_index` (`brand`),
  KEY `laptops_model_index` (`model`),
  KEY `laptops_price_index` (`price`),
  KEY `laptops_status_index` (`status`),
  KEY `laptops_featured_index` (`featured`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Accessories Table
CREATE TABLE IF NOT EXISTS `accessories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `category_id` bigint unsigned DEFAULT NULL,
  `sku` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `brand` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `compatibility` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `piece` int unsigned NOT NULL DEFAULT 1,
  `price` decimal(10,2) NOT NULL,
  `pic` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'published',
  `desc` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `accessories_sku_unique` (`sku`),
  KEY `accessories_category_id_index` (`category_id`),
  KEY `accessories_name_index` (`name`),
  KEY `accessories_brand_index` (`brand`),
  KEY `accessories_type_index` (`type`),
  KEY `accessories_price_index` (`price`),
  KEY `accessories_status_index` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Sales Table
CREATE TABLE IF NOT EXISTS `sales` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `inv_no` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `customer` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'cash',
  `total` decimal(10,2) NOT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sales_inv_no_unique` (`inv_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Sale Items Table
CREATE TABLE IF NOT EXISTS `sale_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `sale_id` bigint unsigned NOT NULL,
  `item_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `item_id` bigint unsigned NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sku_lp` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `qty` int unsigned NOT NULL DEFAULT 1,
  `total` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `sale_items_sale_id_foreign` (`sale_id`),
  CONSTRAINT `sale_items_sale_id_foreign` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Settings Table
CREATE TABLE IF NOT EXISTS `settings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `val` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `settings_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Stock Logs Table
CREATE TABLE IF NOT EXISTS `stock_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `item_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `item_id` bigint unsigned NOT NULL,
  `change` int NOT NULL,
  `type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reason` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `stock_logs_item_type_item_id_index` (`item_type`,`item_id`),
  KEY `stock_logs_type_index` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Activity Logs Table
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `action` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `details` json DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Insert/Update Core Categories
INSERT INTO `categories` (`id`, `name`, `slug`, `desc`, `pic`, `status`, `sort_order`, `created_at`, `updated_at`)
VALUES
(1, 'Laptops', 'laptops', 'Certified Refurbished Business Laptops', 'assets/images/placeholders/laptop-placeholder.svg', 'active', 1, NOW(), NOW()),
(2, 'Accessories', 'accessories', 'Laptop Chargers, SSDs, RAM, and Peripherals', 'assets/images/placeholders/accessories-placeholder.svg', 'active', 2, NOW(), NOW()),
(3, 'Chargers', 'chargers', 'Original HP, Dell, and Lenovo Adapters', 'assets/images/placeholders/accessory-charger.svg', 'active', 3, NOW(), NOW()),
(4, 'RAM & Storage', 'ram-storage', 'High-Speed NVMe, SATA SSDs, and DDR4 RAM', 'assets/images/placeholders/accessory-ssd.svg', 'active', 4, NOW(), NOW())
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `desc` = VALUES(`desc`),
  `status` = VALUES(`status`),
  `sort_order` = VALUES(`sort_order`);

-- 10. Insert/Update Core Store Settings
INSERT INTO `settings` (`key`, `val`, `created_at`, `updated_at`)
VALUES
('store_name', 'E-Gadget World', NOW(), NOW()),
('store_phone', '+91 9984359860', NOW(), NOW()),
('store_branch', 'Mehnajpur HQ, Azamgarh', NOW(), NOW())
ON DUPLICATE KEY UPDATE `val` = VALUES(`val`);

-- 11. Insert/Update 25 Commercial Showroom Laptops (39 Physical Units)
INSERT INTO `laptops` (`id`, `lp_no`, `brand`, `model`, `processor`, `generation`, `ram`, `storage`, `piece`, `price`, `pic`, `status`, `featured`, `badge`, `desc`, `gallery`, `created_at`, `updated_at`)
VALUES
(26,'3930','Lenovo','ThinkPad L14','Intel Core i5','11th Gen','8GB','256GB SSD',2,32000.00,'assets/images/laptops/lenovo-thinkpad-l14.svg','published',1,'Popular 11th Gen','Lenovo ThinkPad L14 business-grade durable laptop with 11th Gen Intel Core i5 processor.',NULL,NOW(),NOW()),
(27,'3440','Lenovo','ThinkPad L14','Intel Core i5','11th Gen','8GB','256GB SSD',1,32000.00,'assets/images/laptops/lenovo-thinkpad-l14.svg','published',1,'Enterprise Ready','Lenovo ThinkPad L14 enterprise laptop with fingerprint reader and high security.',NULL,NOW(),NOW()),
(28,'3909','HP','EliteBook 840 G3','Intel Core i5','6th Gen','4GB','256GB SSD',1,23000.00,'assets/images/laptops/hp-elitebook-840.svg','published',0,NULL,'HP EliteBook 840 G3 slim aluminum chassis business laptop.',NULL,NOW(),NOW()),
(29,'3963','HP','EliteBook 840 G5','Intel Core i5','8th Gen','8GB','256GB SSD',1,26500.00,'assets/images/laptops/hp-elitebook-840-g5.svg','published',1,'8th Gen Quad Core','HP EliteBook 840 G5 premium quad-core laptop with Bang & Olufsen sound.',NULL,NOW(),NOW()),
(30,'3965','HP','EliteBook 840 G5','Intel Core i5','8th Gen','8GB','256GB SSD',1,26500.00,'assets/images/laptops/hp-elitebook-840-g5.svg','published',1,'Premium Metallic','HP EliteBook 840 G5 enterprise workstation with backlit keyboard and FHD display.',NULL,NOW(),NOW()),
(31,'3923','HP','EliteBook 840 G4','Intel Core i5','7th Gen','4GB','256GB SSD',1,24000.00,'assets/images/laptops/hp-elitebook-840-g4.svg','published',0,NULL,'HP EliteBook 840 G4 robust business laptop with anti-glare display.',NULL,NOW(),NOW()),
(32,'1859','HP','HP 348 G4','Intel Core i5','7th Gen','8GB','256GB SSD',1,21000.00,'assets/images/laptops/hp-348-g4.svg','published',0,NULL,'HP 348 G4 reliable student and commercial office laptop.',NULL,NOW(),NOW()),
(33,'2585','HP','ProBook 440 G1','Intel Core i5','4th Gen','8GB','256GB SSD',1,17500.00,'assets/images/laptops/hp-probook-440-g1.svg','published',0,'Budget Friendly','HP ProBook 440 G1 durable business laptop with optical drive.',NULL,NOW(),NOW()),
(34,'4002','HP','EliteBook Folio 9480M','Intel Core i5','4th Gen','8GB','256GB SSD',4,18000.00,'assets/images/laptops/hp-elitebook-folio-9480m.svg','published',1,'Ultrabook Slim','HP EliteBook Folio 9480M ultra-thin corporate laptop with silver aluminum finish.',NULL,NOW(),NOW()),
(35,'3995','HP','EliteBook 840 G1 Touch','Intel Core i5','4th Gen','8GB','256GB SSD',2,19000.00,'assets/images/laptops/hp-elitebook-840-g1-touch.svg','published',0,'Touchscreen','HP EliteBook 840 G1 with responsive touchscreen display.',NULL,NOW(),NOW()),
(36,'3935','HP','EliteBook 840 G3','Intel Core i5','6th Gen','8GB','256GB SSD',1,23000.00,'assets/images/laptops/hp-elitebook-840.svg','published',0,NULL,'HP EliteBook 840 G3 with high speed 8GB RAM and crisp audio.',NULL,NOW(),NOW()),
(37,'2356','Dell','Latitude E7450','Intel Core i5','5th Gen','8GB','256GB SSD',1,19500.00,'assets/images/laptops/dell-latitude-e7450.svg','published',0,NULL,'Dell Latitude E7450 premium carbon fiber composite ultrabook.',NULL,NOW(),NOW()),
(38,'7426','Lenovo','IdeaPad V130','Intel Core i3','7th Gen','4GB','256GB SSD',2,18500.00,'assets/images/laptops/lenovo-ideapad-v130.svg','published',0,'Lightweight','Lenovo IdeaPad V130 lightweight commercial notebook.',NULL,NOW(),NOW()),
(39,'7298','Dell','Vostro 3490','Intel Core i5','10th Gen','8GB','256GB SSD',5,26500.00,'assets/images/laptops/dell-vostro.svg','published',1,'10th Gen Core i5','Dell Vostro 3490 10th Gen high efficiency corporate laptop.',NULL,NOW(),NOW()),
(40,'7067','Dell','Inspiron N4110','Intel Core i3','2nd Gen','6GB','320GB HDD',1,11000.00,'assets/images/laptops/dell-inspiron.svg','published',0,'Starter Range','Dell Inspiron N4110 budget friendly home computing machine.',NULL,NOW(),NOW()),
(41,'7189','Dell','Vostro 3500','Intel Core i5','1st Gen','8GB','500GB HDD',1,10500.00,'assets/images/laptops/dell-vostro-3500.svg','published',0,'Value Workhorse','Dell Vostro 3500 classic 15.6 inch business machine.',NULL,NOW(),NOW()),
(42,'7138','Dell','Vostro 3569','Intel Core i5','6th Gen','8GB','256GB SSD',1,20000.00,'assets/images/laptops/dell-vostro-3569.svg','published',0,'15.6 Inch Full HD','Dell Vostro 3569 large screen commercial notebook with numeric keypad.',NULL,NOW(),NOW()),
(43,'3790','Dell','Latitude 3490','Intel Core i5','8th Gen','8GB','256GB SSD',3,18000.00,'assets/images/laptops/dell-latitude-3490.svg','published',1,'Top Seller','Dell Latitude 3490 8th Gen quad core enterprise workhorse.',NULL,NOW(),NOW()),
(44,'3583','Dell','Latitude 3400','Intel Core i3','8th Gen','4GB','256GB SSD',1,18000.00,'assets/images/laptops/dell-latitude-3400.svg','published',0,NULL,'Dell Latitude 3400 sleek business device with Type-C support.',NULL,NOW(),NOW()),
(45,'3395','Dell','Latitude 3490','Intel Core i3','7th Gen','4GB','256GB SSD',2,18500.00,'assets/images/laptops/dell-latitude-3490.svg','published',0,NULL,'Dell Latitude 3490 durable commercial laptop for daily work.',NULL,NOW(),NOW()),
(46,'2741','Dell','Latitude 5440','Intel Core i3','4th Gen','8GB','500GB HDD',1,14000.00,'assets/images/laptops/dell-latitude-5440.svg','published',0,NULL,'Dell Latitude 5440 durable military grade chassis laptop.',NULL,NOW(),NOW()),
(47,'7004','HP','Pavilion G6','Intel Core i3','2nd Gen','4GB','500GB HDD',1,10000.00,'assets/images/laptops/hp-pavilion-g6.svg','published',0,'Affordable Home','HP Pavilion G6 15.6 inch multimedia and office laptop.',NULL,NOW(),NOW()),
(48,'3996','Dell','Latitude E5450','Intel Core i5','5th Gen','8GB','256GB SSD',1,18000.00,'assets/images/laptops/dell-latitude-e5450.svg','published',0,NULL,'Dell Latitude E5450 reliable magnesium alloy business ultrabook.',NULL,NOW(),NOW()),
(49,'3128','Dell','Latitude 5480','Intel Core i5','7th Gen','8GB','256GB SSD',2,21000.00,'assets/images/laptops/dell-latitude-5480.svg','published',1,'Enterprise 7th Gen','Dell Latitude 5480 high performance enterprise laptop with long battery life.',NULL,NOW(),NOW()),
(50,'3429','Dell','Latitude 5480','Intel Core i5','6th Gen','8GB','256GB SSD',1,20000.00,'assets/images/laptops/dell-latitude-5480.svg','published',0,NULL,'Dell Latitude 5480 tested 6th Gen commercial laptop.',NULL,NOW(),NOW())
ON DUPLICATE KEY UPDATE
  `brand` = VALUES(`brand`),
  `model` = VALUES(`model`),
  `price` = VALUES(`price`),
  `piece` = VALUES(`piece`),
  `status` = VALUES(`status`),
  `pic` = VALUES(`pic`),
  `processor` = VALUES(`processor`),
  `generation` = VALUES(`generation`),
  `ram` = VALUES(`ram`),
  `storage` = VALUES(`storage`),
  `featured` = VALUES(`featured`),
  `badge` = VALUES(`badge`);

-- 12. Clean Accessories Table (Preserve table structure, remove dummy seeds to maintain 0 accessories count)
DELETE FROM `accessories` WHERE `sku` LIKE 'ACC-%';
