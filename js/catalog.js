/**
 * E-Gadget World — Catalog Filter, Search & Rendering Engine
 * Mehnajpur Branch, Azamgarh
 */

class LaptopCatalog {
  constructor() {
    this.laptops = typeof PRODUCT_INVENTORY !== 'undefined' ? PRODUCT_INVENTORY : [];
    this.filteredLaptops = [...this.laptops];
    
    // Elements
    this.gridEl = document.getElementById('catalogLaptopsGrid');
    this.searchInput = document.getElementById('catalogSearchInput');
    this.sortSelect = document.getElementById('catalogSortSelect');
    this.countEl = document.getElementById('catalogCountInfo');
    this.clearBtn = document.getElementById('btnClearFilters');
    this.filterSidebar = document.getElementById('filterSidebar');
    this.mobileFilterToggleBtn = document.getElementById('btnMobileFilterToggle');
    this.mobileFilterCloseBtn = document.getElementById('btnMobileFilterClose');

    // Filter state
    this.filters = {
      search: '',
      brands: [],
      processors: [],
      generations: [],
      rams: [],
      storageTypes: [],
      minPrice: null,
      maxPrice: null,
      inStockOnly: false,
      sortBy: 'featured'
    };

    this.init();
  }

  init() {
    if (!this.gridEl) return;

    this.readUrlParams();
    this.bindEvents();
    this.applyFiltersAndRender();
  }

  bindEvents() {
    // Live Search
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.filters.search = e.target.value.trim().toLowerCase();
        this.applyFiltersAndRender();
      });
    }

    // Sorting
    if (this.sortSelect) {
      this.sortSelect.addEventListener('change', (e) => {
        this.filters.sortBy = e.target.value;
        this.applyFiltersAndRender();
      });
    }

    // Checkbox Filters
    document.querySelectorAll('.filter-checkbox').forEach(cb => {
      cb.addEventListener('change', () => {
        this.collectCheckboxFilters();
        this.applyFiltersAndRender();
      });
    });

    // In Stock Only Toggle
    const inStockToggle = document.getElementById('filterInStockOnly');
    if (inStockToggle) {
      inStockToggle.addEventListener('change', (e) => {
        this.filters.inStockOnly = e.target.checked;
        this.applyFiltersAndRender();
      });
    }

    // Price Inputs
    const minPriceInput = document.getElementById('filterMinPrice');
    const maxPriceInput = document.getElementById('filterMaxPrice');

    const handlePriceChange = () => {
      this.filters.minPrice = minPriceInput?.value ? Number(minPriceInput.value) : null;
      this.filters.maxPrice = maxPriceInput?.value ? Number(maxPriceInput.value) : null;
      this.applyFiltersAndRender();
    };

    if (minPriceInput) minPriceInput.addEventListener('input', handlePriceChange);
    if (maxPriceInput) maxPriceInput.addEventListener('input', handlePriceChange);

    // Clear Filters Button
    if (this.clearBtn) {
      this.clearBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.resetFilters();
      });
    }

    // Mobile Filter Drawer Toggle
    if (this.mobileFilterToggleBtn && this.filterSidebar) {
      this.mobileFilterToggleBtn.addEventListener('click', () => {
        this.filterSidebar.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      });
    }

    if (this.mobileFilterCloseBtn && this.filterSidebar) {
      this.mobileFilterCloseBtn.addEventListener('click', () => {
        this.filterSidebar.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    }
  }

  collectCheckboxFilters() {
    this.filters.brands = Array.from(document.querySelectorAll('input[name="filterBrand"]:checked')).map(el => el.value);
    this.filters.processors = Array.from(document.querySelectorAll('input[name="filterProcessor"]:checked')).map(el => el.value);
    this.filters.generations = Array.from(document.querySelectorAll('input[name="filterGen"]:checked')).map(el => Number(el.value));
    this.filters.rams = Array.from(document.querySelectorAll('input[name="filterRam"]:checked')).map(el => Number(el.value));
    this.filters.storageTypes = Array.from(document.querySelectorAll('input[name="filterStorage"]:checked')).map(el => el.value);
  }

  resetFilters() {
    this.filters = {
      search: '',
      brands: [],
      processors: [],
      generations: [],
      rams: [],
      storageTypes: [],
      minPrice: null,
      maxPrice: null,
      inStockOnly: false,
      sortBy: 'featured'
    };

    if (this.searchInput) this.searchInput.value = '';
    if (this.sortSelect) this.sortSelect.value = 'featured';
    
    document.querySelectorAll('.filter-checkbox').forEach(cb => cb.checked = false);
    
    const inStockToggle = document.getElementById('filterInStockOnly');
    if (inStockToggle) inStockToggle.checked = false;

    const minPriceInput = document.getElementById('filterMinPrice');
    const maxPriceInput = document.getElementById('filterMaxPrice');
    if (minPriceInput) minPriceInput.value = '';
    if (maxPriceInput) maxPriceInput.value = '';

    this.applyFiltersAndRender();
  }

  readUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const search = params.get('search');
    const brand = params.get('brand');
    const processor = params.get('processor');
    const sort = params.get('sort');

    if (search) {
      this.filters.search = search.trim().toLowerCase();
      if (this.searchInput) this.searchInput.value = search;
    }

    if (brand) {
      this.filters.brands = [brand];
      const targetCb = document.querySelector(`input[name="filterBrand"][value="${brand}"]`);
      if (targetCb) targetCb.checked = true;
    }

    if (processor) {
      this.filters.processors = [processor];
      const targetCb = document.querySelector(`input[name="filterProcessor"][value="${processor}"]`);
      if (targetCb) targetCb.checked = true;
    }

    if (sort && this.sortSelect) {
      this.filters.sortBy = sort;
      this.sortSelect.value = sort;
    }
  }

  updateUrlParams() {
    const params = new URLSearchParams();
    if (this.filters.search) params.set('search', this.filters.search);
    if (this.filters.brands.length === 1) params.set('brand', this.filters.brands[0]);
    if (this.filters.sortBy && this.filters.sortBy !== 'featured') params.set('sort', this.filters.sortBy);

    const newUrl = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  }

  applyFiltersAndRender() {
    this.filteredLaptops = this.laptops.filter(laptop => {
      // 1. Search Query
      if (this.filters.search) {
        const query = this.filters.search;
        const matchLp = laptop.lpNumber.toLowerCase().includes(query);
        const matchBrand = laptop.brand.toLowerCase().includes(query);
        const matchModel = laptop.model.toLowerCase().includes(query);
        const matchProc = laptop.processor.toLowerCase().includes(query);
        if (!matchLp && !matchBrand && !matchModel && !matchProc) {
          return false;
        }
      }

      // 2. Brand Filter
      if (this.filters.brands.length > 0) {
        if (!this.filters.brands.includes(laptop.brand)) {
          return false;
        }
      }

      // 3. Processor Filter
      if (this.filters.processors.length > 0) {
        if (!this.filters.processors.some(p => laptop.processor.includes(p))) {
          return false;
        }
      }

      // 4. Generation Filter
      if (this.filters.generations.length > 0) {
        if (!this.filters.generations.includes(laptop.generationNum)) {
          return false;
        }
      }

      // 5. RAM Filter
      if (this.filters.rams.length > 0) {
        if (!this.filters.rams.includes(laptop.ramNum)) {
          return false;
        }
      }

      // 6. Storage Type
      if (this.filters.storageTypes.length > 0) {
        if (!this.filters.storageTypes.includes(laptop.storageType)) {
          return false;
        }
      }

      // 7. Price Min / Max
      if (this.filters.minPrice !== null && laptop.price < this.filters.minPrice) {
        return false;
      }
      if (this.filters.maxPrice !== null && laptop.price > this.filters.maxPrice) {
        return false;
      }

      // 8. In Stock Only
      if (this.filters.inStockOnly && laptop.quantity <= 0) {
        return false;
      }

      return true;
    });

    // Sort
    this.sortLaptops();

    // Render
    this.render();
    this.updateUrlParams();
  }

  sortLaptops() {
    switch (this.filters.sortBy) {
      case 'price_asc':
        this.filteredLaptops.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        this.filteredLaptops.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        this.filteredLaptops.sort((a, b) => `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`));
        break;
      case 'gen_desc':
        this.filteredLaptops.sort((a, b) => (b.generationNum || 0) - (a.generationNum || 0));
        break;
      case 'featured':
      default:
        // Featured laptops first, then by generation
        this.filteredLaptops.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return (b.generationNum || 0) - (a.generationNum || 0);
        });
        break;
    }
  }

  render() {
    // Update count display
    if (this.countEl) {
      this.countEl.innerHTML = `Showing <strong>${this.filteredLaptops.length}</strong> of <strong>${this.laptops.length}</strong> laptops`;
    }

    if (this.filteredLaptops.length === 0) {
      this.gridEl.innerHTML = `
        <div class="catalog-empty-state" style="grid-column: 1 / -1;">
          <div class="catalog-empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </div>
          <h3 class="catalog-empty-title">No Laptops Found</h3>
          <p class="catalog-empty-desc">We couldn't find any laptops matching your current search or filter criteria. Try clearing some filters or searching with another term.</p>
          <button class="btn btn-primary btn-sm" onclick="window.catalogInstance?.resetFilters()">Clear All Filters</button>
        </div>
      `;
      return;
    }

    this.gridEl.innerHTML = this.filteredLaptops.map(laptop => this.createLaptopCardHtml(laptop)).join('');

    // Rebind compare checkboxes if CompareService is loaded
    if (typeof CompareService !== 'undefined') {
      CompareService.syncCardCheckboxes();
    }
  }

  createLaptopCardHtml(laptop) {
    const stock = LaptopService.getStockStatus(laptop.quantity);
    const formattedPrice = LaptopService.formatINR(laptop.price);
    const warrantyLabel = LaptopService.getWarrantyLabel(laptop);
    const waBuyUrl = LaptopService.generateWhatsAppBuyUrl(laptop);
    const detailUrl = `laptop-details.html?lp=${laptop.lpNumber}`;
    const mainImg = (laptop.images && laptop.images.length > 0) ? laptop.images[0] : 'assets/images/laptops/dell-latitude.svg';

    // WhatsApp button state
    let waButtonHtml = '';
    if (stock.canBuy) {
      waButtonHtml = `
        <a href="${waBuyUrl}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-sm" title="Buy ${laptop.brand} ${laptop.model} via WhatsApp">
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z"/>
          </svg>
          Buy
        </a>
      `;
    } else {
      waButtonHtml = `
        <button class="btn btn-disabled btn-sm" disabled title="Currently Unavailable">
          Out of Stock
        </button>
      `;
    }

    return `
      <article class="laptop-card" data-lp="${laptop.lpNumber}">
        <div class="laptop-card-image-wrap">
          <div class="laptop-badge-top-left">
            <span class="laptop-badge-lp">LP #${laptop.lpNumber}</span>
            ${laptop.badge ? `<span class="laptop-badge-custom">${laptop.badge}</span>` : ''}
          </div>
          <div class="laptop-badge-top-right">
            <span class="badge ${stock.badgeClass}">${stock.label}</span>
          </div>
          <a href="${detailUrl}">
            <img src="${mainImg}" alt="${laptop.brand} ${laptop.model} LP #${laptop.lpNumber}" class="laptop-card-img" loading="lazy">
          </a>
        </div>

        <div class="laptop-card-body">
          <div class="laptop-card-brand">${laptop.brand}</div>
          <h3 class="laptop-card-title">
            <a href="${detailUrl}">${laptop.brand} ${laptop.model}</a>
          </h3>

          <div class="laptop-spec-chips">
            <span class="laptop-spec-chip highlight">${laptop.processor}</span>
            <span class="laptop-spec-chip">${laptop.generation}</span>
            <span class="laptop-spec-chip">${laptop.ram} RAM</span>
            <span class="laptop-spec-chip">${laptop.storage}</span>
          </div>

          <div class="laptop-warranty-notice">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <span>${warrantyLabel}</span>
          </div>

          ${laptop.reviewFlag ? `
            <div class="laptop-review-flag" title="${laptop.reviewFlag}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span>Physical tag verification noted</span>
            </div>
          ` : ''}

          <div class="laptop-card-price-row">
            <div>
              <div class="laptop-price-value">${formattedPrice}</div>
              <div class="laptop-price-note">All taxes included • Tested</div>
            </div>
            <div class="badge ${stock.badgeClass}">${stock.qtyLabel}</div>
          </div>

          <div class="laptop-card-actions">
            <a href="${detailUrl}" class="btn btn-outline btn-sm">View Details</a>
            ${waButtonHtml}
          </div>

          <label class="laptop-card-compare-checkbox">
            <input type="checkbox" data-compare-lp="${laptop.lpNumber}" onchange="CompareService?.toggleCompare('${laptop.lpNumber}', this.checked)">
            <span>Add to Compare</span>
          </label>
        </div>
      </article>
    `;
  }
}

// Initialize on catalog page
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('catalogLaptopsGrid')) {
    window.catalogInstance = new LaptopCatalog();
  }
});
