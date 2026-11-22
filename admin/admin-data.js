/**
 * E-Gadget World — Admin Frontend Local State & UI Management Engine
 * Mehnajpur HQ, Azamgarh
 * UI-ONLY IMPLEMENTATION (Zero Backend Mutation / Demo Mode Protected)
 */

(function(window) {
  'use strict';

    // 1. Initial Verified Categories
  const INITIAL_CATEGORIES = [];
  const INITIAL_LAPTOPS = [];
  const INITIAL_ACCESSORIES = [];

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
      this.STORAGE_KEY = 'egadget_admin_v4_production';
      try {
        localStorage.removeItem('egadget_admin_clean_v1');
        localStorage.removeItem('egadget_admin_prod_v1');
        localStorage.removeItem('egadget_admin_prod_v2');
        localStorage.removeItem('egadget_admin_prod_v3');
        localStorage.removeItem('egadget_admin_prod_v4');
        localStorage.removeItem('egadget_admin_prod_v5');
        localStorage.removeItem('egadget_admin_prod_v6');
        localStorage.removeItem('egadget_admin_state');
        localStorage.removeItem('egadget_catalog_cache');
        localStorage.removeItem('egadget_products_cache');
        localStorage.removeItem('egadget_inventory_cache');
      } catch (e) {}
      this.state = this.loadState();
    }

    // Load initial or persisted state
    loadState() {
      try {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            categories: Array.isArray(parsed.categories) ? parsed.categories : [],
            laptops: Array.isArray(parsed.laptops) ? parsed.laptops : [],
            accessories: Array.isArray(parsed.accessories) ? parsed.accessories : [],
            sales: Array.isArray(parsed.sales) ? parsed.sales : [],
            demoModeActive: false
          };
        }
      } catch (err) {
        console.warn('Failed reading admin state from localStorage:', err);
      }

      // Fresh clean business state
      return {
        categories: [],
        laptops: [],
        accessories: [],
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
        let lpData = null;
        try {
          const lpUrl = token ? `${apiBase}/api/admin/laptops?per_page=100` : `${apiBase}/api/public/laptops`;
          let lpRes = await fetch(lpUrl, { headers });
          if (!lpRes.ok && token) {
            lpRes = await fetch(`${apiBase}/api/public/laptops`, { headers: { 'Accept': 'application/json' } });
          }
          if (lpRes.ok) {
            lpData = await lpRes.json();
          }
        } catch (e) {
          console.warn('Laptops fetch failed:', e);
        }

        if (lpData && lpData.success && Array.isArray(lpData.data)) {
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

        // 2. Fetch Accessories from MySQL (admin or public fallback)
        let accData = null;
        try {
          const accUrl = token ? `${apiBase}/api/admin/accessories?per_page=100` : `${apiBase}/api/public/accessories`;
          let accRes = await fetch(accUrl, { headers });
          if (!accRes.ok && token) {
            accRes = await fetch(`${apiBase}/api/public/accessories`, { headers: { 'Accept': 'application/json' } });
          }
          if (accRes.ok) {
            accData = await accRes.json();
          }
        } catch (e) {
          console.warn('Accessories fetch failed:', e);
        }

        if (accData && accData.success && Array.isArray(accData.data)) {
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

        // 3. Fetch Sales from MySQL
        if (token) {
          try {
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
          } catch (e) {
            console.warn('Sales fetch failed:', e);
          }
        }

        // 4. Fetch Categories from MySQL
        try {
          const catRes = await fetch(`${apiBase}/api/public/categories`, { headers: { 'Accept': 'application/json' } });
          if (catRes.ok) {
            const catData = await catRes.json();
            if (catData.success && Array.isArray(catData.data)) {
              this.state.categories = catData.data;
            }
          }
        } catch (e) {
          console.warn('Categories fetch failed:', e);
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

    // Record Sold Item (Syncs with MySQL backend & UI State)
    async recordSale(saleParams) {
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

      // If authenticated admin, dispatch real MySQL transaction with row-locking
      const token = localStorage.getItem('egadget_admin_token');
      const apiBase = (typeof getApiBase === 'function') ? getApiBase() : (window.location.port === '8000' ? '' : 'http://127.0.0.1:8000');
      let dbSale = null;

      if (token) {
        try {
          const res = await fetch(`${apiBase}/api/admin/sales`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              item_type: category === 'laptop' ? 'laptop' : 'accessory',
              item_id: product.id || (category === 'laptop' ? product.lpNumber : product.sku),
              qty: qtyToSell,
              price: Number(unitPrice) || product.price,
              customer: customerName || 'Walk-in Guest',
              phone: customerPhone || '',
              payment: (paymentMethod || 'cash').toLowerCase(),
              notes: notes || ''
            })
          });
          const json = await res.json();
          if (!res.ok || !json.success) {
            throw new Error(json.message || 'Failed to record sale in MySQL.');
          }
          dbSale = json;
        } catch (err) {
          console.error('MySQL sale record error:', err);
          throw err;
        }
      }

      // 1. Update product demo stock
      product.quantity = Math.max(0, product.quantity - qtyToSell);
      product.soldQuantity = (product.soldQuantity || 0) + qtyToSell;

      // 2. Create sale record
      const invoiceNo = (dbSale && dbSale.invoice) || `SALE-${Date.now().toString().slice(-5)}`;
      const saleRecord = {
        id: invoiceNo,
        invoice: invoiceNo,
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
        status: 'Completed',
        isLive: Boolean(token)
      };

      this.state.sales.unshift(saleRecord);
      this.saveState();

      if (token) {
        await this.syncWithBackend();
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

    // Add Laptop (Persists directly to live MySQL backend & UI State)
    async addLaptop(data) {
      const lpNum = String(data.lpNumber || data.lp_no || '').trim();
      if (!lpNum) throw new Error('LP NO. is required.');

      const exists = this.state.laptops.some(l => l.lpNumber.toLowerCase() === lpNum.toLowerCase());
      if (exists) {
        throw new Error(`LP #${lpNum} already exists in laptop inventory.`);
      }

      // Parse brand & model if combined
      let brand = (data.brand || '').trim();
      let model = (data.model || '').trim();
      const combined = (data.modelBrand || '').trim();
      if (!brand && combined) {
        const brandMatch = combined.match(/^(HP|Dell|Lenovo|Apple|Asus|Acer|MSI|Toshiba|Samsung|Microsoft)\b/i);
        if (brandMatch) {
          brand = brandMatch[1];
          model = combined.slice(brandMatch[0].length).trim() || 'Commercial Laptop';
        } else {
          brand = 'Commercial';
          model = combined;
        }
      }
      if (!brand) brand = 'Commercial';
      if (!model) model = combined || 'Business Laptop';

      const processor = (data.processor || 'Intel Core i5').trim();
      const generation = (data.generation || '8th Gen').trim();
      const ram = (data.ram || '8GB').trim();
      const storage = (data.storage || '256GB SSD').trim();
      const piece = parseInt(data.quantity || data.piece, 10) || 1;
      const price = Number(data.price) || 20000;
      const status = data.status || 'published';
      const pic = data.image || data.pic || 'assets/images/placeholders/laptop-placeholder.svg';
      const desc = (data.description || data.desc || '').trim();

      // 1. Persist to MySQL via Laravel API
      const token = localStorage.getItem('egadget_admin_token');
      const apiBase = (typeof getApiBase === 'function') ? getApiBase() : (window.location.port === '8000' ? '' : 'http://127.0.0.1:8000');
      let dbRecord = null;

      try {
        const res = await fetch(`${apiBase}/api/admin/laptops`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            lp_no: lpNum,
            brand,
            model,
            processor,
            generation,
            ram,
            storage,
            piece,
            price,
            pic,
            status,
            desc
          })
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
          const errMsg = json.message || (json.errors ? Object.values(json.errors).flat().join(' ') : 'Failed to save laptop to database.');
          throw new Error(errMsg);
        }
        dbRecord = json.data;
      } catch (err) {
        console.error('MySQL laptop persistence error:', err);
        throw err;
      }

      // 2. Commit to local memory with MySQL id
      const newLaptop = {
        id: String(dbRecord.id),
        lpNumber: String(dbRecord.lp_no),
        brand: dbRecord.brand,
        model: dbRecord.model,
        processor: dbRecord.processor,
        generation: dbRecord.generation,
        ram: dbRecord.ram,
        storage: dbRecord.storage,
        quantity: typeof dbRecord.piece === 'number' ? dbRecord.piece : parseInt(dbRecord.piece, 10) || 0,
        soldQuantity: 0,
        price: Number(dbRecord.price),
        image: dbRecord.pic || pic,
        gallery: dbRecord.gallery || [],
        status: dbRecord.status || status,
        warrantyDisplay: data.warrantyDisplay || '6-12 Months Store Warranty',
        description: dbRecord.desc || desc
      };

      this.state.laptops.unshift(newLaptop);
      this.updateCategoryCounts();
      this.saveState();
      return newLaptop;
    }

    // Add Accessory (Persists directly to live MySQL backend & UI State)
    async addAccessory(data) {
      const sku = String(data.sku || '').trim();
      if (!sku) throw new Error('SKU / Item Code is required.');

      const exists = this.state.accessories.some(a => a.sku.toLowerCase() === sku.toLowerCase());
      if (exists) {
        throw new Error(`SKU ${sku} already exists in accessories inventory.`);
      }

      const name = (data.name || 'Laptop Accessory').trim();
      const brand = (data.brand || 'Generic').trim();
      const type = (data.type || 'Charger').trim();
      const model = (data.model || '').trim();
      const compatibility = (data.compatibility || 'Universal').trim();
      const piece = parseInt(data.quantity || data.piece, 10) || 1;
      const price = Number(data.price) || 999;
      const purchasePrice = Number(data.purchasePrice) || (price * 0.7);
      const status = data.status || 'published';
      const pic = data.image || data.pic || 'assets/images/placeholders/accessories-placeholder.svg';
      const desc = (data.description || data.desc || '').trim();

      // 1. Persist to MySQL via Laravel API
      const token = localStorage.getItem('egadget_admin_token');
      const apiBase = (typeof getApiBase === 'function') ? getApiBase() : (window.location.port === '8000' ? '' : 'http://127.0.0.1:8000');
      let dbRecord = null;

      try {
        const res = await fetch(`${apiBase}/api/admin/accessories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            sku,
            name,
            brand,
            type,
            model,
            compatibility,
            piece,
            price,
            pic,
            status,
            desc
          })
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
          const errMsg = json.message || (json.errors ? Object.values(json.errors).flat().join(' ') : 'Failed to save accessory to database.');
          throw new Error(errMsg);
        }
        dbRecord = json.data;
      } catch (err) {
        console.error('MySQL accessory persistence error:', err);
        throw err;
      }

      const newAcc = {
        id: String(dbRecord.id),
        sku: dbRecord.sku,
        name: dbRecord.name,
        brand: dbRecord.brand,
        type: dbRecord.type,
        model: dbRecord.model || model,
        compatibility: dbRecord.compatibility || compatibility,
        quantity: typeof dbRecord.piece === 'number' ? dbRecord.piece : parseInt(dbRecord.piece, 10) || 0,
        soldQuantity: 0,
        purchasePrice: purchasePrice,
        price: Number(dbRecord.price),
        image: dbRecord.pic || pic,
        gallery: dbRecord.gallery || [],
        status: dbRecord.status || status,
        warranty: data.warranty || '1 Year Replacement',
        description: dbRecord.desc || desc
      };

      this.state.accessories.unshift(newAcc);
      this.updateCategoryCounts();
      this.saveState();
      return newAcc;
    }

    // Update Laptop in MySQL & Local State
    async updateLaptop(id, data) {
      const existing = this.state.laptops.find(l => l.id === String(id) || l.lpNumber === String(id));
      if (!existing) throw new Error('Laptop record not found.');

      const targetId = existing.id;
      const token = localStorage.getItem('egadget_admin_token');
      const apiBase = (typeof getApiBase === 'function') ? getApiBase() : (window.location.port === '8000' ? '' : 'http://127.0.0.1:8000');

      const payload = {};
      if (data.lpNumber !== undefined) payload.lp_no = data.lpNumber;
      if (data.brand !== undefined) payload.brand = data.brand;
      if (data.model !== undefined) payload.model = data.model;
      if (data.processor !== undefined) payload.processor = data.processor;
      if (data.generation !== undefined) payload.generation = data.generation;
      if (data.ram !== undefined) payload.ram = data.ram;
      if (data.storage !== undefined) payload.storage = data.storage;
      if (data.quantity !== undefined || data.piece !== undefined) payload.piece = parseInt(data.quantity || data.piece, 10);
      if (data.price !== undefined) payload.price = Number(data.price);
      if (data.status !== undefined) payload.status = data.status;
      if (data.image !== undefined || data.pic !== undefined) payload.pic = data.image || data.pic;
      if (data.description !== undefined || data.desc !== undefined) payload.desc = data.description || data.desc;

      try {
        const res = await fetch(`${apiBase}/api/admin/laptops/${targetId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.message || 'Failed to update laptop in database.');
        }
      } catch (err) {
        console.error('MySQL laptop update error:', err);
        throw err;
      }

      Object.assign(existing, {
        ...(payload.lp_no && { lpNumber: payload.lp_no }),
        ...(payload.brand && { brand: payload.brand }),
        ...(payload.model && { model: payload.model }),
        ...(payload.processor && { processor: payload.processor }),
        ...(payload.generation && { generation: payload.generation }),
        ...(payload.ram && { ram: payload.ram }),
        ...(payload.storage && { storage: payload.storage }),
        ...(payload.piece !== undefined && { quantity: payload.piece }),
        ...(payload.price !== undefined && { price: payload.price }),
        ...(payload.status && { status: payload.status }),
        ...(payload.pic && { image: payload.pic }),
        ...(payload.desc !== undefined && { description: payload.desc })
      });

      this.saveState();
      return existing;
    }

    // Update Accessory in MySQL & Local State
    async updateAccessory(id, data) {
      const existing = this.state.accessories.find(a => a.id === String(id) || a.sku === String(id));
      if (!existing) throw new Error('Accessory record not found.');

      const targetId = existing.id;
      const token = localStorage.getItem('egadget_admin_token');
      const apiBase = (typeof getApiBase === 'function') ? getApiBase() : (window.location.port === '8000' ? '' : 'http://127.0.0.1:8000');

      const payload = {};
      if (data.sku !== undefined) payload.sku = data.sku;
      if (data.name !== undefined) payload.name = data.name;
      if (data.brand !== undefined) payload.brand = data.brand;
      if (data.type !== undefined) payload.type = data.type;
      if (data.model !== undefined) payload.model = data.model;
      if (data.compatibility !== undefined) payload.compatibility = data.compatibility;
      if (data.quantity !== undefined || data.piece !== undefined) payload.piece = parseInt(data.quantity || data.piece, 10);
      if (data.price !== undefined) payload.price = Number(data.price);
      if (data.status !== undefined) payload.status = data.status;
      if (data.image !== undefined || data.pic !== undefined) payload.pic = data.image || data.pic;
      if (data.description !== undefined || data.desc !== undefined) payload.desc = data.description || data.desc;

      try {
        const res = await fetch(`${apiBase}/api/admin/accessories/${targetId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.message || 'Failed to update accessory in database.');
        }
      } catch (err) {
        console.error('MySQL accessory update error:', err);
        throw err;
      }

      Object.assign(existing, {
        ...(payload.sku && { sku: payload.sku }),
        ...(payload.name && { name: payload.name }),
        ...(payload.brand && { brand: payload.brand }),
        ...(payload.type && { type: payload.type }),
        ...(payload.model !== undefined && { model: payload.model }),
        ...(payload.compatibility !== undefined && { compatibility: payload.compatibility }),
        ...(payload.piece !== undefined && { quantity: payload.piece }),
        ...(payload.price !== undefined && { price: payload.price }),
        ...(payload.status && { status: payload.status }),
        ...(payload.pic && { image: payload.pic }),
        ...(payload.desc !== undefined && { description: payload.desc })
      });

      this.saveState();
      return existing;
    }

    // Stock Adjustment (Syncs MySQL and State)
    async updateStockQuantity(category, id, newQty) {
      const isLaptop = category === 'laptop';
      const list = isLaptop ? this.state.laptops : this.state.accessories;
      const item = list.find(x => x.id === String(id) || x.lpNumber === String(id) || x.sku === String(id));
      if (!item) return null;

      const qty = Math.max(0, parseInt(newQty, 10) || 0);
      const targetId = item.id;
      const token = localStorage.getItem('egadget_admin_token');
      const apiBase = (typeof getApiBase === 'function') ? getApiBase() : (window.location.port === '8000' ? '' : 'http://127.0.0.1:8000');

      try {
        const endpoint = isLaptop ? `${apiBase}/api/admin/laptops/${targetId}` : `${apiBase}/api/admin/accessories/${targetId}`;
        await fetch(endpoint, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ piece: qty })
        });
      } catch (err) {
        console.warn('MySQL stock adjust warning:', err);
      }

      item.quantity = qty;
      this.saveState();
      return item;
    }

    // Toggle status (Published <-> Draft) (Syncs MySQL and State)
    async toggleItemStatus(category, id) {
      const isLaptop = category === 'laptop';
      const list = isLaptop ? this.state.laptops : this.state.accessories;
      const item = list.find(x => x.id === String(id) || x.lpNumber === String(id) || x.sku === String(id));
      if (!item) return false;

      const newStatus = item.status === 'published' ? 'draft' : 'published';
      const targetId = item.id;
      const token = localStorage.getItem('egadget_admin_token');
      const apiBase = (typeof getApiBase === 'function') ? getApiBase() : (window.location.port === '8000' ? '' : 'http://127.0.0.1:8000');

      try {
        const endpoint = isLaptop ? `${apiBase}/api/admin/laptops/${targetId}` : `${apiBase}/api/admin/accessories/${targetId}`;
        await fetch(endpoint, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ status: newStatus })
        });
      } catch (err) {
        console.warn('MySQL status toggle warning:', err);
      }

      item.status = newStatus;
      this.saveState();
      return newStatus;
    }

    // Delete Item (Syncs MySQL and State)
    async deleteItem(category, id) {
      const isLaptop = category === 'laptop';
      const list = isLaptop ? this.state.laptops : this.state.accessories;
      const item = list.find(x => x.id === String(id) || x.lpNumber === String(id) || x.sku === String(id));
      if (!item) return false;

      const targetId = item.id;
      const token = localStorage.getItem('egadget_admin_token');
      const apiBase = (typeof getApiBase === 'function') ? getApiBase() : (window.location.port === '8000' ? '' : 'http://127.0.0.1:8000');

      try {
        const endpoint = isLaptop ? `${apiBase}/api/admin/laptops/${targetId}` : `${apiBase}/api/admin/accessories/${targetId}`;
        await fetch(endpoint, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        });
      } catch (err) {
        console.warn('MySQL delete warning:', err);
      }

      if (isLaptop) {
        this.state.laptops = this.state.laptops.filter(l => l.id !== String(id) && l.lpNumber !== String(id));
      } else {
        this.state.accessories = this.state.accessories.filter(a => a.id !== String(id) && a.sku !== String(id));
      }
      this.updateCategoryCounts();
      this.saveState();
      return true;
    }

    // Categories Methods (Syncs MySQL and State)
    async addCategory(catData) {
      const name = (catData.name || '').trim();
      if (!name) throw new Error('Category Name is required.');

      const slug = (catData.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')).trim();
      const code = (catData.code || slug).trim();
      const description = (catData.description || '').trim();
      const status = catData.status || 'active';
      const sort_order = parseInt(catData.displayOrder, 10) || 1;

      const token = localStorage.getItem('egadget_admin_token');
      const apiBase = (typeof getApiBase === 'function') ? getApiBase() : (window.location.port === '8000' ? '' : 'http://127.0.0.1:8000');
      let dbCat = null;

      try {
        const res = await fetch(`${apiBase}/api/admin/categories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            name,
            slug,
            code,
            description,
            status,
            sort_order
          })
        });
        const json = await res.json();
        if (res.ok && json.success && json.data) {
          dbCat = json.data;
        }
      } catch (e) {
        console.warn('MySQL addCategory warning:', e);
      }

      const newCat = {
        id: dbCat ? String(dbCat.id) : `cat-${Date.now()}`,
        name: dbCat ? dbCat.name : name,
        code: dbCat ? (dbCat.code || dbCat.slug) : code,
        slug: dbCat ? dbCat.slug : slug,
        description: dbCat ? dbCat.description : description,
        status: dbCat ? dbCat.status : status,
        displayOrder: sort_order,
        itemCount: 0
      };

      this.state.categories.push(newCat);
      this.saveState();
      return newCat;
    }

    async deleteCategory(catId) {
      const token = localStorage.getItem('egadget_admin_token');
      const apiBase = (typeof getApiBase === 'function') ? getApiBase() : (window.location.port === '8000' ? '' : 'http://127.0.0.1:8000');

      try {
        await fetch(`${apiBase}/api/admin/categories/${catId}`, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        });
      } catch (e) {
        console.warn('MySQL deleteCategory warning:', e);
      }

      this.state.categories = this.state.categories.filter(c => c.id !== String(catId));
      this.saveState();
      return true;
    }

    async toggleCategoryStatus(catId) {
      const cat = this.state.categories.find(c => c.id === String(catId));
      if (cat) {
        cat.status = cat.status === 'active' ? 'inactive' : 'active';
        const token = localStorage.getItem('egadget_admin_token');
        const apiBase = (typeof getApiBase === 'function') ? getApiBase() : (window.location.port === '8000' ? '' : 'http://127.0.0.1:8000');
        try {
          await fetch(`${apiBase}/api/admin/categories/${catId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify({ status: cat.status })
          });
        } catch (e) {
          console.warn('MySQL toggleCategoryStatus warning:', e);
        }
        this.saveState();
        return cat.status;
      }
      return null;
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
