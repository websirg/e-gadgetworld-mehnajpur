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
    this.filterBackdrop = document.getElementById('filterBackdrop');
    this.mobileFilterToggleBtn = document.getElementById('btnMobileFilterToggle');
    this.mobileFilterCloseBtn = document.getElementById('btnMobileFilterClose');
    this.mobileFilterApplyBtn = document.getElementById('btnMobileFilterApply');

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
    const openDrawer = () => {
      if (this.filterSidebar) this.filterSidebar.classList.add('is-open');
      if (this.filterBackdrop) this.filterBackdrop.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    };

    const closeDrawer = () => {
      if (this.filterSidebar) this.filterSidebar.classList.remove('is-open');
      if (this.filterBackdrop) this.filterBackdrop.classList.remove('is-active');
      document.body.style.overflow = '';
    };

    if (this.mobileFilterToggleBtn) {
      this.mobileFilterToggleBtn.addEventListener('click', openDrawer);
    }

    if (this.mobileFilterCloseBtn) {
      this.mobileFilterCloseBtn.addEventListener('click', closeDrawer);
    }

    if (this.mobileFilterApplyBtn) {
      this.mobileFilterApplyBtn.addEventListener('click', () => {
        closeDrawer();
        window.scrollTo({ top: document.querySelector('.catalog-content')?.offsetTop - 80 || 0, behavior: 'smooth' });
      });
    }

    if (this.filterBackdrop) {
      this.filterBackdrop.addEventListener('click', closeDrawer);
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

    if (this.mobileFilterApplyBtn) {
      this.mobileFilterApplyBtn.textContent = `Show ${this.filteredLaptops.length} Laptops`;
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
    if (typeof LaptopService !== 'undefined' && LaptopService.createCardHtml) {
      return LaptopService.createCardHtml(laptop, { showCompare: true });
    }
    return '';
  }
}

// Initialize on catalog page
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('catalogLaptopsGrid')) {
    window.catalogInstance = new LaptopCatalog();
  }
});
