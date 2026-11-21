/**
 * E-Gadget World â Product Inventory & Data Utilities
 * Mehnajpur Branch Inventory (24 records, 38 pieces total)
 */

const PRODUCT_INVENTORY = [];

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
        PRODUCT_INVENTORY.length = 0;
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