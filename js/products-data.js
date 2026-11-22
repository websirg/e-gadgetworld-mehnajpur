/**
 * E-Gadget World — Product Inventory & Data Utilities
 * Mehnajpur Branch, Azamgarh
 * Dynamic Database Synchronization Engine
 */

const PRODUCT_INVENTORY = [];

// Fallback & Image Safety Engine across E-Gadget World
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

// Helper Utilities & API Sync
const LaptopService = {
  lastSyncStatus: null,

  getApiBase() {
    if (typeof window === 'undefined') return '';
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocal) {
      return window.location.port === '8000' ? '' : 'http://127.0.0.1:8000';
    }
    if (window.location.pathname.includes('/backend-laravel/public')) {
      return window.location.origin + '/backend-laravel/public';
    }
    return '';
  },

  async syncWithApi() {
    const apiBase = this.getApiBase();
    const endpoint = `${apiBase}/api/public/laptops`;
    try {
      const res = await fetch(endpoint, { credentials: 'omit' });
      if (!res.ok) {
        const errorInfo = {
          success: false,
          status: res.status,
          statusText: res.statusText,
          endpoint,
          error: `HTTP ${res.status}: ${res.statusText || 'Server Error'}`
        };
        this.lastSyncStatus = errorInfo;
        console.error('[E-Gadget API Failure] Failed fetching laptop catalog:', errorInfo);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('egadget:inventory-sync-error', { detail: errorInfo }));
        }
        return errorInfo;
      }

      let json;
      try {
        json = await res.json();
      } catch (jsonErr) {
        const errorInfo = {
          success: false,
          status: 'invalid_json',
          endpoint,
          error: 'Response from server is not valid JSON.'
        };
        this.lastSyncStatus = errorInfo;
        console.error('[E-Gadget API Failure] Invalid JSON returned:', jsonErr);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('egadget:inventory-sync-error', { detail: errorInfo }));
        }
        return errorInfo;
      }

      if (!json || typeof json !== 'object' || json.success !== true || !Array.isArray(json.data)) {
        const errorInfo = {
          success: false,
          status: 'unexpected_format',
          endpoint,
          error: 'API returned unexpected response structure.'
        };
        this.lastSyncStatus = errorInfo;
        console.error('[E-Gadget API Failure] Unexpected API response structure:', json);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('egadget:inventory-sync-error', { detail: errorInfo }));
        }
        return errorInfo;
      }

      PRODUCT_INVENTORY.length = 0;
      json.data.forEach(dbItem => {
        const genNum = parseInt(dbItem.generation, 10) || 0;
        const ramNum = parseInt(dbItem.ram, 10) || 0;
        const storageStr = dbItem.storage || '256GB SSD';
        const isNvme = storageStr.toUpperCase().includes('NVME');
        const isSsd = storageStr.toUpperCase().includes('SSD') || isNvme;

        PRODUCT_INVENTORY.push({
          id: String(dbItem.id),
          lpNumber: String(dbItem.lp_no),
          brand: dbItem.brand,
          model: dbItem.model,
          processor: dbItem.processor,
          generation: dbItem.generation,
          generationNum: genNum,
          ram: dbItem.ram,
          ramNum: ramNum,
          storage: storageStr,
          storageType: isNvme ? 'NVMe SSD' : (isSsd ? 'SSD' : 'HDD'),
          storageCapacity: storageStr,
          price: Number(dbItem.price),
          quantity: typeof dbItem.piece === 'number' ? dbItem.piece : parseInt(dbItem.piece, 10) || 0,
          condition: 'Refurbished / Tested',
          warrantyMonths: 12,
          warrantyDisplay: '6-12 Months Store Warranty',
          images: dbItem.pic ? [dbItem.pic] : ['assets/images/placeholders/laptop-placeholder.svg'],
          featured: Boolean(dbItem.featured !== undefined ? dbItem.featured : true),
          badge: dbItem.badge || '',
          description: dbItem.desc || `${dbItem.brand} ${dbItem.model} commercial laptop with ${dbItem.processor}, ${dbItem.ram} RAM and ${dbItem.storage}. Tested in Mehnajpur showroom.`
        });
      });

      const syncResult = {
        success: true,
        status: 200,
        count: PRODUCT_INVENTORY.length,
        error: null,
        data: PRODUCT_INVENTORY
      };
      this.lastSyncStatus = syncResult;

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('egadget:inventory-synced', { detail: PRODUCT_INVENTORY }));
      }
      return syncResult;
    } catch (netErr) {
      const errorInfo = {
        success: false,
        status: 'network_error',
        endpoint,
        error: netErr.message || 'Network connection failed'
      };
      this.lastSyncStatus = errorInfo;
      console.error('[E-Gadget API Failure] Network error during catalog sync:', netErr);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('egadget:inventory-sync-error', { detail: errorInfo }));
      }
      return errorInfo;
    }
  },

  getAll() {
    return PRODUCT_INVENTORY;
  },

  getById(lpNumber) {
    if (!lpNumber) return null;
    const cleanId = String(lpNumber).replace(/^#/, '').trim();
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
    if (laptop && laptop.warrantyMonths) {
      return `${laptop.warrantyMonths} Months Store Warranty`;
    }
    return (laptop && laptop.warrantyDisplay) || "Warranty: Please Confirm with Store";
  },

  generateWhatsAppBuyUrl(laptop, currentUrl = (typeof window !== 'undefined' ? window.location.href : '')) {
    if (!laptop || laptop.quantity <= 0) return null;

    const baseWhatsApp = (typeof BUSINESS_CONFIG !== 'undefined' && BUSINESS_CONFIG.whatsappNumber) 
      ? BUSINESS_CONFIG.whatsappNumber 
      : '919984359860';

    const text = [
      'Hello E-Gadget World Mehnajpur,',
      `I would like to enquire about purchasing this laptop:`,
      `• Model: ${laptop.brand} ${laptop.model} (LP #${laptop.lpNumber})`,
      `• Specs: ${laptop.processor} | ${laptop.ram} RAM | ${laptop.storage}`,
      `• Price: ₹${Number(laptop.price).toLocaleString('en-IN')}`,
      '',
      'Please let me know current availability, warranty options, and showroom test-drive timings.',
      'Thank you.'
    ].join('\n');

    return `https://wa.me/${baseWhatsApp}?text=${encodeURIComponent(text)}`;
  },

  generateWhatsAppEnquiryUrl(laptop) {
    return this.generateWhatsAppBuyUrl(laptop);
  },

  generateWhatsAppInquiryUrl(type = 'general', data = {}) {
    const baseWhatsApp = (typeof BUSINESS_CONFIG !== 'undefined' && BUSINESS_CONFIG.whatsappNumber) 
      ? BUSINESS_CONFIG.whatsappNumber 
      : '919984359860';

    if (type === 'repair') {
      const text = [
        'Hello E-Gadget World Mehnajpur,',
        'I need laptop repair / diagnostic assistance:',
        `• Customer Name: ${data.name || 'Showroom Visitor'}`,
        `• Phone: ${data.phone || 'N/A'}`,
        `• Laptop Model: ${data.laptopModel || 'Not Specified'}`,
        `• Problem: ${data.problem || 'Hardware Diagnostic Required'}`,
        '',
        'Please let me know repair estimate and technician availability.'
      ].join('\n');
      return `https://wa.me/${baseWhatsApp}?text=${encodeURIComponent(text)}`;
    }

    const generalText = 'Hello E-Gadget World Mehnajpur, I would like to enquire about your available commercial laptops, accessories and digital services.';
    return `https://wa.me/${baseWhatsApp}?text=${encodeURIComponent(generalText)}`;
  },

  createCardHtml(laptop, options = {}) {
    if (!laptop) return '';

    const formattedPrice = this.formatINR(laptop.price);
    const warranty = this.getWarrantyLabel(laptop);
    const waEnquiryUrl = this.generateWhatsAppEnquiryUrl(laptop);
    const detailUrl = `laptop-details.html?lp=${laptop.lpNumber}`;
    const mainImg = (laptop.images && laptop.images.length > 0 && laptop.images[0])
      ? laptop.images[0]
      : ImageFallbackHelper.getLaptopFallback();
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

// Global Exposure
if (typeof window !== 'undefined') {
  window.PRODUCT_INVENTORY = PRODUCT_INVENTORY;
  window.LaptopService = LaptopService;
  window.ImageFallbackHelper = ImageFallbackHelper;
  if (!window.getApiBase) {
    window.getApiBase = LaptopService.getApiBase;
  }

  // Auto-trigger live MySQL sync on page ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => LaptopService.syncWithApi());
  } else {
    LaptopService.syncWithApi();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRODUCT_INVENTORY, LaptopService, ImageFallbackHelper };
}
