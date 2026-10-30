/**
 * E-Gadget World — Product Inventory & Data Utilities
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
    "images": ["assets/images/laptops/hp-elitebook-840.svg"],
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
    "images": ["assets/images/laptops/hp-elitebook-840.svg"],
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
    "images": ["assets/images/laptops/hp-standard.svg"],
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
    "images": ["assets/images/laptops/hp-standard.svg"],
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
    "images": ["assets/images/laptops/hp-elitebook-840.svg"],
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
    "images": ["assets/images/laptops/hp-elitebook-840.svg"],
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
    "images": ["assets/images/laptops/dell-latitude.svg"],
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
    "images": ["assets/images/laptops/lenovo-ideapad.svg"],
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
    "images": ["assets/images/laptops/dell-vostro.svg"],
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
    "images": ["assets/images/laptops/dell-vostro.svg"],
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
    "images": ["assets/images/laptops/dell-latitude.svg"],
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
    "images": ["assets/images/laptops/dell-latitude.svg"],
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
    "images": ["assets/images/laptops/dell-latitude.svg"],
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
    "images": ["assets/images/laptops/dell-latitude.svg"],
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
    "images": ["assets/images/laptops/hp-standard.svg"],
    "featured": false,
    "badge": "Best Budget Value",
    "description": "HP Pavilion G6 15.6-inch laptop with Intel Core i3 2nd Gen, 4GB RAM, and 500GB HDD. Ideal budget-friendly option at ₹10,000.",
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
    "images": ["assets/images/laptops/dell-latitude.svg"],
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
    "images": ["assets/images/laptops/dell-latitude.svg"],
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
    "images": ["assets/images/laptops/dell-latitude.svg"],
    "featured": false,
    "badge": "Reliable 6th Gen",
    "description": "Dell Latitude 5480 with 6th Gen Intel Core i5, 8GB RAM, and 256GB SSD. Solid business construction and long battery endurance.",
    "reviewFlag": null
  }
];

// Helper Utilities
const LaptopService = {
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
    if (qty > 1) {
      return {
        code: 'in_stock',
        label: 'In Stock',
        qtyLabel: `${qty} units left`,
        badgeClass: 'badge-stock-in',
        canBuy: true
      };
    } else if (qty === 1) {
      return {
        code: 'low_stock',
        label: 'Only 1 Left',
        qtyLabel: '1 unit left',
        badgeClass: 'badge-stock-low',
        canBuy: true
      };
    } else {
      return {
        code: 'out_of_stock',
        label: 'Out of Stock',
        qtyLabel: 'Currently Unavailable',
        badgeClass: 'badge-stock-out',
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
      `Processor: ${laptop.processor}`,
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
  }
};

// Export to global scope
if (typeof window !== 'undefined') {
  window.PRODUCT_INVENTORY = PRODUCT_INVENTORY;
  window.LaptopService = LaptopService;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRODUCT_INVENTORY, LaptopService };
}
