/**
 * E-Gadget World — Admin Frontend Local State & UI Management Engine
 * Mehnajpur HQ, Azamgarh
 * UI-ONLY IMPLEMENTATION (Zero Backend Mutation / Demo Mode Protected)
 */

(function(window) {
  'use strict';

    // 1. Initial Verified Categories
  const INITIAL_CATEGORIES = [
    {
      id: 'cat-laptops',
      name: 'Commercial Laptops',
      slug: 'commercial-laptops',
      code: 'laptop',
      description: 'Refurbished commercial laptops (Dell Latitude, HP EliteBook, Lenovo ThinkPad) tested for high performance.',
      image: '../assets/images/placeholders/laptop-placeholder.svg',
      status: 'active',
      displayOrder: 1,
      itemCount: 0
    },
    {
      id: 'cat-accessories',
      name: 'Laptop Accessories',
      slug: 'laptop-accessories',
      code: 'accessories',
      description: 'Genuine OEM chargers, power adapters, SSD & RAM upgrades, ergonomic stands, and peripherals.',
      image: '../assets/images/placeholders/accessories-placeholder.svg',
      status: 'active',
      displayOrder: 2,
      itemCount: 0
    },
    {
      id: 'cat-peripherals',
      name: 'Computer Peripherals',
      slug: 'computer-peripherals',
      code: 'peripherals',
      description: 'Wired and wireless optical mice, mechanical keyboards, multi-port hubs, and laptop bags.',
      image: '../assets/images/placeholders/accessory-peripherals.svg',
      status: 'active',
      displayOrder: 3,
      itemCount: 0
    }
  ];

  // 2. Initial Authoritative Showroom Laptops Catalog (25 records, 39 physical pieces)
  const INITIAL_LAPTOPS = [
  {
    "id": "3930",
    "lpNumber": "3930",
    "brand": "Lenovo",
    "model": "ThinkPad L14",
    "processor": "Intel Core i5",
    "generation": "11th Gen",
    "ram": "8GB",
    "storage": "256GB SSD",
    "quantity": 2,
    "soldQuantity": 0,
    "price": 32000.0,
    "image": "assets/images/laptops/lenovo-thinkpad-l14.svg",
    "gallery": [
      "assets/images/laptops/lenovo-thinkpad-l14.svg"
    ],
    "status": "published",
    "warrantyDisplay": "12 Months Store Warranty",
    "description": "Lenovo ThinkPad L14 business-grade durable laptop equipped with 11th Gen Intel Core i5 processor, 8GB RAM, and high-speed 256GB SSD.",
    "badge": "Popular 11th Gen"
  },
  {
    "id": "3440",
    "lpNumber": "3440",
    "brand": "Lenovo",
    "model": "ThinkPad L14",
    "processor": "Intel Core i5",
    "generation": "11th Gen",
    "ram": "8GB",
    "storage": "256GB SSD",
    "quantity": 1,
    "soldQuantity": 0,
    "price": 32000.0,
    "image": "assets/images/laptops/lenovo-thinkpad-l14.svg",
    "gallery": [
      "assets/images/laptops/lenovo-thinkpad-l14.svg"
    ],
    "status": "published",
    "warrantyDisplay": "12 Months Store Warranty",
    "description": "Lenovo ThinkPad L14 enterprise laptop with fingerprint reader, FHD anti-glare display, and military-spec durability.",
    "badge": "Enterprise Ready"
  },
  {
    "id": "3909",
    "lpNumber": "3909",
    "brand": "HP",
    "model": "EliteBook 840 G3",
    "processor": "Intel Core i5",
    "generation": "6th Gen",
    "ram": "4GB",
    "storage": "256GB SSD",
    "quantity": 1,
    "soldQuantity": 0,
    "price": 23000.0,
    "image": "assets/images/laptops/hp-elitebook-840.svg",
    "gallery": [
      "assets/images/laptops/hp-elitebook-840.svg"
    ],
    "status": "published",
    "warrantyDisplay": "6 Months Store Warranty",
    "description": "HP EliteBook 840 G3 slim aluminum chassis business laptop with premium Bang & Olufsen audio.",
    "badge": null
  },
  {
    "id": "3963",
    "lpNumber": "3963",
    "brand": "HP",
    "model": "EliteBook 840 G5",
    "processor": "Intel Core i5",
    "generation": "8th Gen",
    "ram": "8GB",
    "storage": "256GB SSD",
    "quantity": 1,
    "soldQuantity": 0,
    "price": 26500.0,
    "image": "assets/images/laptops/hp-elitebook-840-g5.svg",
    "gallery": [
      "assets/images/laptops/hp-elitebook-840-g5.svg"
    ],
    "status": "published",
    "warrantyDisplay": "12 Months Store Warranty",
    "description": "HP EliteBook 840 G5 premium quad-core laptop with Bang & Olufsen sound, backlit keyboard, and privacy shutter.",
    "badge": "8th Gen Quad Core"
  },
  {
    "id": "3965",
    "lpNumber": "3965",
    "brand": "HP",
    "model": "EliteBook 840 G5",
    "processor": "Intel Core i5",
    "generation": "8th Gen",
    "ram": "8GB",
    "storage": "256GB SSD",
    "quantity": 1,
    "soldQuantity": 0,
    "price": 26500.0,
    "image": "assets/images/laptops/hp-elitebook-840-g5.svg",
    "gallery": [
      "assets/images/laptops/hp-elitebook-840-g5.svg"
    ],
    "status": "published",
    "warrantyDisplay": "12 Months Store Warranty",
    "description": "HP EliteBook 840 G5 enterprise workstation with backlit keyboard, FHD display, and all-day battery life.",
    "badge": "Premium Metallic"
  },
  {
    "id": "3923",
    "lpNumber": "3923",
    "brand": "HP",
    "model": "EliteBook 840 G4",
    "processor": "Intel Core i5",
    "generation": "7th Gen",
    "ram": "4GB",
    "storage": "256GB SSD",
    "quantity": 1,
    "soldQuantity": 0,
    "price": 24000.0,
    "image": "assets/images/laptops/hp-elitebook-840-g4.svg",
    "gallery": [
      "assets/images/laptops/hp-elitebook-840-g4.svg"
    ],
    "status": "published",
    "warrantyDisplay": "6 Months Store Warranty",
    "description": "HP EliteBook 840 G4 robust business laptop with anti-glare display and USB Type-C support.",
    "badge": null
  },
  {
    "id": "1859",
    "lpNumber": "1859",
    "brand": "HP",
    "model": "HP 348 G4",
    "processor": "Intel Core i5",
    "generation": "7th Gen",
    "ram": "8GB",
    "storage": "256GB SSD",
    "quantity": 1,
    "soldQuantity": 0,
    "price": 21000.0,
    "image": "assets/images/laptops/hp-348-g4.svg",
    "gallery": [
      "assets/images/laptops/hp-348-g4.svg"
    ],
    "status": "published",
    "warrantyDisplay": "6 Months Store Warranty",
    "description": "HP 348 G4 reliable student and commercial office laptop with spill-resistant keyboard.",
    "badge": null
  },
  {
    "id": "2585",
    "lpNumber": "2585",
    "brand": "HP",
    "model": "ProBook 440 G1",
    "processor": "Intel Core i5",
    "generation": "4th Gen",
    "ram": "8GB",
    "storage": "256GB SSD",
    "quantity": 1,
    "soldQuantity": 0,
    "price": 17500.0,
    "image": "assets/images/laptops/hp-probook-440-g1.svg",
    "gallery": [
      "assets/images/laptops/hp-probook-440-g1.svg"
    ],
    "status": "published",
    "warrantyDisplay": "6 Months Store Warranty",
    "description": "HP ProBook 440 G1 durable business laptop with optical drive and legacy VGA/HDMI outputs.",
    "badge": "Budget Friendly"
  },
  {
    "id": "4002",
    "lpNumber": "4002",
    "brand": "HP",
    "model": "EliteBook Folio 9480M",
    "processor": "Intel Core i5",
    "generation": "4th Gen",
    "ram": "8GB",
    "storage": "256GB SSD",
    "quantity": 4,
    "soldQuantity": 0,
    "price": 18000.0,
    "image": "assets/images/laptops/hp-elitebook-folio-9480m.svg",
    "gallery": [
      "assets/images/laptops/hp-elitebook-folio-9480m.svg"
    ],
    "status": "published",
    "warrantyDisplay": "6 Months Store Warranty",
    "description": "HP EliteBook Folio 9480M ultra-thin corporate laptop with silver aluminum finish.",
    "badge": "Ultrabook Slim"
  },
  {
    "id": "3995",
    "lpNumber": "3995",
    "brand": "HP",
    "model": "EliteBook 840 G1 Touch",
    "processor": "Intel Core i5",
    "generation": "4th Gen",
    "ram": "8GB",
    "storage": "256GB SSD",
    "quantity": 2,
    "soldQuantity": 0,
    "price": 19000.0,
    "image": "assets/images/laptops/hp-elitebook-840-g1-touch.svg",
    "gallery": [
      "assets/images/laptops/hp-elitebook-840-g1-touch.svg"
    ],
    "status": "published",
    "warrantyDisplay": "6 Months Store Warranty",
    "description": "HP EliteBook 840 G1 with responsive touchscreen display, Intel Core i5, and 8GB RAM.",
    "badge": "Touchscreen"
  },
  {
    "id": "3935",
    "lpNumber": "3935",
    "brand": "HP",
    "model": "EliteBook 840 G3",
    "processor": "Intel Core i5",
    "generation": "6th Gen",
    "ram": "8GB",
    "storage": "256GB SSD",
    "quantity": 1,
    "soldQuantity": 0,
    "price": 23000.0,
    "image": "assets/images/laptops/hp-elitebook-840.svg",
    "gallery": [
      "assets/images/laptops/hp-elitebook-840.svg"
    ],
    "status": "published",
    "warrantyDisplay": "6 Months Store Warranty",
    "description": "HP EliteBook 840 G3 with high speed 8GB RAM, 256GB SSD, and crisp Bang & Olufsen speakers.",
    "badge": null
  },
  {
    "id": "2356",
    "lpNumber": "2356",
    "brand": "Dell",
    "model": "Latitude E7450",
    "processor": "Intel Core i5",
    "generation": "5th Gen",
    "ram": "8GB",
    "storage": "256GB SSD",
    "quantity": 1,
    "soldQuantity": 0,
    "price": 19500.0,
    "image": "assets/images/laptops/dell-latitude-e7450.svg",
    "gallery": [
      "assets/images/laptops/dell-latitude-e7450.svg"
    ],
    "status": "published",
    "warrantyDisplay": "6 Months Store Warranty",
    "description": "Dell Latitude E7450 premium carbon fiber composite ultrabook with magnesium alloy base.",
    "badge": null
  },
  {
    "id": "7426",
    "lpNumber": "7426",
    "brand": "Lenovo",
    "model": "IdeaPad V130",
    "processor": "Intel Core i3",
    "generation": "7th Gen",
    "ram": "4GB",
    "storage": "256GB SSD",
    "quantity": 2,
    "soldQuantity": 0,
    "price": 18500.0,
    "image": "assets/images/laptops/lenovo-ideapad-v130.svg",
    "gallery": [
      "assets/images/laptops/lenovo-ideapad-v130.svg"
    ],
    "status": "published",
    "warrantyDisplay": "6 Months Store Warranty",
    "description": "Lenovo IdeaPad V130 lightweight commercial notebook with 180-degree hinge.",
    "badge": "Lightweight"
  },
  {
    "id": "7298",
    "lpNumber": "7298",
    "brand": "Dell",
    "model": "Vostro 3490",
    "processor": "Intel Core i5",
    "generation": "10th Gen",
    "ram": "8GB",
    "storage": "256GB SSD",
    "quantity": 5,
    "soldQuantity": 0,
    "price": 26500.0,
    "image": "assets/images/laptops/dell-vostro.svg",
    "gallery": [
      "assets/images/laptops/dell-vostro.svg"
    ],
    "status": "published",
    "warrantyDisplay": "12 Months Store Warranty",
    "description": "Dell Vostro 3490 10th Gen high efficiency corporate laptop with TPM 2.0 security chip.",
    "badge": "10th Gen Core i5"
  },
  {
    "id": "7067",
    "lpNumber": "7067",
    "brand": "Dell",
    "model": "Inspiron N4110",
    "processor": "Intel Core i3",
    "generation": "2nd Gen",
    "ram": "6GB",
    "storage": "320GB HDD",
    "quantity": 1,
    "soldQuantity": 0,
    "price": 11000.0,
    "image": "assets/images/laptops/dell-inspiron.svg",
    "gallery": [
      "assets/images/laptops/dell-inspiron.svg"
    ],
    "status": "published",
    "warrantyDisplay": "3 Months Store Warranty",
    "description": "Dell Inspiron N4110 budget friendly home computing machine with switchable lid support.",
    "badge": "Starter Range"
  },
  {
    "id": "7189",
    "lpNumber": "7189",
    "brand": "Dell",
    "model": "Vostro 3500",
    "processor": "Intel Core i5",
    "generation": "1st Gen",
    "ram": "8GB",
    "storage": "500GB HDD",
    "quantity": 1,
    "soldQuantity": 0,
    "price": 10500.0,
    "image": "assets/images/laptops/dell-vostro-3500.svg",
    "gallery": [
      "assets/images/laptops/dell-vostro-3500.svg"
    ],
    "status": "published",
    "warrantyDisplay": "3 Months Store Warranty",
    "description": "Dell Vostro 3500 classic 15.6 inch business machine with full numeric keypad.",
    "badge": "Value Workhorse"
  },
  {
    "id": "7138",
    "lpNumber": "7138",
    "brand": "Dell",
    "model": "Vostro 3569",
    "processor": "Intel Core i5",
    "generation": "6th Gen",
    "ram": "8GB",
    "storage": "256GB SSD",
    "quantity": 1,
    "soldQuantity": 0,
    "price": 20000.0,
    "image": "assets/images/laptops/dell-vostro-3569.svg",
    "gallery": [
      "assets/images/laptops/dell-vostro-3569.svg"
    ],
    "status": "published",
    "warrantyDisplay": "6 Months Store Warranty",
    "description": "Dell Vostro 3569 large screen commercial notebook with numeric keypad and anti-glare display.",
    "badge": "15.6 Inch Full HD"
  },
  {
    "id": "3790",
    "lpNumber": "3790",
    "brand": "Dell",
    "model": "Latitude 3490",
    "processor": "Intel Core i5",
    "generation": "8th Gen",
    "ram": "8GB",
    "storage": "256GB SSD",
    "quantity": 3,
    "soldQuantity": 0,
    "price": 18000.0,
    "image": "assets/images/laptops/dell-latitude-3490.svg",
    "gallery": [
      "assets/images/laptops/dell-latitude-3490.svg"
    ],
    "status": "published",
    "warrantyDisplay": "6 Months Store Warranty",
    "description": "Dell Latitude 3490 8th Gen quad core enterprise workhorse with robust chassis.",
    "badge": "Top Seller"
  },
  {
    "id": "3583",
    "lpNumber": "3583",
    "brand": "Dell",
    "model": "Latitude 3400",
    "processor": "Intel Core i3",
    "generation": "8th Gen",
    "ram": "4GB",
    "storage": "256GB SSD",
    "quantity": 1,
    "soldQuantity": 0,
    "price": 18000.0,
    "image": "assets/images/laptops/dell-latitude-3400.svg",
    "gallery": [
      "assets/images/laptops/dell-latitude-3400.svg"
    ],
    "status": "published",
    "warrantyDisplay": "6 Months Store Warranty",
    "description": "Dell Latitude 3400 sleek business device with Type-C support and narrow borders.",
    "badge": null
  },
  {
    "id": "3395",
    "lpNumber": "3395",
    "brand": "Dell",
    "model": "Latitude 3490",
    "processor": "Intel Core i3",
    "generation": "7th Gen",
    "ram": "4GB",
    "storage": "256GB SSD",
    "quantity": 2,
    "soldQuantity": 0,
    "price": 18500.0,
    "image": "assets/images/laptops/dell-latitude-3490.svg",
    "gallery": [
      "assets/images/laptops/dell-latitude-3490.svg"
    ],
    "status": "published",
    "warrantyDisplay": "6 Months Store Warranty",
    "description": "Dell Latitude 3490 durable commercial laptop for daily work with long battery backup.",
    "badge": null
  },
  {
    "id": "2741",
    "lpNumber": "2741",
    "brand": "Dell",
    "model": "Latitude 5440",
    "processor": "Intel Core i3",
    "generation": "4th Gen",
    "ram": "8GB",
    "storage": "500GB HDD",
    "quantity": 1,
    "soldQuantity": 0,
    "price": 14000.0,
    "image": "assets/images/laptops/dell-latitude-5440.svg",
    "gallery": [
      "assets/images/laptops/dell-latitude-5440.svg"
    ],
    "status": "published",
    "warrantyDisplay": "3 Months Store Warranty",
    "description": "Dell Latitude 5440 durable military grade chassis laptop with robust keyboard.",
    "badge": null
  },
  {
    "id": "7004",
    "lpNumber": "7004",
    "brand": "HP",
    "model": "Pavilion G6",
    "processor": "Intel Core i3",
    "generation": "2nd Gen",
    "ram": "4GB",
    "storage": "500GB HDD",
    "quantity": 1,
    "soldQuantity": 0,
    "price": 10000.0,
    "image": "assets/images/laptops/hp-pavilion-g6.svg",
    "gallery": [
      "assets/images/laptops/hp-pavilion-g6.svg"
    ],
    "status": "published",
    "warrantyDisplay": "3 Months Store Warranty",
    "description": "HP Pavilion G6 15.6 inch multimedia and office laptop with Altec Lansing speakers.",
    "badge": "Affordable Home"
  },
  {
    "id": "3996",
    "lpNumber": "3996",
    "brand": "Dell",
    "model": "Latitude E5450",
    "processor": "Intel Core i5",
    "generation": "5th Gen",
    "ram": "8GB",
    "storage": "256GB SSD",
    "quantity": 1,
    "soldQuantity": 0,
    "price": 18000.0,
    "image": "assets/images/laptops/dell-latitude-e5450.svg",
    "gallery": [
      "assets/images/laptops/dell-latitude-e5450.svg"
    ],
    "status": "published",
    "warrantyDisplay": "6 Months Store Warranty",
    "description": "Dell Latitude E5450 reliable magnesium alloy business ultrabook with 180 degree hinge.",
    "badge": null
  },
  {
    "id": "3128",
    "lpNumber": "3128",
    "brand": "Dell",
    "model": "Latitude 5480",
    "processor": "Intel Core i5",
    "generation": "7th Gen",
    "ram": "8GB",
    "storage": "256GB SSD",
    "quantity": 2,
    "soldQuantity": 0,
    "price": 21000.0,
    "image": "assets/images/laptops/dell-latitude-5480.svg",
    "gallery": [
      "assets/images/laptops/dell-latitude-5480.svg"
    ],
    "status": "published",
    "warrantyDisplay": "6 Months Store Warranty",
    "description": "Dell Latitude 5480 high performance enterprise laptop with long battery life and USB-C.",
    "badge": "Enterprise 7th Gen"
  },
  {
    "id": "3429",
    "lpNumber": "3429",
    "brand": "Dell",
    "model": "Latitude 5480",
    "processor": "Intel Core i5",
    "generation": "6th Gen",
    "ram": "8GB",
    "storage": "256GB SSD",
    "quantity": 1,
    "soldQuantity": 0,
    "price": 20000.0,
    "image": "assets/images/laptops/dell-latitude-5480.svg",
    "gallery": [
      "assets/images/laptops/dell-latitude-5480.svg"
    ],
    "status": "published",
    "warrantyDisplay": "6 Months Store Warranty",
    "description": "Dell Latitude 5480 tested 6th Gen commercial laptop with full port selection.",
    "badge": null
  }
];

  // 3. Initial Showroom Accessories Inventory (12 records, 105 physical pieces - Classified Separately)
  const INITIAL_ACCESSORIES = [
  {
    "id": "13",
    "sku": "ACC-CHG-65W-HP-01",
    "name": "HP 65W Blue Pin Smart AC Power Adapter",
    "brand": "HP",
    "type": "Charger",
    "model": "",
    "compatibility": "HP EliteBook 840 G3/G4/G5, ProBook 440 G1",
    "quantity": 8,
    "soldQuantity": 0,
    "price": 1250,
    "purchasePrice": 875,
    "image": "assets/images/placeholders/accessories-placeholder.svg",
    "gallery": [],
    "status": "published",
    "warranty": "1 Year Replacement",
    "description": "Genuine showroom certified accessory tested for commercial hardware compatibility."
  },
  {
    "id": "14",
    "sku": "ACC-CHG-65W-DEL-02",
    "name": "Dell 65W Round Barrel AC Power Adapter",
    "brand": "Dell",
    "type": "Charger",
    "model": "",
    "compatibility": "Dell Latitude 3400/5490/7490, Inspiron 15",
    "quantity": 6,
    "soldQuantity": 0,
    "price": 1199,
    "purchasePrice": 839,
    "image": "assets/images/placeholders/accessories-placeholder.svg",
    "gallery": [],
    "status": "published",
    "warranty": "1 Year Replacement",
    "description": "Genuine showroom certified accessory tested for commercial hardware compatibility."
  },
  {
    "id": "15",
    "sku": "ACC-CHG-65W-LEN-03",
    "name": "Lenovo 65W USB Type-C Fast Charger",
    "brand": "Lenovo",
    "type": "Charger",
    "model": "",
    "compatibility": "ThinkPad L14/T480/T490/E14, USB-C Laptops",
    "quantity": 4,
    "soldQuantity": 0,
    "price": 1450,
    "purchasePrice": 1015,
    "image": "assets/images/placeholders/accessories-placeholder.svg",
    "gallery": [],
    "status": "published",
    "warranty": "1 Year Replacement",
    "description": "Genuine showroom certified accessory tested for commercial hardware compatibility."
  },
  {
    "id": "16",
    "sku": "ACC-SSD-256G-NVM-04",
    "name": "Samsung PM991a 256GB NVMe M.2 SSD",
    "brand": "Samsung",
    "type": "Storage",
    "model": "",
    "compatibility": "All M.2 NVMe 2280 Laptops and Desktops",
    "quantity": 10,
    "soldQuantity": 0,
    "price": 1850,
    "purchasePrice": 1295,
    "image": "assets/images/placeholders/accessories-placeholder.svg",
    "gallery": [],
    "status": "published",
    "warranty": "1 Year Replacement",
    "description": "Genuine showroom certified accessory tested for commercial hardware compatibility."
  },
  {
    "id": "17",
    "sku": "ACC-SSD-512G-NVM-05",
    "name": "Crucial P3 512GB PCIe 3.0 NVMe SSD",
    "brand": "Crucial",
    "type": "Storage",
    "model": "",
    "compatibility": "Commercial 8th to 12th Gen Laptops",
    "quantity": 7,
    "soldQuantity": 0,
    "price": 2950,
    "purchasePrice": 2065,
    "image": "assets/images/placeholders/accessories-placeholder.svg",
    "gallery": [],
    "status": "published",
    "warranty": "1 Year Replacement",
    "description": "Genuine showroom certified accessory tested for commercial hardware compatibility."
  },
  {
    "id": "18",
    "sku": "ACC-RAM-08G-DDR4-06",
    "name": "Crucial 8GB DDR4 3200MHz SODIMM Laptop Memory",
    "brand": "Crucial",
    "type": "RAM",
    "model": "",
    "compatibility": "Dell Latitude, HP EliteBook, Lenovo ThinkPad",
    "quantity": 12,
    "soldQuantity": 0,
    "price": 1450,
    "purchasePrice": 1015,
    "image": "assets/images/placeholders/accessories-placeholder.svg",
    "gallery": [],
    "status": "published",
    "warranty": "1 Year Replacement",
    "description": "Genuine showroom certified accessory tested for commercial hardware compatibility."
  },
  {
    "id": "19",
    "sku": "ACC-RAM-16G-DDR4-07",
    "name": "Kingston Fury 16GB DDR4 3200MHz SODIMM RAM",
    "brand": "Kingston",
    "type": "RAM",
    "model": "",
    "compatibility": "Gaming, commercial workstations, Intel 8th-12th Gen",
    "quantity": 5,
    "soldQuantity": 0,
    "price": 2800,
    "purchasePrice": 1960,
    "image": "assets/images/placeholders/accessories-placeholder.svg",
    "gallery": [],
    "status": "published",
    "warranty": "1 Year Replacement",
    "description": "Genuine showroom certified accessory tested for commercial hardware compatibility."
  },
  {
    "id": "20",
    "sku": "ACC-MOU-WIR-LOG-08",
    "name": "Logitech B170 Wireless Ergonomic Optical Mouse",
    "brand": "Logitech",
    "type": "Mouse",
    "model": "",
    "compatibility": "Windows, macOS, Linux, ChromeOS",
    "quantity": 15,
    "soldQuantity": 0,
    "price": 599,
    "purchasePrice": 419,
    "image": "assets/images/placeholders/accessories-placeholder.svg",
    "gallery": [],
    "status": "published",
    "warranty": "1 Year Replacement",
    "description": "Genuine showroom certified accessory tested for commercial hardware compatibility."
  },
  {
    "id": "21",
    "sku": "ACC-KEY-USB-DEL-09",
    "name": "Dell KB216 Wired Multimedia Silent Keyboard",
    "brand": "Dell",
    "type": "Keyboard",
    "model": "",
    "compatibility": "Universal USB-A compatible with all computers",
    "quantity": 8,
    "soldQuantity": 0,
    "price": 649,
    "purchasePrice": 454,
    "image": "assets/images/placeholders/accessories-placeholder.svg",
    "gallery": [],
    "status": "published",
    "warranty": "1 Year Replacement",
    "description": "Genuine showroom certified accessory tested for commercial hardware compatibility."
  },
  {
    "id": "22",
    "sku": "ACC-BAG-BAC-HP-10",
    "name": "HP Odyssey 15.6-inch Durable Waterproof Backpack",
    "brand": "HP",
    "type": "Bag",
    "model": "",
    "compatibility": "Laptops up to 15.6 inch screen size",
    "quantity": 6,
    "soldQuantity": 0,
    "price": 1199,
    "purchasePrice": 839,
    "image": "assets/images/placeholders/accessories-placeholder.svg",
    "gallery": [],
    "status": "published",
    "warranty": "1 Year Replacement",
    "description": "Genuine showroom certified accessory tested for commercial hardware compatibility."
  },
  {
    "id": "23",
    "sku": "ACC-HUB-TPC-POR-11",
    "name": "Portronics 6-in-1 Type-C Multiport Adapter Hub",
    "brand": "Portronics",
    "type": "Adapter",
    "model": "",
    "compatibility": "MacBook, Dell Latitude, ThinkPad, USB-C Laptops",
    "quantity": 4,
    "soldQuantity": 0,
    "price": 1499,
    "purchasePrice": 1049,
    "image": "assets/images/placeholders/accessories-placeholder.svg",
    "gallery": [],
    "status": "published",
    "warranty": "1 Year Replacement",
    "description": "Genuine showroom certified accessory tested for commercial hardware compatibility."
  },
  {
    "id": "24",
    "sku": "ACC-CLN-KIT-PRO-12",
    "name": "Antigravity Professional Screen & Keyboard Cleaning Kit",
    "brand": "ProClean",
    "type": "Cleaning Kit",
    "model": "",
    "compatibility": "LED screens, laptop bodies, keyboards, smartphones",
    "quantity": 20,
    "soldQuantity": 0,
    "price": 199,
    "purchasePrice": 139,
    "image": "assets/images/placeholders/accessories-placeholder.svg",
    "gallery": [],
    "status": "published",
    "warranty": "1 Year Replacement",
    "description": "Genuine showroom certified accessory tested for commercial hardware compatibility."
  }
];

  // 3. Dynamic Form Field Schemas (Section 3 & Architecture)
  const CATEGORY_FORM_SCHEMAS = {
    laptop: {
      categoryName: 'Commercial Laptops',
      code: 'laptop',
      sections: [
        {
          title: 'Primary Laptop Identification',
          fields: [
            { id: 'lpNumber', label: 'LP NO.', type: 'text', placeholder: 'e.g. 3964', required: true, hint: 'Unique showroom inventory number' },
            { id: 'modelBrand', label: 'MODEL & BRAND', type: 'text', placeholder: 'e.g. HP EliteBook 840 G5', required: true, hint: 'Include brand and specific model' },
            { id: 'processor', label: 'PROCESSOR', type: 'text', placeholder: 'e.g. Intel Core i5', required: true },
            { id: 'generation', label: 'GENERATION', type: 'text', placeholder: 'e.g. 8th Gen', required: true }
          ]
        },
        {
          title: 'Hardware Specifications',
          fields: [
            { id: 'ram', label: 'RAM', type: 'text', placeholder: 'e.g. 8GB DDR4', required: true },
            { id: 'storage', label: 'STORAGE', type: 'text', placeholder: 'e.g. 256GB SSD', required: true },
            { id: 'quantity', label: 'Piece', type: 'number', placeholder: 'e.g. 1', required: true, min: 1, defaultValue: 1 },
            { id: 'price', label: 'Price', type: 'number', placeholder: 'e.g. 26500', required: true, min: 0 }
          ]
        },
        {
          title: 'Catalog Visuals & Publication Status',
          fields: [
            { id: 'status', label: 'Product Status', type: 'select', options: [{ value: 'published', label: 'Published (Visible in Catalog)' }, { value: 'draft', label: 'Draft (Showroom Review)' }], required: true },
            { id: 'warrantyDisplay', label: 'Warranty Terms', type: 'text', placeholder: 'e.g. 6-12 Months Store Warranty', required: false },
            { id: 'description', label: 'Public Description', type: 'textarea', placeholder: 'Commercial grade durable business laptop tested for office, development and student use...', required: false }
          ]
        }
      ]
    },
    accessories: {
      categoryName: 'Laptop Accessories',
      code: 'accessories',
      sections: [
        {
          title: 'Accessory SKU & Identification',
          fields: [
            { id: 'sku', label: 'SKU / Item Code', type: 'text', placeholder: 'e.g. ACC-CHG-HP-01', required: true, hint: 'Store barcode or item code' },
            { id: 'name', label: 'Product Name', type: 'text', placeholder: 'e.g. HP 65W Blue Pin Smart AC Adapter', required: true },
            { id: 'brand', label: 'Brand', type: 'text', placeholder: 'e.g. HP, Dell, Logitech, Crucial', required: true },
            { id: 'type', label: 'Accessory Type', type: 'select', options: [
              { value: 'Charger', label: 'Charger & Power Adapter' },
              { value: 'RAM Upgrade', label: 'RAM Memory' },
              { value: 'Storage Upgrade', label: 'SSD / Storage' },
              { value: 'Peripherals', label: 'Mouse & Keyboard' },
              { value: 'Laptop Bag', label: 'Backpack & Sleeve' },
              { value: 'Laptop Stand', label: 'Cooling Pad & Stand' },
              { value: 'Cable & Adapter', label: 'Cable, Hub & Converter' }
            ], required: true }
          ]
        },
        {
          title: 'Compatibility & Hardware Specs',
          fields: [
            { id: 'model', label: 'Model', type: 'text', placeholder: 'e.g. 710412-001', required: false },
            { id: 'compatibility', label: 'Compatibility', type: 'text', placeholder: 'e.g. HP EliteBook 840 G3/G4/G5', required: true },
            { id: 'connectivity', label: 'Connectivity', type: 'text', placeholder: 'e.g. 4.5mm Blue Pin / USB Type-C', required: false },
            { id: 'color', label: 'Color', type: 'text', placeholder: 'e.g. Black / Silver', required: false },
            { id: 'warranty', label: 'Warranty', type: 'text', placeholder: 'e.g. 1 Year Brand Replacement', required: true }
          ]
        },
        {
          title: 'Quantity & Commercial Pricing',
          fields: [
            { id: 'quantity', label: 'Piece / Quantity', type: 'number', placeholder: 'e.g. 5', required: true, min: 1, defaultValue: 1 },
            { id: 'purchasePrice', label: 'Purchase Price (Admin-Only)', type: 'number', placeholder: 'e.g. 650', required: true, hint: 'Protected: Never exposed on public website' },
            { id: 'price', label: 'Selling Price (Public INR)', type: 'number', placeholder: 'e.g. 1250', required: true },
            { id: 'status', label: 'Status', type: 'select', options: [{ value: 'published', label: 'Published' }, { value: 'draft', label: 'Draft' }], required: true }
          ]
        },
        {
          title: 'Description & Notes',
          fields: [
            { id: 'description', label: 'Description', type: 'textarea', placeholder: 'Detailed product specifications, warranty conditions, and genuine verification details...', required: false }
          ]
        }
      ]
    }
  };

  // 4. Central Admin State Manager
  class AdminStateManager {
    constructor() {
      this.STORAGE_KEY = 'egadget_admin_prod_v6';
      localStorage.removeItem('egadget_admin_prod_v5');
      try {
        localStorage.removeItem('egadget_admin_prod_v1');
        localStorage.removeItem('egadget_admin_prod_v2');
        localStorage.removeItem('egadget_admin_prod_v3');
        localStorage.removeItem('egadget_admin_prod_v4');
        localStorage.removeItem('egadget_admin_state');
      } catch (e) {}
      this.state = this.loadState();
    }

    // Load initial or persisted state
    loadState() {
      try {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return parsed;
        }
      } catch (err) {
        console.warn('Failed reading admin state from localStorage:', err);
      }

      // Verified authoritative showroom state
      return {
        categories: JSON.parse(JSON.stringify(INITIAL_CATEGORIES)),
        laptops: JSON.parse(JSON.stringify(INITIAL_LAPTOPS)),
        accessories: JSON.parse(JSON.stringify(INITIAL_ACCESSORIES)),
        sales: [],
        demoModeActive: false
      };
    }

    normalizeInitialLaptops() {
      return [];
    }

    saveState() {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
      } catch (err) {
        console.error('Failed saving admin state to localStorage:', err);
      }
    }

    async syncWithBackend() {
      const token = localStorage.getItem('egadget_admin_token');
      const apiBase = (typeof getApiBase === 'function') ? getApiBase() : (window.location.port === '8000' ? '' : 'http://127.0.0.1:8000');

      try {
        const headers = {
          'Accept': 'application/json'
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        // 1. Fetch Laptops from MySQL (admin or public fallback)
        const lpUrl = token ? `${apiBase}/api/admin/laptops?per_page=100` : `${apiBase}/api/public/laptops`;
        const lpRes = await fetch(lpUrl, { headers });
        if (lpRes.ok) {
          const lpData = await lpRes.json();
          if (lpData.success && Array.isArray(lpData.data)) {
            this.state.laptops = lpData.data.map(l => ({
              id: String(l.id),
              lpNumber: String(l.lp_no),
              brand: l.brand,
              model: l.model,
              processor: l.processor,
              generation: l.generation,
              ram: l.ram,
              storage: l.storage,
              quantity: typeof l.piece === 'number' ? l.piece : parseInt(l.piece, 10) || 0,
              soldQuantity: 0,
              price: Number(l.price),
              image: l.pic || '../assets/images/placeholders/laptop-placeholder.svg',
              gallery: l.gallery || [],
              status: l.status || 'published',
              warrantyDisplay: '6-12 Months Store Warranty',
              description: l.desc || '',
              badge: l.badge || ''
            }));
          }
        }

        // 2. Fetch Accessories from MySQL (admin or public fallback)
        const accUrl = token ? `${apiBase}/api/admin/accessories?per_page=100` : `${apiBase}/api/public/accessories`;
        const accRes = await fetch(accUrl, { headers });
        if (accRes.ok) {
          const accData = await accRes.json();
          if (accData.success && Array.isArray(accData.data)) {
            this.state.accessories = accData.data.map(a => ({
              id: String(a.id),
              sku: a.sku,
              name: a.name,
              brand: a.brand,
              type: a.type,
              model: a.model || '',
              compatibility: a.compatibility || '',
              quantity: typeof a.piece === 'number' ? a.piece : parseInt(a.piece, 10) || 0,
              soldQuantity: 0,
              price: Number(a.price),
              purchasePrice: Number(a.price) * 0.7,
              image: a.pic || '../assets/images/placeholders/accessories-placeholder.svg',
              gallery: [],
              status: a.status || 'published',
              warranty: '1 Year Replacement',
              description: a.desc || ''
            }));
          }
        }

        // 3. Fetch Sales from MySQL
        const salesRes = await fetch(`${apiBase}/api/admin/sales?per_page=50`, { headers });
        if (salesRes.ok) {
          const salesData = await salesRes.json();
          if (salesData.success && Array.isArray(salesData.data)) {
            this.state.sales = salesData.data.map(s => {
              const item = (s.items && s.items[0]) ? s.items[0] : null;
              return {
                id: String(s.inv_no || s.id),
                date: (s.created_at || '').split('T')[0] || new Date().toISOString().split('T')[0],
                productId: item ? String(item.item_id) : '',
                productName: item ? item.title : 'Inventory Item',
                lpNumber: item ? (item.sku_lp || '') : '',
                category: (item && item.item_type === 'laptop') ? 'Commercial Laptops' : 'Laptop Accessories',
                quantity: item ? item.qty : 1,
                unitPrice: item ? Number(item.price) : Number(s.total),
                totalAmount: Number(s.total),
                paymentMethod: s.payment || 'Cash',
                customerName: s.customer || 'Walk-in Guest',
                customerPhone: s.phone || '',
                notes: s.notes || '',
                status: 'Completed',
                isLive: true
              };
            });
          }
        }

        this.state.demoModeActive = false;
        this.updateCategoryCounts();
        this.saveState();
        return true;
      } catch (err) {
        console.warn('Backend sync failed, continuing with current state:', err);
        return false;
      }
    }

    resetLocalCache() {
      localStorage.removeItem(this.STORAGE_KEY);
      this.state = this.loadState();
      return true;
    }

    // Public Stock Rules Presentation Helper (Section 6)
    static getPublicStockPresentation(quantity) {
      const qty = Number(quantity) || 0;
      if (qty > 2) {
        return { label: 'In Stock', badgeClass: 'stock-in', isAvailable: true, displayCode: 'in_stock' };
      } else if (qty === 2) {
        return { label: 'Only 2 Left', badgeClass: 'stock-low', isAvailable: true, displayCode: 'only_2_left' };
      } else if (qty === 1) {
        return { label: 'Only 1 Left', badgeClass: 'stock-critical', isAvailable: true, displayCode: 'only_1_left' };
      } else {
        return { label: 'Sold Out', badgeClass: 'stock-soldout', isAvailable: false, displayCode: 'sold_out' };
      }
    }

    // Sales Statistics Engine (Section 8 & 9)
    getStatistics() {
      const todayStr = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let todaySalesRevenue = 0;
      let todaySalesCount = 0;
      let yesterdaySalesRevenue = 0;
      let yesterdaySalesCount = 0;
      let totalSalesRevenue = 0;
      let totalSalesCount = this.state.sales.length;
      let totalSoldUnits = 0;

      this.state.sales.forEach(sale => {
        const amount = Number(sale.totalAmount) || 0;
        const qty = Number(sale.quantity) || 1;
        totalSalesRevenue += amount;
        totalSoldUnits += qty;

        if (sale.date === todayStr) {
          todaySalesRevenue += amount;
          todaySalesCount += 1;
        } else if (sale.date === yesterdayStr) {
          yesterdaySalesRevenue += amount;
          yesterdaySalesCount += 1;
        }
      });

      // Laptop pieces
      let totalLaptopUnits = 0;
      let lowStockLaptops = 0;
      let outOfStockLaptops = 0;
      this.state.laptops.forEach(lp => {
        const q = Number(lp.quantity) || 0;
        totalLaptopUnits += q;
        if (q === 0) outOfStockLaptops++;
        else if (q <= 2) lowStockLaptops++;
      });

      // Accessories pieces
      let totalAccessoryUnits = 0;
      let lowStockAccessories = 0;
      let outOfStockAccessories = 0;
      this.state.accessories.forEach(acc => {
        const q = Number(acc.quantity) || 0;
        totalAccessoryUnits += q;
        if (q === 0) outOfStockAccessories++;
        else if (q <= 2) lowStockAccessories++;
      });

      const totalItemsUnits = totalLaptopUnits + totalAccessoryUnits;
      const totalProductsModels = this.state.laptops.length + this.state.accessories.length;
      const lowStockItems = lowStockLaptops + lowStockAccessories;
      const outOfStockItems = outOfStockLaptops + outOfStockAccessories;
      const remainingStock = totalItemsUnits;

      return {
        // 1. Sales Analytics (Section 8)
        todayRevenue: todaySalesRevenue,
        todayCount: todaySalesCount,
        yesterdayRevenue: yesterdaySalesRevenue,
        yesterdayCount: yesterdaySalesCount,
        allTimeRevenue: totalSalesRevenue,
        allTimeInvoices: totalSalesCount,
        totalSoldUnits,

        // 2. Dedicated Laptop Analytics (25 Models, 39 Physical Pieces)
        laptopModels: this.state.laptops.length,
        laptopUnits: totalLaptopUnits,
        lowStockLaptops: lowStockLaptops,
        outOfStockLaptops: outOfStockLaptops,

        // 3. Dedicated Showroom Accessories Analytics (12 Models, 105 Physical Pieces)
        accessoriesModels: this.state.accessories.length,
        accessoriesUnits: totalAccessoryUnits,
        lowStockAccessories: lowStockAccessories,
        outOfStockAccessories: outOfStockAccessories,

        // 4. Combined Store Overview (37 SKUs, 144 Pieces)
        combinedModels: totalProductsModels,
        combinedUnits: totalItemsUnits,
        combinedLowStock: lowStockItems,
        combinedOutOfStock: outOfStockItems,

        // Legacy / Backward Compatibility
        totalItemsUnits,
        remainingStock: totalLaptopUnits,
        totalProductsModels: this.state.laptops.length,
        lowStockItems: lowStockLaptops,
        outOfStockItems: outOfStockLaptops,
        laptopCount: this.state.laptops.length,
        accessoriesCount: this.state.accessories.length
      };
    }

    // Record Sold Item (Section 7 — UI ONLY)
    recordSale(saleParams) {
      const {
        category,
        itemId,
        quantity,
        unitPrice,
        customerName,
        customerPhone,
        paymentMethod,
        notes,
        saleDate
      } = saleParams;

      const qtyToSell = parseInt(quantity, 10);
      if (isNaN(qtyToSell) || qtyToSell <= 0) {
        throw new Error('Please enter a valid positive sale quantity.');
      }

      let product = null;
      let categoryName = 'Commercial Laptops';
      let lpOrSku = '';

      if (category === 'laptop') {
        product = this.state.laptops.find(l => l.id === itemId || l.lpNumber === itemId);
        categoryName = 'Commercial Laptops';
        if (product) lpOrSku = `LP #${product.lpNumber}`;
      } else {
        product = this.state.accessories.find(a => a.id === itemId || a.sku === itemId);
        categoryName = 'Laptop Accessories';
        if (product) lpOrSku = product.sku;
      }

      if (!product) {
        throw new Error('Item not found in current inventory.');
      }

      if (product.quantity < qtyToSell) {
        throw new Error(`Insufficient stock. Only ${product.quantity} piece(s) available.`);
      }

      const totalAmount = qtyToSell * (Number(unitPrice) || product.price);

      // 1. Update product demo stock
      product.quantity -= qtyToSell;
      product.soldQuantity = (product.soldQuantity || 0) + qtyToSell;

      // 2. Create sale record
      const saleRecord = {
        id: `SALE-${Date.now().toString().slice(-5)}`,
        date: saleDate || new Date().toISOString().split('T')[0],
        productId: product.id,
        productName: category === 'laptop' ? `${product.brand} ${product.model} (${lpOrSku})` : product.name,
        lpNumber: lpOrSku,
        category: categoryName,
        quantity: qtyToSell,
        unitPrice: Number(unitPrice) || product.price,
        totalAmount,
        paymentMethod: paymentMethod || 'Cash',
        customerName: customerName ? customerName.trim() : 'Walk-in Showroom Guest',
        customerPhone: customerPhone ? customerPhone.trim() : 'N/A',
        notes: notes ? notes.trim() : '',
        status: 'Completed'
      };

      this.state.sales.unshift(saleRecord);
      this.saveState();

      // If authenticated admin, dispatch real MySQL transaction with row-locking
      const token = localStorage.getItem('egadget_admin_token');
      if (token) {
        const apiBase = (typeof getApiBase === 'function') ? getApiBase() : (window.location.port === '8000' ? '' : 'http://127.0.0.1:8000');
        fetch(`${apiBase}/api/admin/sales`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            item_type: category,
            item_id: product.id || (category === 'laptop' ? product.lpNumber : product.sku),
            qty: qtyToSell,
            price: Number(unitPrice) || product.price,
            customer: customerName || 'Walk-in Guest',
            phone: customerPhone || '',
            payment: (paymentMethod || 'cash').toLowerCase(),
            notes: notes || ''
          })
        }).then(r => r.json()).then(data => {
          if (data && data.success) {
            console.log('Sale saved to MySQL. Invoice:', data.invoice);
            this.syncWithBackend().then(() => {
              if (window.adminController && typeof window.adminController.renderCurrentView === 'function') {
                window.adminController.renderCurrentView();
              }
            });
          }
        }).catch(err => console.warn('Could not post sale to MySQL backend:', err));
      }

      return saleRecord;
    }

    // Cancel Demo Sale
    cancelSale(saleId) {
      const index = this.state.sales.findIndex(s => s.id === saleId);
      if (index === -1) throw new Error('Sale record not found.');

      const sale = this.state.sales[index];

      // Restore stock
      if (sale.category === 'Commercial Laptops') {
        const lpClean = sale.lpNumber.replace('LP #', '').trim();
        const lp = this.state.laptops.find(l => l.lpNumber === lpClean || l.id === sale.productId);
        if (lp) {
          lp.quantity += sale.quantity;
          lp.soldQuantity = Math.max(0, (lp.soldQuantity || 0) - sale.quantity);
        }
      } else {
        const acc = this.state.accessories.find(a => a.sku === sale.lpNumber || a.id === sale.productId);
        if (acc) {
          acc.quantity += sale.quantity;
          acc.soldQuantity = Math.max(0, (acc.soldQuantity || 0) - sale.quantity);
        }
      }

      this.state.sales.splice(index, 1);
      this.saveState();
      return true;
    }

    // Add Laptop
    addLaptop(data) {
      const lpNum = String(data.lpNumber).trim();
      if (!lpNum) throw new Error('LP NO. is required.');

      const exists = this.state.laptops.some(l => l.lpNumber.toLowerCase() === lpNum.toLowerCase());
      if (exists) {
        throw new Error(`LP #${lpNum} already exists in laptop inventory.`);
      }

      const newLaptop = {
        id: `lp-${Date.now()}`,
        lpNumber: lpNum,
        brand: data.brand || 'Commercial',
        model: data.model || 'Business Laptop',
        processor: data.processor || 'Intel Core i5',
        generation: data.generation || '8th Gen',
        ram: data.ram || '8GB',
        storage: data.storage || '256GB SSD',
        quantity: parseInt(data.quantity, 10) || 1,
        soldQuantity: 0,
        price: Number(data.price) || 20000,
        image: data.image || '../assets/images/placeholders/laptop-placeholder.svg',
        gallery: data.gallery || [],
        status: data.status || 'published',
        warrantyDisplay: data.warrantyDisplay || '6-12 Months Store Warranty',
        description: data.description || 'Commercial tested laptop.'
      };

      this.state.laptops.unshift(newLaptop);
      this.updateCategoryCounts();
      this.saveState();
      return newLaptop;
    }

    // Add Accessory
    addAccessory(data) {
      const sku = String(data.sku).trim();
      if (!sku) throw new Error('SKU / Item Code is required.');

      const exists = this.state.accessories.some(a => a.sku.toLowerCase() === sku.toLowerCase());
      if (exists) {
        throw new Error(`SKU ${sku} already exists in accessories inventory.`);
      }

      const newAcc = {
        id: `acc-${Date.now()}`,
        sku,
        name: data.name || 'Laptop Accessory',
        brand: data.brand || 'Generic',
        type: data.type || 'Charger',
        model: data.model || '',
        compatibility: data.compatibility || 'Universal',
        connectivity: data.connectivity || '',
        color: data.color || 'Black',
        warranty: data.warranty || '1 Year Replacement',
        description: data.description || '',
        quantity: parseInt(data.quantity, 10) || 1,
        soldQuantity: 0,
        purchasePrice: Number(data.purchasePrice) || 500,
        price: Number(data.price) || 999,
        image: data.image || '../assets/images/placeholders/accessories-placeholder.svg',
        gallery: data.gallery || [],
        status: data.status || 'published'
      };

      this.state.accessories.unshift(newAcc);
      this.updateCategoryCounts();
      this.saveState();
      return newAcc;
    }

    // Toggle status (Published <-> Draft)
    toggleItemStatus(category, id) {
      const list = category === 'laptop' ? this.state.laptops : this.state.accessories;
      const item = list.find(x => x.id === id || x.lpNumber === id || x.sku === id);
      if (!item) return false;
      item.status = item.status === 'published' ? 'draft' : 'published';
      this.saveState();
      return item.status;
    }

    // Delete Item
    deleteItem(category, id) {
      if (category === 'laptop') {
        this.state.laptops = this.state.laptops.filter(l => l.id !== id && l.lpNumber !== id);
      } else {
        this.state.accessories = this.state.accessories.filter(a => a.id !== id && a.sku !== id);
      }
      this.updateCategoryCounts();
      this.saveState();
      return true;
    }

    // Categories Methods (Section 2)
    addCategory(catData) {
      const name = (catData.name || '').trim();
      if (!name) throw new Error('Category Name is required.');

      const slug = (catData.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')).trim();
      const code = (catData.code || slug).trim();

      const newCat = {
        id: `cat-${Date.now()}`,
        name,
        slug,
        code,
        description: catData.description || '',
        image: catData.image || '../assets/images/placeholders/product-placeholder.svg',
        status: catData.status || 'active',
        displayOrder: parseInt(catData.displayOrder, 10) || (this.state.categories.length + 1),
        itemCount: 0
      };

      this.state.categories.push(newCat);
      this.saveState();
      return newCat;
    }

    toggleCategoryStatus(catId) {
      const cat = this.state.categories.find(c => c.id === catId);
      if (cat) {
        cat.status = cat.status === 'active' ? 'inactive' : 'active';
        this.saveState();
        return cat.status;
      }
      return null;
    }

    deleteCategory(catId) {
      this.state.categories = this.state.categories.filter(c => c.id !== catId);
      this.saveState();
      return true;
    }

    updateCategoryCounts() {
      const catLaptops = this.state.categories.find(c => c.code === 'laptop');
      if (catLaptops) catLaptops.itemCount = this.state.laptops.length;

      const catAcc = this.state.categories.find(c => c.code === 'accessories');
      if (catAcc) catAcc.itemCount = this.state.accessories.length;
    }

    // Bulk Import Laptops (Syncs State and Live MySQL Backend)
    async importLaptops(items) {
      if (!Array.isArray(items) || items.length === 0) {
        return { success: false, message: 'No laptop items provided.' };
      }

      const importedItems = items.map((item, idx) => ({
        id: item.id || `lp-imp-${Date.now()}-${idx}`,
        lpNumber: String(item.lpNumber || item.lp_no || (4000 + idx)),
        brand: item.brand || 'Commercial',
        model: item.model || 'Laptop',
        processor: item.processor || 'Intel Core i5',
        generation: item.generation || '8th Gen',
        ram: item.ram || '8GB',
        storage: item.storage || '256GB SSD',
        quantity: typeof item.quantity === 'number' ? item.quantity : (parseInt(item.piece, 10) || 1),
        soldQuantity: 0,
        price: Number(item.price) || 20000,
        image: item.image || item.pic || '../assets/images/placeholders/laptop-placeholder.svg',
        gallery: item.gallery || [],
        status: item.status || 'published',
        warrantyDisplay: item.warrantyDisplay || '6-12 Months Store Warranty',
        description: item.description || item.desc || '',
        badge: item.badge || ''
      }));

      // Update existing by lpNumber or append
      importedItems.forEach(newItem => {
        const existingIdx = this.state.laptops.findIndex(l => String(l.lpNumber) === String(newItem.lpNumber));
        if (existingIdx >= 0) {
          this.state.laptops[existingIdx] = { ...this.state.laptops[existingIdx], ...newItem };
        } else {
          this.state.laptops.unshift(newItem);
        }
      });

      this.updateCategoryCounts();
      this.saveState();

      // Backend MySQL Sync
      try {
        const token = localStorage.getItem('egadget_admin_token');
        const apiBase = (typeof getApiBase === 'function') ? getApiBase() : (window.location.port === '8000' ? '' : 'http://127.0.0.1:8000');
        const payload = importedItems.map(l => ({
          lp_no: l.lpNumber,
          brand: l.brand,
          model: l.model,
          processor: l.processor,
          generation: l.generation,
          ram: l.ram,
          storage: l.storage,
          piece: l.quantity,
          price: l.price,
          pic: l.image,
          status: l.status,
          desc: l.description
        }));

        await fetch(`${apiBase}/api/admin/laptops/import`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ items: payload })
        });
      } catch (err) {
        console.warn('Backend MySQL laptop sync warning:', err);
      }

      return { success: true, count: importedItems.length };
    }

    // Bulk Import Accessories (Syncs State and Live MySQL Backend)
    async importAccessories(items) {
      if (!Array.isArray(items) || items.length === 0) {
        return { success: false, message: 'No accessory items provided.' };
      }

      const importedItems = items.map((item, idx) => ({
        id: item.id || `acc-imp-${Date.now()}-${idx}`,
        sku: item.sku || `ACC-${Date.now()}-${idx}`,
        name: item.name || 'Laptop Accessory',
        brand: item.brand || 'Generic',
        type: item.type || 'Charger',
        model: item.model || '',
        compatibility: item.compatibility || '',
        connectivity: item.connectivity || '',
        color: item.color || '',
        quantity: typeof item.quantity === 'number' ? item.quantity : (parseInt(item.piece, 10) || 1),
        soldQuantity: 0,
        price: Number(item.price) || 1000,
        purchasePrice: Number(item.purchasePrice) || (Number(item.price) * 0.7) || 700,
        image: item.image || item.pic || '../assets/images/placeholders/accessories-placeholder.svg',
        gallery: item.gallery || [],
        status: item.status || 'published',
        warranty: item.warranty || '1 Year Replacement',
        description: item.description || item.desc || ''
      }));

      // Update existing by sku or append
      importedItems.forEach(newItem => {
        const existingIdx = this.state.accessories.findIndex(a => a.sku.toLowerCase() === newItem.sku.toLowerCase());
        if (existingIdx >= 0) {
          this.state.accessories[existingIdx] = { ...this.state.accessories[existingIdx], ...newItem };
        } else {
          this.state.accessories.unshift(newItem);
        }
      });

      this.updateCategoryCounts();
      this.saveState();

      // Backend MySQL Sync
      try {
        const token = localStorage.getItem('egadget_admin_token');
        const apiBase = (typeof getApiBase === 'function') ? getApiBase() : (window.location.port === '8000' ? '' : 'http://127.0.0.1:8000');
        const payload = importedItems.map(a => ({
          sku: a.sku,
          name: a.name,
          brand: a.brand,
          type: a.type,
          model: a.model,
          compatibility: a.compatibility,
          piece: a.quantity,
          price: a.price,
          pic: a.image,
          status: a.status,
          desc: a.description
        }));

        await fetch(`${apiBase}/api/admin/accessories/import`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ items: payload })
        });
      } catch (err) {
        console.warn('Backend MySQL accessory sync warning:', err);
      }

      return { success: true, count: importedItems.length };
    }

    // Excel / CSV Template Generator (Section 11)
    static generateTemplateCSV(type) {
      if (type === 'laptop') {
        const headers = ['LP NO.', 'MODEL & BRAND', 'PROCESSOR', 'GENERATION', 'RAM', 'STORAGE', 'Piece', 'Price', 'PIC'];
        const sampleRows = [
          ['3965', 'HP EliteBook 840 G5', 'Intel Core i5', '8th Gen', '8GB', '256GB SSD', '1', '26500', 'assets/images/laptops/hp-elitebook-840.svg'],
          ['3970', 'Dell Latitude 5490', 'Intel Core i5', '8th Gen', '16GB', '512GB SSD', '2', '28000', '']
        ];
        return [headers.join(','), ...sampleRows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
      } else {
        const headers = ['SKU', 'Product Name', 'Brand', 'Accessory Type', 'Model', 'Compatibility', 'Color', 'Warranty', 'Piece', 'Selling Price', 'PIC', 'Description'];
        const sampleRows = [
          ['ACC-CHG-HP-05', 'HP 65W Smart Adapter', 'HP', 'Charger', '710412-001', 'HP EliteBook Series', 'Black', '12 Months', '4', '1250', '', 'Genuine replacement power adapter'],
          ['ACC-RAM-8GB-06', 'Crucial 8GB DDR4 RAM', 'Crucial', 'RAM Upgrade', 'CT8G4SFS824A', 'Universal DDR4 SODIMM', 'Green', '3 Years', '5', '1850', '', 'High speed RAM upgrade module']
        ];
        return [headers.join(','), ...sampleRows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
      }
    }

    // CSV Exporter (Section 11)
    exportInventoryCSV(category) {
      let headers = [];
      let rows = [];

      if (category === 'laptop') {
        headers = ['LP NO.', 'MODEL & BRAND', 'PROCESSOR', 'GENERATION', 'RAM', 'STORAGE', 'Piece', 'Price', 'PIC', 'Status'];
        rows = this.state.laptops.map(l => [
          l.lpNumber,
          `${l.brand} ${l.model}`,
          l.processor,
          l.generation,
          l.ram,
          l.storage,
          l.quantity,
          l.price,
          l.image,
          l.status
        ]);
      } else if (category === 'accessories') {
        headers = ['SKU', 'Product Name', 'Brand', 'Accessory Type', 'Model', 'Compatibility', 'Color', 'Warranty', 'Piece', 'Selling Price', 'PIC', 'Status'];
        rows = this.state.accessories.map(a => [
          a.sku,
          a.name,
          a.brand,
          a.type,
          a.model,
          a.compatibility,
          a.color,
          a.warranty,
          a.quantity,
          a.price,
          a.image,
          a.status
        ]);
      } else {
        // Combined
        headers = ['Category', 'ID / SKU', 'Product Name', 'Key Specs', 'Piece', 'Price', 'Status'];
        const laptopRows = this.state.laptops.map(l => [
          'Commercial Laptop',
          `LP #${l.lpNumber}`,
          `${l.brand} ${l.model}`,
          `${l.processor} | ${l.ram} | ${l.storage}`,
          l.quantity,
          l.price,
          l.status
        ]);
        const accRows = this.state.accessories.map(a => [
          'Laptop Accessory',
          a.sku,
          a.name,
          `${a.brand} ${a.type} | ${a.compatibility}`,
          a.quantity,
          a.price,
          a.status
        ]);
        rows = [...laptopRows, ...accRows];
      }

      const csvContent = [
        headers.join(','),
        ...rows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      return csvContent;
    }
  }

  // Attach global instances
  window.CATEGORY_FORM_SCHEMAS = CATEGORY_FORM_SCHEMAS;
  window.AdminStateManager = AdminStateManager;
  window.adminState = new AdminStateManager();

})(window);
