/**
 * E-Gadget World â Product Inventory & Data Utilities
 * Mehnajpur Branch Inventory (24 records, 38 pieces total)
 */

const PRODUCT_INVENTORY = [
  {
    "id": "3930",
    "lpNumber": "3930",
    "brand": "Lenovo",
    "model": "ThinkPad L14",
    "processor": "Intel Core i5",
    "generation": "11th Gen",
    "generationNum": 11,
    "ram": "8GB",
    "ramNum": 8,
    "storage": "256GB SSD",
    "storageType": "SSD",
    "storageCapacity": "256GB",
    "price": 32000,
    "quantity": 2,
    "condition": "Refurbished / Tested",
    "warrantyMonths": null,
    "warrantyDisplay": "Warranty: Please Confirm with Store",
    "images": ["assets/images/laptops/lenovo-thinkpad-l14.svg"],
    "featured": true,
    "badge": "Popular 11th Gen",
    "description": "Lenovo ThinkPad L14 business-grade durable laptop equipped with 11th Gen Intel Core i5 processor, 8GB RAM, and high-speed 256GB SSD for seamless multitasking and productivity.",
    "reviewFlag": null
  },
  {
    "id": "3440",
    "lpNumber": "3440",
    "brand": "Lenovo",
    "model": "ThinkPad L14",
    "processor": "Intel Core i5",
    "generation": "11th Gen",
    "generationNum": 11,
    "ram": "8GB",
    "ramNum": 8,
    "storage": "256GB SSD",
    "storageType": "SSD",
    "storageCapacity": "256GB",
    "price": 32000,
    "quantity": 1,
    "condition": "Refurbished / Tested",
    "warrantyMonths": null,
    "warrantyDisplay": "Warranty: Please Confirm with Store",
    "images": ["assets/images/laptops/lenovo-thinkpad-l14.svg"],
    "featured": false,
    "badge": "11th Gen Workhorse",
    "description": "Premium business-series Lenovo ThinkPad L14 powered by 11th Gen Intel Core i5 with ergonomic keyboard, solid build, and fast 256GB SSD storage.",
    "reviewFlag": null
  },
  {
    "id": "3909",
    "lpNumber": "3909",
    "brand": "HP",
    "model": "EliteBook 840 G3",
    "processor": "Intel Core i5",
    "generation": "6th Gen",
    "generationNum": 6,
    "ram": "4GB",
    "ramNum": 4,
    "storage": "256GB SSD",
    "storageType": "SSD",
    "storageCapacity": "256GB",
    "price": 23000,
    "quantity": 1,
    "condition": "Refurbished / Tested",
    "warrantyMonths": null,
    "warrantyDisplay": "Warranty: Please Confirm with Store",
    "images": ["assets/images/laptops/hp-elitebook-840.svg"],
    "featured": false,
    "badge": "Slim Corporate",
    "description": "HP EliteBook 840 G3 featuring an ultra-slim aluminum body, 6th Gen Intel Core i5, 4GB RAM, and 256GB SSD storage for corporate and office tasks.",
    "reviewFlag": null
  },
  {
    "id": "3963",
    "lpNumber": "3963",
    "brand": "HP",
    "model": "EliteBook 840 G5",
    "processor": "Intel Core i5",
    "generation": "8th Gen",
    "generationNum": 8,
    "ram": "8GB",
    "ramNum": 8,
    "storage": "256GB SSD",
    "storageType": "SSD",
    "storageCapacity": "256GB",
    "price": 26500,
    "quantity": 1,
    "condition": "Refurbished / Tested",
    "warrantyMonths": null,
    "warrantyDisplay": "Warranty: Please Confirm with Store",
    "images": ["assets/images/laptops/hp-elitebook-840-g5.svg"],
    "featured": true,
    "badge": "Premium Aluminum Series",
    "description": "HP EliteBook 840 G5 premium business laptop with 8th Gen Quad-Core Intel Core i5, precision aluminum unibody chassis, 8GB RAM, and 256GB SSD.",
    "reviewFlag": null
  },
  {
    "id": "3923",
    "lpNumber": "3923",
    "brand": "HP",
    "model": "EliteBook 840 G4",
    "processor": "Intel Core i5",
    "generation": "7th Gen",
    "generationNum": 7,
    "ram": "4GB",
    "ramNum": 4,
    "storage": "256GB SSD",
    "storageType": "SSD",
    "storageCapacity": "256GB",
    "price": 24000,
    "quantity": 1,
    "condition": "Refurbished / Tested",
    "warrantyMonths": null,
    "warrantyDisplay": "Warranty: Please Confirm with Store",
    "images": ["assets/images/laptops/hp-elitebook-840-g4.svg"],
    "featured": false,
    "badge": "Durable & Sleek",
    "description": "HP EliteBook 840 G4 sleek business notebook with 7th Gen Intel Core i5, 4GB RAM, and responsive 256GB SSD storage for dependable performance.",
    "reviewFlag": null
  },
  {
    "id": "1859",
    "lpNumber": "1859",
    "brand": "HP",
    "model": "HP 348 G4",
    "processor": "Intel Core i5",
    "generation": "7th Gen",
    "generationNum": 7,
    "ram": "8GB",
    "ramNum": 8,
    "storage": "256GB SSD",
    "storageType": "SSD",
    "storageCapacity": "256GB",
    "price": 21000,
    "quantity": 1,
    "condition": "Refurbished / Tested",
    "warrantyMonths": null,
    "warrantyDisplay": "Warranty: Please Confirm with Store",
    "images": ["assets/images/laptops/hp-348-g4.svg"],
    "featured": false,
    "badge": "Value Workhorse",
    "description": "HP 348 G4 robust 14-inch commercial laptop with 7th Gen Intel Core i5, 8GB RAM, and fast 256GB SSD storage for office and academic work.",
    "reviewFlag": null
  },
  {
    "id": "2585",
    "lpNumber": "2585",
    "brand": "HP",
    "model": "ProBook 440 G1",
    "processor": "Intel Core i5",
    "generation": "4th Gen",
    "generationNum": 4,
    "ram": "8GB",
    "ramNum": 8,
    "storage": "256GB SSD",
    "storageType": "SSD",
    "storageCapacity": "256GB",
    "price": 17500,
    "quantity": 1,
    "condition": "Refurbished / Tested",
    "warrantyMonths": null,
    "warrantyDisplay": "Warranty: Please Confirm with Store",
    "images": ["assets/images/laptops/hp-probook-440-g1.svg"],
    "featured": false,
    "badge": "Budget Business",
    "description": "HP ProBook 440 G1 reliable business laptop with 4th Gen Intel Core i5, upgraded 8GB RAM, and 256GB SSD for snappy day-to-day operation.",
    "reviewFlag": null
  },
  {
    "id": "4002",
    "lpNumber": "4002",
    "brand": "HP",
    "model": "EliteBook Folio 9480M",
    "processor": "Intel Core i5",
    "generation": "4th Gen",
    "generationNum": 4,
    "ram": "8GB",
    "ramNum": 8,
    "storage": "256GB SSD",
    "storageType": "SSD",
    "storageCapacity": "256GB",
    "price": 18000,
    "quantity": 4,
    "condition": "Refurbished / Tested",
    "warrantyMonths": null,
    "warrantyDisplay": "Warranty: Please Confirm with Store",
    "images": ["assets/images/laptops/hp-elitebook-folio-9480m.svg"],
    "featured": true,
    "badge": "Ultra Slim Ultrabook",
    "description": "HP EliteBook Folio 9480M lightweight executive ultrabook with durable magnesium-aluminum alloy body, 4th Gen Intel Core i5, 8GB RAM, and 256GB SSD.",
    "reviewFlag": null
  },
  {
    "id": "3995",
    "lpNumber": "3995",
    "brand": "HP",
    "model": "EliteBook 840 G1 Touch",
    "processor": "Intel Core i5",
    "generation": "4th Gen",
    "generationNum": 4,
    "ram": "8GB",
    "ramNum": 8,
    "storage": "256GB SSD",
    "storageType": "SSD",
    "storageCapacity": "256GB",
    "price": 19000,
    "quantity": 2,
    "condition": "Refurbished / Tested",
    "warrantyMonths": null,
    "warrantyDisplay": "Warranty: Please Confirm with Store",
    "images": ["assets/images/laptops/hp-elitebook-840-g1-touch.svg"],
    "featured": true,
    "badge": "Touchscreen Edition",
    "description": "HP EliteBook 840 G1 with responsive touchscreen display, Intel Core i5 4th Gen, 8GB RAM, and 256GB SSD for intuitive business and personal computing.",
    "reviewFlag": null
  },
  {
    "id": "3935",
    "lpNumber": "3935",
    "brand": "HP",
    "model": "EliteBook 840 G3",
    "processor": "Intel Core i5",
    "generation": "6th Gen",
    "generationNum": 6,
    "ram": "8GB",
    "ramNum": 8,
    "storage": "256GB SSD",
    "storageType": "SSD",
    "storageCapacity": "256GB",
    "price": 23000,
    "quantity": 1,
    "condition": "Refurbished / Tested",
    "warrantyMonths": null,
    "warrantyDisplay": "Warranty: Please Confirm with Store",
    "images": ["assets/images/laptops/hp-elitebook-840.svg"],
    "featured": false,
    "badge": "8GB RAM Corporate",
    "description": "HP EliteBook 840 G3 slim business model with 6th Gen Intel Core i5, upgraded 8GB RAM, and fast 256GB SSD for smooth productivity.",
    "reviewFlag": null
  },
  {
    "id": "2356",
    "lpNumber": "2356",
    "brand": "Dell",
    "model": "Latitude E7450",
    "processor": "Intel Core i5",
    "generation": "5th Gen",
    "generationNum": 5,
    "ram": "8GB",
    "ramNum": 8,
    "storage": "256GB SSD",
    "storageType": "SSD",
    "storageCapacity": "256GB",
    "price": 19500,
    "quantity": 1,
    "condition": "Refurbished / Tested",
    "warrantyMonths": null,
    "warrantyDisplay": "Warranty: Please Confirm with Store",
    "images": ["assets/images/laptops/dell-latitude-e7450.svg"],
    "featured": false,
    "badge": "Carbon Fiber Chassis",
    "description": "Dell Latitude E7450 14-inch ultrabook with premium carbon-fiber lid, 5th Gen Intel Core i5, 8GB RAM, and 256GB SSD storage.",
    "reviewFlag": null
  },
  {
    "id": "7426",
    "lpNumber": "7426",
    "brand": "Lenovo",
    "model": "IdeaPad V130",
    "processor": "Intel Core i3",
    "generation": "7th Gen",
    "generationNum": 7,
    "ram": "4GB",
    "ramNum": 4,
    "storage": "256GB SSD",
    "storageType": "SSD",
    "storageCapacity": "256GB",
    "price": 18500,
    "quantity": 2,
    "condition": "Refurbished / Tested",
    "warrantyMonths": null,
    "warrantyDisplay": "Warranty: Please Confirm with Store",
    "images": ["assets/images/laptops/lenovo-ideapad-v130.svg"],
    "featured": false,
    "badge": "Student & Office Friendly",
    "description": "Lenovo IdeaPad V130 modern lightweight laptop equipped with 7th Gen Intel Core i3 processor, 4GB RAM, and fast 256GB SSD.",
    "reviewFlag": null
  },
  {
    "id": "7298",
    "lpNumber": "7298",
    "brand": "Dell",
    "model": "Vostro 3490",
    "processor": "Intel Core i5",
    "generation": "10th Gen",
    "generationNum": 10,
    "ram": "8GB",
    "ramNum": 8,
    "storage": "256GB SSD",
    "storageType": "SSD",
    "storageCapacity": "256GB",
    "price": 26500,
    "quantity": 5,
    "condition": "Refurbished / Tested",
    "warrantyMonths": null,
    "warrantyDisplay": "Warranty: Please Confirm with Store",
    "images": ["assets/images/laptops/dell-vostro.svg"],
    "featured": true,
    "badge": "10th Gen Best Seller",
    "description": "Dell Vostro 3490 featuring 10th Generation Intel Core i5, 8GB DDR4 RAM, and fast 256GB SSD. Popular business laptop with 5 units available.",
    "reviewFlag": null
  },
  {
    "id": "7067",
    "lpNumber": "7067",
    "brand": "Dell",
    "model": "Inspiron N4110",
    "processor": "Intel Core i3",
    "generation": "2nd Gen",
    "generationNum": 2,
    "ram": "6GB",
    "ramNum": 6,
    "storage": "320GB HDD",
    "storageType": "HDD",
    "storageCapacity": "320GB",
    "price": 11000,
    "quantity": 1,
    "condition": "Refurbished / Tested",
    "warrantyMonths": null,
    "warrantyDisplay": "Warranty: Please Confirm with Store",
    "images": ["assets/images/laptops/dell-inspiron.svg"],
    "featured": false,
    "badge": "Affordable Entry Level",
    "description": "Dell Inspiron N4110 budget computing laptop with Intel Core i3 2nd Gen, 6GB RAM, and 320GB HDD for everyday basic tasks.",
    "reviewFlag": null
  },
  {
    "id": "7189",
    "lpNumber": "7189",
    "brand": "Dell",
    "model": "Vostro 3500",
    "processor": "Intel Core i5",
    "generation": "1st Gen",
    "generationNum": 1,
    "ram": "8GB",
    "ramNum": 8,
    "storage": "500GB HDD",
    "storageType": "HDD",
    "storageCapacity": "500GB",
    "price": 10500,
    "quantity": 1,
    "condition": "Refurbished / Tested",
    "warrantyMonths": null,
    "warrantyDisplay": "Warranty: Please Confirm with Store",
    "images": ["assets/images/laptops/dell-vostro-3500.svg"],
    "featured": false,
    "badge": "Economy Series",
    "description": "Dell Vostro 3500 full-sized 15.6-inch laptop with Intel Core i5 1st Gen, 8GB RAM, and 500GB HDD for cost-effective computing.",
    "reviewFlag": "Model/Generation combination noted for physical verification on tag"
  },
  {
    "id": "7138",
    "lpNumber": "7138",
    "brand": "Dell",
    "model": "Vostro 3569",
    "processor": "Intel Core i5",
    "generation": "6th Gen",
    "generationNum": 6,
    "ram": "8GB",
    "ramNum": 8,
    "storage": "256GB SSD",
    "storageType": "SSD",
    "storageCapacity": "256GB",
    "price": 20000,
    "quantity": 1,
    "condition": "Refurbished / Tested",
    "warrantyMonths": null,
    "warrantyDisplay": "Warranty: Please Confirm with Store",
    "images": ["assets/images/laptops/dell-vostro-3569.svg"],
    "featured": false,
    "badge": "15.6-inch Workstation",
    "description": "Dell Vostro 3569 15.6-inch business notebook powered by 6th Gen Intel Core i5 with 8GB RAM and fast 256GB SSD.",
    "reviewFlag": null
  },
  {
    "id": "3790",
    "lpNumber": "3790",
    "brand": "Dell",
    "model": "Latitude 3490",
    "processor": "Intel Core i5",
    "generation": "8th Gen",
    "generationNum": 8,
    "ram": "8GB",
    "ramNum": 8,
    "storage": "256GB SSD",
    "storageType": "SSD",
    "storageCapacity": "256GB",
    "price": 18000,
    "quantity": 3,
    "condition": "Refurbished / Tested",
    "warrantyMonths": null,
    "warrantyDisplay": "Warranty: Please Confirm with Store",
    "images": ["assets/images/laptops/dell-latitude-3490.svg"],
    "featured": true,
    "badge": "High Demand 8th Gen i5",
    "description": "Dell Latitude 3490 commercial workhorse with 8th Gen Quad-Core Intel Core i5, 8GB RAM, and 256GB SSD storage.",
    "reviewFlag": null
  },
  {
    "id": "3583",
    "lpNumber": "3583",
    "brand": "Dell",
    "model": "Latitude 3400",
    "processor": "Intel Core i3",
    "generation": "8th Gen",
    "generationNum": 8,
    "ram": "4GB",
    "ramNum": 4,
    "storage": "256GB SSD",
    "storageType": "SSD",
    "storageCapacity": "256GB",
    "price": 18000,
    "quantity": 1,
    "condition": "Refurbished / Tested",
    "warrantyMonths": null,
    "warrantyDisplay": "Warranty: Please Confirm with Store",
    "images": ["assets/images/laptops/dell-latitude-3400.svg"],
    "featured": false,
    "badge": "Modern Latitude",
    "description": "Dell Latitude 3400 featuring modern narrow bezel design, 8th Gen Intel Core i3 processor, 4GB RAM, and 256GB SSD.",
    "reviewFlag": null
  },
  {
    "id": "3395",
    "lpNumber": "3395",
    "brand": "Dell",
    "model": "Latitude 3490",
    "processor": "Intel Core i3",
    "generation": "7th Gen",
    "generationNum": 7,
    "ram": "4GB",
    "ramNum": 4,
    "storage": "256GB SSD",
    "storageType": "SSD",
    "storageCapacity": "256GB",
    "price": 18500,
    "quantity": 2,
    "condition": "Refurbished / Tested",
    "warrantyMonths": null,
    "warrantyDisplay": "Warranty: Please Confirm with Store",
    "images": ["assets/images/laptops/dell-latitude-3490.svg"],
    "featured": false,
    "badge": "Solid Business i3",
    "description": "Dell Latitude 3490 enterprise laptop with 7th Gen Intel Core i3, 4GB RAM, and quick 256GB SSD storage.",
    "reviewFlag": null
  },
  {
    "id": "2741",
    "lpNumber": "2741",
    "brand": "Dell",
    "model": "Latitude 5440",
    "processor": "Intel Core i3",
    "generation": "4th Gen",
    "generationNum": 4,
    "ram": "8GB",
    "ramNum": 8,
    "storage": "500GB HDD",
    "storageType": "HDD",
    "storageCapacity": "500GB",
    "price": 14000,
    "quantity": 1,
    "condition": "Refurbished / Tested",
    "warrantyMonths": null,
    "warrantyDisplay": "Warranty: Please Confirm with Store",
    "images": ["assets/images/laptops/dell-latitude-5440.svg"],
    "featured": false,
    "badge": "Rugged Workhorse",
    "description": "Dell Latitude 5440 robust corporate chassis with Intel Core i3 4th Gen, 8GB RAM, and 500GB HDD capacity.",
    "reviewFlag": "Model/Generation combination noted for physical verification on tag"
  },
  {
    "id": "7004",
    "lpNumber": "7004",
    "brand": "HP",
    "model": "Pavilion G6",
    "processor": "Intel Core i3",
    "generation": "2nd Gen",
    "generationNum": 2,
    "ram": "4GB",
    "ramNum": 4,
    "storage": "500GB HDD",
    "storageType": "HDD",
    "storageCapacity": "500GB",
    "price": 10000,
    "quantity": 1,
    "condition": "Refurbished / Tested",
    "warrantyMonths": null,
    "warrantyDisplay": "Warranty: Please Confirm with Store",
    "images": ["assets/images/laptops/hp-pavilion-g6.svg"],
    "featured": false,
    "badge": "Best Budget Value",
    "description": "HP Pavilion G6 15.6-inch laptop with Intel Core i3 2nd Gen, 4GB RAM, and 500GB HDD. Ideal budget-friendly option at â¹10,000.",
    "reviewFlag": null
  },
  {
    "id": "3996",
    "lpNumber": "3996",
    "brand": "Dell",
    "model": "Latitude E5450",
    "processor": "Intel Core i5",
    "generation": "5th Gen",
    "generationNum": 5,
    "ram": "8GB",
    "ramNum": 8,
    "storage": "256GB SSD",
    "storageType": "SSD",
    "storageCapacity": "256GB",
    "price": 18000,
    "quantity": 1,
    "condition": "Refurbished / Tested",
    "warrantyMonths": null,
    "warrantyDisplay": "Warranty: Please Confirm with Store",
    "images": ["assets/images/laptops/dell-latitude-e5450.svg"],
    "featured": false,
    "badge": "Corporate Classic",
    "description": "Dell Latitude E5450 14-inch professional laptop featuring 5th Gen Intel Core i5, 8GB RAM, and 256GB SSD.",
    "reviewFlag": null
  },
  {
    "id": "3128",
    "lpNumber": "3128",
    "brand": "Dell",
    "model": "Latitude 5480",
    "processor": "Intel Core i5",
    "generation": "7th Gen",
    "generationNum": 7,
    "ram": "8GB",
    "ramNum": 8,
    "storage": "256GB SSD",
    "storageType": "SSD",
    "storageCapacity": "256GB",
    "price": 21000,
    "quantity": 2,
    "condition": "Refurbished / Tested",
    "warrantyMonths": null,
    "warrantyDisplay": "Warranty: Please Confirm with Store",
    "images": ["assets/images/laptops/dell-latitude-5480.svg"],
    "featured": true,
    "badge": "7th Gen Premium",
    "description": "Dell Latitude 5480 enterprise laptop powered by 7th Gen Intel Core i5, 8GB RAM, and 256GB SSD. Sleek and durable.",
    "reviewFlag": null
  },
  {
    "id": "3429",
    "lpNumber": "3429",
    "brand": "Dell",
    "model": "Latitude 5480",
    "processor": "Intel Core i5",
    "generation": "6th Gen",
    "generationNum": 6,
    "ram": "8GB",
    "ramNum": 8,
    "storage": "256GB SSD",
    "storageType": "SSD",
    "storageCapacity": "256GB",
    "price": 20000,
    "quantity": 1,
    "condition": "Refurbished / Tested",
    "warrantyMonths": null,
    "warrantyDisplay": "Warranty: Please Confirm with Store",
    "images": ["assets/images/laptops/dell-latitude-5480.svg"],
    "featured": false,
    "badge": "Reliable 6th Gen",
    "description": "Dell Latitude 5480 with 6th Gen Intel Core i5, 8GB RAM, and 256GB SSD. Solid business construction and long battery endurance.",
    "reviewFlag": null
  }
];

// ============================================================================
// UNIVERSAL IMAGE FALLBACK HELPER
// Guaranteed Zero-Blank Product Image Engine across E-Gadget World
// ============================================================================
const ImageFallbackHelper = {
  LAPTOP_PLACEHOLDER: 'assets/images/placeholders/laptop-placeholder.svg',
  ACCESSORY_PLACEHOLDERS: {
    charger: 'assets/images/placeholders/accessory-charger.svg',
    ssd: 'assets/images/placeholders/accessory-ssd.svg',
    ram: 'assets/images/placeholders/accessory-ram.svg',
    peripherals: 'assets/images/placeholders/accessory-peripherals.svg',
    default: 'assets/images/placeholders/accessory-default.svg'
  },

  // High-reliability embedded inline SVG data-URIs (Zero network dependency, 100% immune to 404s)
  EMBEDDED_LAPTOP_FALLBACK: "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 420' width='600' height='420'%3E%3Crect width='600' height='420' fill='%23F8FAFC'/%3E%3Crect x='110' y='50' width='380' height='240' rx='12' fill='%230F172A' stroke='%23334155' stroke-width='2'/%3E%3Crect x='125' y='68' width='350' height='204' rx='4' fill='%231E293B'/%3E%3Cpath d='M 70,305 L 530,305 L 500,345 L 100,345 Z' fill='%2364748B'/%3E%3Ctext x='300' y='165' font-family='sans-serif' font-size='16' font-weight='700' fill='%23F8FAFC' text-anchor='middle'%3EE-GADGET WORLD%3C/text%3E%3Ctext x='300' y='190' font-family='sans-serif' font-size='12' font-weight='600' fill='%2393C5FD' text-anchor='middle'%3ECommercial Refurbished Laptop%3C/text%3E%3C/svg%3E",
  
  EMBEDDED_ACCESSORY_FALLBACK: "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 420' width='600' height='420'%3E%3Crect width='600' height='420' fill='%23F8FAFC'/%3E%3Ccircle cx='300' cy='200' r='80' fill='%23EFF6FF' stroke='%23BFDBFE' stroke-width='3'/%3E%3Ctext x='300' y='195' font-family='sans-serif' font-size='16' font-weight='700' fill='%232563EB' text-anchor='middle'%3EE-GADGET WORLD%3C/text%3E%3Ctext x='300' y='220' font-family='sans-serif' font-size='12' font-weight='600' fill='%2364748B' text-anchor='middle'%3ELaptop Accessory%3C/text%3E%3C/svg%3E",

  getLaptopFallback() {
    return this.LAPTOP_PLACEHOLDER;
  },

  getAccessoryFallback(category = 'default') {
    const cat = (category || '').toLowerCase();
    if (cat.includes('charger') || cat.includes('adapter') || cat.includes('power')) {
      return this.ACCESSORY_PLACEHOLDERS.charger;
    }
    if (cat.includes('ssd') || cat.includes('storage') || cat.includes('drive') || cat.includes('nvme')) {
      return this.ACCESSORY_PLACEHOLDERS.ssd;
    }
    if (cat.includes('ram') || cat.includes('memory') || cat.includes('ddr')) {
      return this.ACCESSORY_PLACEHOLDERS.ram;
    }
    if (cat.includes('bag') || cat.includes('mouse') || cat.includes('keyboard') || cat.includes('backpack')) {
      return this.ACCESSORY_PLACEHOLDERS.peripherals;
    }
    return this.ACCESSORY_PLACEHOLDERS.default;
  },

  /**
   * Automatically handles image load errors (404, invalid URL, network drop).
   * Stage 0 -> Stage 1: Switches to high-res SVG placeholder file.
   * Stage 1 -> Stage 2: Switches to embedded Data-URI SVG (guaranteed to render).
   * Stage 2+: Disables onerror to prevent infinite loops.
   */
  handleLaptopImgError(img) {
    if (!img) return;
    const stage = Number(img.getAttribute('data-fallback-stage') || '0');
    
    if (stage === 0) {
      img.setAttribute('data-fallback-stage', '1');
      img.src = this.LAPTOP_PLACEHOLDER;
    } else if (stage === 1) {
      img.setAttribute('data-fallback-stage', '2');
      img.src = this.EMBEDDED_LAPTOP_FALLBACK;
    } else {
      img.onerror = null;
    }
  },

  handleAccessoryImgError(img, category = 'default') {
    if (!img) return;
    const stage = Number(img.getAttribute('data-fallback-stage') || '0');
    
    if (stage === 0) {
      img.setAttribute('data-fallback-stage', '1');
      img.src = this.getAccessoryFallback(category);
    } else if (stage === 1) {
      img.setAttribute('data-fallback-stage', '2');
      img.src = this.EMBEDDED_ACCESSORY_FALLBACK;
    } else {
      img.onerror = null;
    }
  }
};

// Helper Utilities
const LaptopService = {
  getApiBase() {
    const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    if (isLocal) {
      return window.location.port === '8000' ? '' : 'http://127.0.0.1:8000';
    }
    if (typeof window !== 'undefined' && window.location.pathname.includes('/backend-laravel/public')) {
      return window.location.origin + '/backend-laravel/public';
    }
    return '';
  },

  async syncWithApi() {
    try {
      const apiBase = this.getApiBase();
      const res = await fetch(`${apiBase}/api/public/laptops`, { credentials: 'omit' });
      if (!res.ok) return false;
      const data = await res.json();
      if (data && data.success && Array.isArray(data.data)) {
        data.data.forEach(dbItem => {
          const lpStr = String(dbItem.lp_no || dbItem.id);
          const existing = PRODUCT_INVENTORY.find(item => String(item.lpNumber) === lpStr || String(item.id) === lpStr);
          if (existing) {
            existing.quantity = typeof dbItem.piece === 'number' ? dbItem.piece : parseInt(dbItem.piece, 10) || 0;
            existing.price = Number(dbItem.price) || existing.price;
            existing.status = dbItem.status || existing.status;
            if (dbItem.badge) existing.badge = dbItem.badge;
            if (dbItem.featured !== undefined) existing.featured = Boolean(dbItem.featured);
          } else {
            PRODUCT_INVENTORY.push({
              id: String(dbItem.id),
              lpNumber: String(dbItem.lp_no),
              brand: dbItem.brand,
              model: dbItem.model,
              processor: dbItem.processor,
              generation: dbItem.generation,
              ram: dbItem.ram,
              storage: dbItem.storage,
              price: Number(dbItem.price),
              quantity: typeof dbItem.piece === 'number' ? dbItem.piece : parseInt(dbItem.piece, 10) || 0,
              condition: 'Refurbished / Tested',
              warrantyDisplay: 'Warranty: Please Confirm with Store',
              images: dbItem.pic ? [dbItem.pic] : ['assets/images/placeholders/laptop-placeholder.svg'],
              featured: Boolean(dbItem.featured),
              badge: dbItem.badge || '',
              description: dbItem.desc || ''
            });
          }
        });

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('egadget:inventory-synced', { detail: PRODUCT_INVENTORY }));
        }
        return true;
      }
    } catch (err) {
      console.info('Live MySQL inventory sync: Backend offline, using local verified dataset.');
    }
    return false;
  },

  getAll() {
    return PRODUCT_INVENTORY;
  },

  getById(lpNumber) {
    if (!lpNumber) return null;
    const cleanId = String(lpNumber).trim();
    return PRODUCT_INVENTORY.find(item => item.id === cleanId || item.lpNumber === cleanId) || null;
  },

  getFeatured() {
    return PRODUCT_INVENTORY.filter(item => item.featured);
  },

  formatINR(amount) {
    if (typeof amount !== 'number') return amount;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  },

  getStockStatus(qty) {
    const q = typeof qty === 'number' ? qty : parseInt(qty, 10) || 0;
    if (q > 2) {
      return {
        code: 'in_stock',
        label: 'In Stock',
        qtyLabel: 'In Stock',
        badgeClass: 'badge-stock-in',
        canBuy: true
      };
    } else if (q === 2) {
      return {
        code: 'low_stock',
        label: 'Only 2 Left',
        qtyLabel: 'Only 2 Left in Showroom',
        badgeClass: 'badge-stock-warn',
        canBuy: true
      };
    } else if (q === 1) {
      return {
        code: 'critical_stock',
        label: 'Only 1 Left',
        qtyLabel: 'Only 1 Unit Remaining',
        badgeClass: 'badge-stock-danger',
        canBuy: true
      };
    } else {
      return {
        code: 'out_of_stock',
        label: 'Sold Out',
        qtyLabel: 'Currently Unavailable',
        badgeClass: 'badge-stock-soldout',
        canBuy: false
      };
    }
  },

  getWarrantyLabel(laptop) {
    if (laptop.warrantyMonths) {
      return `${laptop.warrantyMonths} Months Store Warranty`;
    }
    return laptop.warrantyDisplay || "Warranty: Please Confirm with Store";
  },

  /**
   * Generates official WhatsApp Purchase enquiry link matching Phase 9 exact template
   */
  generateWhatsAppBuyUrl(laptop, currentUrl = window.location.href) {
    if (!laptop || laptop.quantity <= 0) return null;

    const baseWhatsApp = (typeof BUSINESS_CONFIG !== 'undefined' && BUSINESS_CONFIG.whatsappNumber) 
      ? BUSINESS_CONFIG.whatsappNumber 
      : '919984359860';

    const formattedPrice = this.formatINR(laptop.price);
    const warranty = this.getWarrantyLabel(laptop);
    
    // Ensure product link is fully qualified
    const productUrl = (currentUrl && currentUrl.includes('laptop-details.html'))
      ? currentUrl
      : `${window.location.origin}${window.location.pathname.replace(/[^/]*$/, '')}laptop-details.html?lp=${laptop.lpNumber}`;

    const text = [
      'Hello E-Gadget World,',
      '',
      'I am interested in purchasing this laptop from your website.',
      '',
      `Laptop: ${laptop.brand} ${laptop.model}`,
      `LP Number: ${laptop.lpNumber}`,
      `• Processor: ${laptop.processor} (${laptop.generation})`,
      `Generation: ${laptop.generation}`,
      `RAM: ${laptop.ram}`,
      `Storage: ${laptop.storage}`,
      `Price: ${formattedPrice}`,
      `Warranty: ${warranty}`,
      `Product Link: ${productUrl}`,
      '',
      'Please confirm availability and purchasing details.',
      '',
      'Thank you.'
    ].join('\n');

    return `https://wa.me/${baseWhatsApp}?text=${encodeURIComponent(text)}`;
  },

  /**
   * Generates prefilled WhatsApp message for general, repair, CSC, or banking inquiries
   */
  generateWhatsAppInquiryUrl(type, extraDetails = {}) {
    const baseWhatsApp = (typeof BUSINESS_CONFIG !== 'undefined' && BUSINESS_CONFIG.whatsappNumber) 
      ? BUSINESS_CONFIG.whatsappNumber 
      : '919984359860';

    let text = '';
    switch (type) {
      case 'repair':
        text = [
          'Hello E-Gadget World Mehnajpur,',
          '',
          'I need laptop service / repair assistance.',
          '',
          `Customer Name: ${extraDetails.name || 'Not provided'}`,
          `Contact Number: ${extraDetails.phone || 'Not provided'}`,
          `Laptop Brand / Model: ${extraDetails.laptopModel || 'Not provided'}`,
          `Problem Description: ${extraDetails.problem || 'Not specified'}`,
          '',
          'Please let me know diagnostic options and shop timing.',
          'Thank you.'
        ].join('\n');
        break;

      case 'csc':
        text = [
          'Hello E-Gadget World Mehnajpur,',
          '',
          'I have an enquiry regarding CSC Digital Services available at your Mehnajpur branch.',
          `Service Requested: ${extraDetails.serviceName || 'General Digital Certificate / Online Application'}`,
          '',
          'Please advise on document requirements and visit timings.',
          'Thank you.'
        ].join('\n');
        break;

      case 'banking':
        text = [
          'Hello E-Gadget World Mehnajpur,',
          '',
          'I am seeking information regarding Indian Bank Services at your Mehnajpur center.',
          'Please provide general guidance on working hours and available informational services.',
          '',
          'Thank you.'
        ].join('\n');
        break;

      case 'general':
      default:
        text = [
          'Hello E-Gadget World Mehnajpur,',
          '',
          'I visited your website and have an enquiry regarding your laptops and shop services.',
          'Please connect with me with details.',
          '',
          'Thank you.'
        ].join('\n');
        break;
    }

    return `https://wa.me/${baseWhatsApp}?text=${encodeURIComponent(text)}`;
  },

  /**
   * Centralized, Premium Product Card Generator
   * Reused across homepage featured grid, catalog, and related laptops
   */
  generateWhatsAppEnquiryUrl(laptop) {
    const baseWhatsApp = (typeof BUSINESS_CONFIG !== 'undefined' && BUSINESS_CONFIG.contact)
      ? BUSINESS_CONFIG.contact.whatsappRaw
      : '919984359860';

    const text = [
      'Hello E-Gadget World Mehnajpur,',
      '',
      `I am enquiring about the ${laptop.brand} ${laptop.model} (LP #${laptop.lpNumber}).`,
      `• Processor: ${laptop.processor} (${laptop.generation})`,
      `• Specs: ${laptop.ram} RAM | ${laptop.storage}`,
      `• Price: ₹${Number(laptop.price).toLocaleString('en-IN')}`,
      '',
      'Please let me know current availability, warranty options, and showroom test-drive timings.',
      'Thank you.'
    ].join('\n');

    return `https://wa.me/${baseWhatsApp}?text=${encodeURIComponent(text)}`;
  },

  createCardHtml(laptop, options = {}) {
    if (!laptop) return '';

    const formattedPrice = this.formatINR(laptop.price);
    const warranty = this.getWarrantyLabel(laptop);
    const waEnquiryUrl = this.generateWhatsAppEnquiryUrl(laptop);
    const detailUrl = `laptop-details.html?lp=${laptop.lpNumber}`;
    const mainImg = (laptop.images && laptop.images.length > 0 && laptop.images[0])
      ? laptop.images[0]
      : (typeof ImageFallbackHelper !== 'undefined' ? ImageFallbackHelper.getLaptopFallback() : 'assets/images/placeholders/laptop-placeholder.svg');
    const showCompare = options.showCompare !== false;
    const stock = this.getStockStatus(laptop.quantity);

    return `
      <article class="laptop-card" data-lp="${laptop.lpNumber}">
        <div class="laptop-card-image-wrap">
          <div class="laptop-badge-top-left">
            <span class="laptop-badge-lp">LP #${laptop.lpNumber}</span>
          </div>
          <div class="laptop-badge-top-right">
            <span class="stock-pill ${stock.badgeClass}">${stock.label}</span>
          </div>
          <a href="${detailUrl}" class="laptop-card-img-link" aria-label="${laptop.brand} ${laptop.model}">
            <img src="${mainImg}" alt="${laptop.brand} ${laptop.model} LP #${laptop.lpNumber}" class="laptop-card-img" width="240" height="165" loading="eager" onerror="if (typeof ImageFallbackHelper !== 'undefined') ImageFallbackHelper.handleLaptopImgError(this);">
          </a>
        </div>

        <div class="laptop-card-body">
          <div class="laptop-card-brand">${laptop.brand}</div>
          <h3 class="laptop-card-title">
            <a href="${detailUrl}">${laptop.brand} ${laptop.model}</a>
          </h3>

          <div class="laptop-spec-line">
            <span class="laptop-spec-text">${laptop.processor} · ${laptop.generation}</span>
          </div>
          <div class="laptop-spec-line-sub">
            <span>${laptop.ram} RAM</span>
            <span class="spec-divider">|</span>
            <span>${laptop.storage}</span>
          </div>

          <div class="laptop-warranty-notice">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <span>${warranty}</span>
          </div>

          <div class="laptop-card-price-row">
            <div class="laptop-price-block">
              <span class="laptop-price-value">${formattedPrice}</span>
            </div>
          </div>

          <div class="laptop-card-actions">
            <a href="${detailUrl}" class="btn btn-outline card-btn-details">View Details</a>
            <a href="${waEnquiryUrl}" target="_blank" rel="noopener" class="btn btn-whatsapp card-btn-enquire" title="Enquire about ${laptop.brand} ${laptop.model} on WhatsApp">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z"/>
              </svg>
              <span>Enquire</span>
            </a>
          </div>

          ${showCompare ? `
            <label class="laptop-card-compare-checkbox">
              <input type="checkbox" data-compare-lp="${laptop.lpNumber}" onchange="CompareService?.toggleCompare('${laptop.lpNumber}', this.checked)">
              <span>Add to Compare</span>
            </label>
          ` : ''}
        </div>
      </article>
    `;
  }
};

// Export to global scope
if (typeof window !== 'undefined') {
  window.PRODUCT_INVENTORY = PRODUCT_INVENTORY;
  window.LaptopService = LaptopService;
  window.ImageFallbackHelper = ImageFallbackHelper;

  // Auto-trigger live MySQL inventory sync on page ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => LaptopService.syncWithApi());
  } else {
    LaptopService.syncWithApi();
  }
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRODUCT_INVENTORY, LaptopService, ImageFallbackHelper };
}