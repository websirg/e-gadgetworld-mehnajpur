/**
 * E-Gadget World — Admin Dashboard Controller & View Router
 * Mehnajpur HQ, Azamgarh
 * UI-ONLY Implementation (Clean Modular Components, Zero Backend Mutation)
 */

(function() {
  'use strict';

  // State & Pagination
  const uiState = {
    currentView: 'dashboard',
    laptopPage: 1,
    laptopPageSize: 10,
    laptopSearch: '',
    laptopBrandFilter: 'all',
    laptopStockFilter: 'all',
    laptopSort: 'default',
    
    accPage: 1,
    accPageSize: 10,
    accSearch: '',
    accTypeFilter: 'all',
    accStockFilter: 'all',

    salesSearch: '',
    salesDateFilter: 'all',
    salesCatFilter: 'all',
    salesPaymentFilter: 'all',

    activeSoldTarget: null,
    activeEditTarget: null,
    previewUploadedImages: []
  };

  // ==========================================================================
  // 1. ROUTER & VIEW SWITCHER
  // ==========================================================================
  function initRouter() {
    window.addEventListener('hashchange', handleHashRoute);
    if (!window.location.hash) {
      window.location.hash = '#dashboard';
    } else {
      handleHashRoute();
    }
  }

  function handleHashRoute() {
    const rawHash = window.location.hash.replace('#', '').trim();
    const route = rawHash || 'dashboard';
    navigateTo(route, false);
  }

  function navigateTo(viewName, updateHash = true) {
    if (updateHash) {
      window.location.hash = `#${viewName}`;
      return;
    }

    uiState.currentView = viewName;

    // 1. Hide all views & show target view
    document.querySelectorAll('.admin-view').forEach(view => {
      view.classList.remove('active');
    });

    const targetViewEl = document.getElementById(`view-${viewName}`);
    if (targetViewEl) {
      targetViewEl.classList.add('active');
    } else {
      // Fallback to dashboard
      const dashEl = document.getElementById('view-dashboard');
      if (dashEl) dashEl.classList.add('active');
    }

    // 2. Update active nav menu item
    updateActiveNavHighlight(viewName);

    // 3. Update breadcrumbs
    updateBreadcrumbs(viewName);

    // 4. Close mobile sidebar drawer if open
    closeMobileSidebar();

    // 5. Trigger view-specific re-renders
    renderCurrentView(viewName);

    // Scroll to top of content smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateActiveNavHighlight(viewName) {
    document.querySelectorAll('.nav-item, .subnav-item').forEach(el => {
      el.classList.remove('active');
    });

    // Match by data-view or href
    const activeLink = document.querySelector(`[data-view="${viewName}"], a[href="#${viewName}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
      // If it's inside a nav-group, ensure group is open
      const parentGroup = activeLink.closest('.nav-group');
      if (parentGroup) {
        parentGroup.classList.add('is-open');
      }
    }
  }

  function updateBreadcrumbs(viewName) {
    const crumbEl = document.getElementById('crumbCurrent');
    if (!crumbEl) return;

    const names = {
      'dashboard': 'Operations Dashboard',
      'categories': 'Category Management',
      'categories-add': 'Add Category',
      'inventory-all': 'All Inventory Items',
      'inventory-add': 'Add New Item',
      'laptops': 'Commercial Laptop Inventory',
      'accessories': 'Accessories Inventory',
      'sales-all': 'Sales Overview',
      'sales-today': "Today's Sales",
      'sales-history': 'Sales History & Logs',
      'stock': 'Stock & Quantity Management',
      'excel': 'Excel Import & Export',
      'reports': 'Reports & Analytics',
      'settings': 'Operations Settings'
    };

    crumbEl.textContent = names[viewName] || 'Dashboard';
  }

  // ==========================================================================
  // 2. SIDEBAR & ACCORDION CONTROLS
  // ==========================================================================
  function initSidebar() {
    // Desktop Collapse Toggle
    const toggleBtn = document.getElementById('btnSidebarToggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('sidebar-collapsed');
        const isCollapsed = document.body.classList.contains('sidebar-collapsed');
        localStorage.setItem('egadget_admin_sidebar_collapsed', isCollapsed ? '1' : '0');
      });

      if (localStorage.getItem('egadget_admin_sidebar_collapsed') === '1') {
        document.body.classList.add('sidebar-collapsed');
      }
    }

    // Mobile Hamburger Toggle
    const mobileBtn = document.getElementById('btnAdminMobileToggle');
    const sidebar = document.getElementById('adminSidebar');
    const backdrop = document.getElementById('adminSidebarBackdrop');

    if (mobileBtn && sidebar && backdrop) {
      mobileBtn.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
        backdrop.classList.toggle('mobile-open');
      });

      backdrop.addEventListener('click', closeMobileSidebar);
    }

    // Nav Group Accordions
    document.querySelectorAll('.nav-group-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const group = btn.closest('.nav-group');
        if (group) {
          group.classList.toggle('is-open');
        }
      });
    });
  }

  function closeMobileSidebar() {
    const sidebar = document.getElementById('adminSidebar');
    const backdrop = document.getElementById('adminSidebarBackdrop');
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (backdrop) backdrop.classList.remove('mobile-open');
  }

  // ==========================================================================
  // 3. VIEW RENDERERS
  // ==========================================================================
  function renderCurrentView(viewName) {
    updateBadgesAndCounts();

    switch(viewName) {
      case 'dashboard':
        renderSalesCards();
        renderInventoryStatsCards();
        renderDashboardQuickTable();
        break;
      case 'categories':
        renderCategoriesView();
        break;
      case 'categories-add':
        // Prepares add category form
        break;
      case 'inventory-all':
        renderAllInventoryTable();
        break;
      case 'inventory-add':
        initDynamicCategoryForm();
        break;
      case 'laptops':
        renderLaptopsTable();
        break;
      case 'accessories':
        renderAccessoriesTable();
        break;
      case 'sales-all':
      case 'sales-today':
        renderSalesCards();
        renderSalesHistoryTable(viewName === 'sales-today');
        break;
      case 'sales-history':
        renderSalesHistoryTable(false);
        break;
      case 'stock':
        renderStockManagementView();
        break;
      case 'excel':
        initExcelModule();
        break;
      case 'reports':
        renderReportsView();
        break;
      case 'settings':
        renderSettingsView();
        break;
      default:
        renderSalesCards();
        renderInventoryStatsCards();
        break;
    }
  }

  function updateBadgesAndCounts() {
    const stats = window.adminState.getStatistics();

    // Nav badges
    const badgeLp = document.getElementById('navBadgeLaptops');
    if (badgeLp) badgeLp.textContent = stats.laptopCount;

    const badgeAcc = document.getElementById('navBadgeAcc');
    if (badgeAcc) badgeAcc.textContent = stats.accessoriesCount;

    const badgeSales = document.getElementById('navBadgeSales');
    if (badgeSales) badgeSales.textContent = stats.allTimeInvoices;

    const badgeStock = document.getElementById('navBadgeStock');
    if (badgeStock) badgeStock.textContent = `${stats.remainingStock} pcs`;
  }

  // ==========================================================================
  // 4. SALES CARDS (SECTION 8) & INVENTORY STATS CARDS (SECTION 9)
  // ==========================================================================
  function renderSalesCards() {
    const stats = window.adminState.getStatistics();

    // Card 1: Today's Sales (Green Accent)
    const todayAmtEl = document.getElementById('cardTodayRevenue');
    const todaySubEl = document.getElementById('cardTodaySubtitle');
    if (todayAmtEl) todayAmtEl.textContent = `₹${stats.todayRevenue.toLocaleString('en-IN')}`;
    if (todaySubEl) {
      if (stats.todayRevenue === 0) {
        todaySubEl.textContent = 'No sales recorded yet';
        todaySubEl.classList.remove('has-sales');
      } else {
        todaySubEl.textContent = `${stats.todayCount} sale(s) today`;
        todaySubEl.classList.add('has-sales');
      }
    }

    // Card 2: Yesterday's Sales (Purple Accent)
    const yestAmtEl = document.getElementById('cardYesterdayRevenue');
    const yestSubEl = document.getElementById('cardYesterdaySubtitle');
    if (yestAmtEl) yestAmtEl.textContent = `₹${stats.yesterdayRevenue.toLocaleString('en-IN')}`;
    if (yestSubEl) {
      yestSubEl.textContent = stats.yesterdayRevenue === 0 ? 'No sales recorded' : `${stats.yesterdayCount} invoices`;
    }

    // Card 3: Total Sales (All Time)
    const totalAmtEl = document.getElementById('cardTotalRevenue');
    const totalSubEl = document.getElementById('cardTotalSubtitle');
    if (totalAmtEl) totalAmtEl.textContent = `₹${stats.allTimeRevenue.toLocaleString('en-IN')}`;
    if (totalSubEl) totalSubEl.textContent = `${stats.allTimeInvoices} Total Invoices`;
  }

  function renderInventoryStatsCards() {
    const stats = window.adminState.getStatistics();

    const elTotalUnits = document.getElementById('statTotalUnits');
    if (elTotalUnits) elTotalUnits.textContent = stats.totalItemsUnits;

    const elSoldUnits = document.getElementById('statSoldUnits');
    if (elSoldUnits) elSoldUnits.textContent = stats.totalSoldUnits;

    const elRemainingStock = document.getElementById('statRemainingStock');
    if (elRemainingStock) elRemainingStock.textContent = stats.remainingStock;

    const elTotalProducts = document.getElementById('statTotalProducts');
    if (elTotalProducts) elTotalProducts.textContent = stats.totalProductsModels;

    const elLowStock = document.getElementById('statLowStock');
    if (elLowStock) elLowStock.textContent = stats.lowStockItems;

    const elOutOfStock = document.getElementById('statOutOfStock');
    if (elOutOfStock) elOutOfStock.textContent = stats.outOfStockItems;

    const onboardingPanel = document.getElementById('dashboardOnboardingPanel');
    if (onboardingPanel) {
      onboardingPanel.style.display = (stats.totalItemsUnits === 0) ? 'block' : 'none';
    }
  }

  function renderDashboardQuickTable() {
    const tbody = document.getElementById('dashRecentTableBody');
    if (!tbody) return;

    const laptops = window.adminState.state.laptops.slice(0, 5);
    if (laptops.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 40px 16px;">
            <div style="width: 44px; height: 44px; border-radius: 50%; background: #F1F5F9; color: #64748B; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px auto;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="12" x="3" y="4" rx="2"/><line x1="2" y1="20" x2="22" y2="20"/></svg>
            </div>
            <div style="font-size: 14.5px; font-weight: 700; color: #0F172A; margin-bottom: 4px;">No Recent Showroom Stock Available</div>
            <div style="font-size: 12.5px; color: #64748B; margin-bottom: 16px; max-width: 380px; margin-left: auto; margin-right: auto;">
              Your database has been cleanly reset. Add your first showroom laptop or upload an Excel spreadsheet.
            </div>
            <div style="display: flex; gap: 8px; justify-content: center;">
              <a href="#inventory-add" class="btn-admin-primary" style="font-size: 12px; padding: 6px 14px; text-decoration: none;">+ Add Product</a>
              <a href="#excel" class="btn-admin-secondary" style="font-size: 12px; padding: 6px 14px; text-decoration: none;">Import Excel</a>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = laptops.map(laptop => {
      const stockPres = window.AdminStateManager.getPublicStockPresentation(laptop.quantity);
      return `
        <tr>
          <td><span class="cell-lp-badge">LP #${laptop.lpNumber}</span></td>
          <td>
            <div style="font-weight: 700; color: #0F172A;">${laptop.brand} ${laptop.model}</div>
            <div style="font-size: 12px; color: #64748B;">${laptop.processor} • ${laptop.generation}</div>
          </td>
          <td>${laptop.ram} / ${laptop.storage}</td>
          <td><strong>${laptop.quantity}</strong> pcs</td>
          <td><strong>₹${Number(laptop.price).toLocaleString('en-IN')}</strong></td>
          <td><span class="stock-badge-tag ${stockPres.badgeClass}">${stockPres.label}</span></td>
          <td>
            <button class="btn-table-action btn-table-sold" onclick="window.adminController.openSoldModal('laptop', '${laptop.id}')" ${laptop.quantity <= 0 ? 'disabled' : ''}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              Sell / POS
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // ==========================================================================
  // 5. LAPTOPS INVENTORY TABLE (SECTION 4)
  // Columns: LP NO. | MODEL & BRAND | PROCESSOR | GENERATION | RAM | STORAGE | Piece | Price | PIC | Status | Actions
  // ==========================================================================
  function renderLaptopsTable() {
    const tbody = document.getElementById('laptopsTableBody');
    if (!tbody) return;

    let items = [...window.adminState.state.laptops];

    // Filter Search
    if (uiState.laptopSearch) {
      const q = uiState.laptopSearch.toLowerCase();
      items = items.filter(l => 
        l.lpNumber.toLowerCase().includes(q) ||
        l.brand.toLowerCase().includes(q) ||
        l.model.toLowerCase().includes(q) ||
        l.processor.toLowerCase().includes(q) ||
        l.ram.toLowerCase().includes(q) ||
        l.storage.toLowerCase().includes(q)
      );
    }

    // Filter Brand
    if (uiState.laptopBrandFilter !== 'all') {
      items = items.filter(l => l.brand.toLowerCase() === uiState.laptopBrandFilter.toLowerCase());
    }

    // Filter Stock
    if (uiState.laptopStockFilter !== 'all') {
      if (uiState.laptopStockFilter === 'in_stock') items = items.filter(l => l.quantity > 2);
      else if (uiState.laptopStockFilter === 'low_stock') items = items.filter(l => l.quantity > 0 && l.quantity <= 2);
      else if (uiState.laptopStockFilter === 'out_of_stock') items = items.filter(l => l.quantity === 0);
    }

    // Sort
    if (uiState.laptopSort === 'price_asc') items.sort((a,b) => a.price - b.price);
    else if (uiState.laptopSort === 'price_desc') items.sort((a,b) => b.price - a.price);
    else if (uiState.laptopSort === 'piece_desc') items.sort((a,b) => b.quantity - a.quantity);
    else if (uiState.laptopSort === 'lp_asc') items.sort((a,b) => a.lpNumber.localeCompare(b.lpNumber, undefined, {numeric: true}));

    const totalFiltered = items.length;
    const countInfo = document.getElementById('laptopsCountInfo');
    if (countInfo) {
      countInfo.innerHTML = `Showing <strong>${totalFiltered}</strong> models (Showroom Stock)`;
    }

    if (items.length === 0) {
      const isFiltered = Boolean(uiState.laptopSearch || uiState.laptopBrandFilter !== 'all' || uiState.laptopStockFilter !== 'all');
      tbody.innerHTML = `
        <tr>
          <td colspan="11" style="text-align: center; padding: 48px 20px;">
            <div style="margin-bottom: 12px;">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="1.8" style="margin: 0 auto; display: block;">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            </div>
            <div style="font-size: 15px; font-weight: 800; color: #0F172A; margin-bottom: 6px;">
              ${isFiltered ? 'No Laptops Matching Filter Criteria' : 'No Laptop Inventory Records in Database'}
            </div>
            <div style="font-size: 13px; color: #64748B; margin-bottom: 18px; max-width: 480px; margin-left: auto; margin-right: auto;">
              ${isFiltered ? 'Try clearing your search query or brand filters to see all showroom stock.' : 'The showroom laptop catalog is currently empty. Use Excel Import to bulk import laptop records, or add a single model.'}
            </div>
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
              ${isFiltered ? `
                <button class="btn-admin-secondary" onclick="window.adminController.resetLaptopFilters()">Reset All Filters</button>
              ` : `
                <a href="#excel" class="btn-admin-primary" style="display: inline-flex; align-items: center; gap: 6px; text-decoration: none;">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
                  Import Laptops (Excel / CSV)
                </a>
                <a href="#inventory-add" class="btn-admin-secondary" style="display: inline-flex; align-items: center; gap: 6px; text-decoration: none;">
                  + Add Single Laptop
                </a>
              `}
            </div>
          </td>
        </tr>
      `;
      return;
    }

    // Pagination
    const startIdx = (uiState.laptopPage - 1) * uiState.laptopPageSize;
    const paginatedItems = items.slice(startIdx, startIdx + uiState.laptopPageSize);

    tbody.innerHTML = paginatedItems.map(item => {
      const stockPres = window.AdminStateManager.getPublicStockPresentation(item.quantity);
      const isPublished = item.status === 'published';
      const imgSrc = item.image || '../assets/images/placeholders/laptop-placeholder.svg';

      return `
        <tr data-id="${item.id}">
          <td><span class="cell-lp-badge">LP #${item.lpNumber}</span></td>
          <td>
            <div style="font-weight: 800; color: #0F172A;">${item.brand} ${item.model}</div>
            <div style="font-size: 11.5px; color: #2563EB; font-weight: 600;">${item.badge || 'Refurbished Tested'}</div>
          </td>
          <td>${item.processor}</td>
          <td>${item.generation}</td>
          <td><span style="font-weight: 600;">${item.ram}</span></td>
          <td>${item.storage}</td>
          <td>
            <strong style="font-size: 14px;">${item.quantity}</strong>
            <span style="font-size: 11px; color: #64748B;">pcs</span>
          </td>
          <td><strong style="color: #0F172A;">₹${Number(item.price).toLocaleString('en-IN')}</strong></td>
          <td>
            <img src="${imgSrc}" alt="${item.model}" class="cell-img-thumb" onerror="this.src='../assets/images/placeholders/laptop-placeholder.svg'">
          </td>
          <td>
            <button class="status-badge ${isPublished ? 'status-published' : 'status-draft'}" style="cursor: pointer; border: none;" onclick="window.adminController.toggleStatus('laptop', '${item.id}')" title="Click to toggle status">
              ${isPublished ? 'Published' : 'Draft'}
            </button>
          </td>
          <td>
            <div class="table-actions-cell">
              <button class="btn-table-action" onclick="window.adminController.viewItemDetail('laptop', '${item.id}')" title="View details">
                View
              </button>
              <button class="btn-table-action" onclick="window.adminController.editItem('laptop', '${item.id}')" title="Edit laptop">
                Edit
              </button>
              <button class="btn-table-action btn-table-sold" onclick="window.adminController.openSoldModal('laptop', '${item.id}')" ${item.quantity <= 0 ? 'disabled' : ''} title="Record Sale">
                Sold
              </button>
              <button class="btn-table-action btn-table-delete" onclick="window.adminController.confirmDeleteItem('laptop', '${item.id}')" title="Delete record">
                Delete
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    renderPaginationControls('laptop', totalFiltered, uiState.laptopPage, uiState.laptopPageSize);
  }

  // ==========================================================================
  // 6. ACCESSORIES INVENTORY TABLE (SECTION 5)
  // Columns: SKU | Product Name | Brand | Type | Piece | Purchase Price (Admin-only) | Selling Price | PIC | Status | Actions
  // ==========================================================================
  function renderAccessoriesTable() {
    const tbody = document.getElementById('accessoriesTableBody');
    if (!tbody) return;

    let items = [...window.adminState.state.accessories];

    if (uiState.accSearch) {
      const q = uiState.accSearch.toLowerCase();
      items = items.filter(a => 
        a.sku.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q) ||
        a.brand.toLowerCase().includes(q) ||
        a.type.toLowerCase().includes(q) ||
        a.compatibility.toLowerCase().includes(q)
      );
    }

    if (uiState.accTypeFilter !== 'all') {
      items = items.filter(a => a.type.toLowerCase() === uiState.accTypeFilter.toLowerCase());
    }

    if (uiState.accStockFilter !== 'all') {
      if (uiState.accStockFilter === 'in_stock') items = items.filter(a => a.quantity > 2);
      else if (uiState.accStockFilter === 'low_stock') items = items.filter(a => a.quantity > 0 && a.quantity <= 2);
      else if (uiState.accStockFilter === 'out_of_stock') items = items.filter(a => a.quantity === 0);
    }

    const totalFiltered = items.length;
    const countInfo = document.getElementById('accCountInfo');
    if (countInfo) {
      countInfo.innerHTML = `Showing <strong>${totalFiltered}</strong> showroom accessories`;
    }

    if (items.length === 0) {
      const isFiltered = Boolean(uiState.accSearch || uiState.accTypeFilter !== 'all' || uiState.accStockFilter !== 'all');
      tbody.innerHTML = `
        <tr>
          <td colspan="10" style="text-align: center; padding: 48px 20px;">
            <div style="margin-bottom: 12px;">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="1.8" style="margin: 0 auto; display: block;">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </div>
            <div style="font-size: 15px; font-weight: 800; color: #0F172A; margin-bottom: 6px;">
              ${isFiltered ? 'No Accessories Matching Filter Criteria' : 'No Accessory Records in Database'}
            </div>
            <div style="font-size: 13px; color: #64748B; margin-bottom: 18px; max-width: 480px; margin-left: auto; margin-right: auto;">
              ${isFiltered ? 'Try clearing your search query or category filters to see all showroom accessories.' : 'The showroom accessory catalog is currently empty. Use Excel Import to bulk import accessories, or add a single accessory item.'}
            </div>
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
              ${isFiltered ? `
                <button class="btn-admin-secondary" onclick="window.adminController.resetAccFilters()">Reset All Filters</button>
              ` : `
                <a href="#excel" class="btn-admin-primary" style="display: inline-flex; align-items: center; gap: 6px; text-decoration: none;">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
                  Import Accessories (Excel / CSV)
                </a>
                <a href="#inventory-add" class="btn-admin-secondary" style="display: inline-flex; align-items: center; gap: 6px; text-decoration: none;">
                  + Add Single Accessory
                </a>
              `}
            </div>
          </td>
        </tr>
      `;
      return;
    }

    const startIdx = (uiState.accPage - 1) * uiState.accPageSize;
    const paginatedItems = items.slice(startIdx, startIdx + uiState.accPageSize);

    tbody.innerHTML = paginatedItems.map(item => {
      const isPublished = item.status === 'published';
      const imgSrc = item.image || '../assets/images/placeholders/accessories-placeholder.svg';

      return `
        <tr data-id="${item.id}">
          <td><span style="font-family: monospace; font-size: 12px; font-weight: 700; background: #F1F5F9; padding: 2px 6px; border-radius: 4px;">${item.sku}</span></td>
          <td>
            <div style="font-weight: 700; color: #0F172A;">${item.name}</div>
            <div style="font-size: 11.5px; color: #64748B;">${item.compatibility}</div>
          </td>
          <td><span class="badge-brand-pill">${item.brand}</span></td>
          <td><span style="font-size: 12.5px; font-weight: 600; color: #475569;">${item.type}</span></td>
          <td>
            <strong style="font-size: 14px;">${item.quantity}</strong>
            <span style="font-size: 11px; color: #64748B;">pcs</span>
          </td>
          <td>
            <span style="background: #FEF3C7; color: #92400E; font-size: 11.5px; font-weight: 700; padding: 2px 8px; border-radius: 4px;" title="Internal cost price. Hidden from customers.">
              ₹${Number(item.purchasePrice || 0).toLocaleString('en-IN')}
            </span>
          </td>
          <td><strong style="color: #0F172A;">₹${Number(item.price).toLocaleString('en-IN')}</strong></td>
          <td>
            <img src="${imgSrc}" alt="${item.name}" class="cell-img-thumb" onerror="this.src='../assets/images/placeholders/accessories-placeholder.svg'">
          </td>
          <td>
            <button class="status-badge ${isPublished ? 'status-published' : 'status-draft'}" style="cursor: pointer; border: none;" onclick="window.adminController.toggleStatus('accessories', '${item.id}')" title="Click to toggle status">
              ${isPublished ? 'Published' : 'Draft'}
            </button>
          </td>
          <td>
            <div class="table-actions-cell">
              <button class="btn-table-action" onclick="window.adminController.viewItemDetail('accessories', '${item.id}')" title="View details">
                View
              </button>
              <button class="btn-table-action" onclick="window.adminController.editItem('accessories', '${item.id}')" title="Edit item">
                Edit
              </button>
              <button class="btn-table-action btn-table-sold" onclick="window.adminController.openSoldModal('accessories', '${item.id}')" ${item.quantity <= 0 ? 'disabled' : ''} title="Record Sale">
                Sold
              </button>
              <button class="btn-table-action btn-table-delete" onclick="window.adminController.confirmDeleteItem('accessories', '${item.id}')" title="Delete record">
                Delete
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    renderPaginationControls('accessories', totalFiltered, uiState.accPage, uiState.accPageSize);
  }

  function renderPaginationControls(type, totalCount, currentPage, pageSize) {
    const totalPages = Math.ceil(totalCount / pageSize) || 1;
    const paginationBox = document.getElementById(`${type}PaginationBox`);
    if (!paginationBox) return;

    paginationBox.innerHTML = `
      <div>Page <strong>${currentPage}</strong> of <strong>${totalPages}</strong> (${totalCount} total)</div>
      <div class="pagination-controls">
        <button class="btn-page-step" onclick="window.adminController.changePage('${type}', ${currentPage - 1})" ${currentPage <= 1 ? 'disabled' : ''}>&larr; Prev</button>
        <button class="btn-page-step" onclick="window.adminController.changePage('${type}', ${currentPage + 1})" ${currentPage >= totalPages ? 'disabled' : ''}>Next &rarr;</button>
      </div>
    `;
  }

  // ==========================================================================
  // 7. ALL INVENTORY COMBINED VIEW
  // ==========================================================================
  function renderAllInventoryTable() {
    const tbody = document.getElementById('allInventoryTableBody');
    const emptyState = document.getElementById('allInventoryEmptyState');
    const tableWrap = document.getElementById('allInventoryTableWrap');

    const laptops = (window.adminState.state.laptops || []).map(l => ({
      category: 'Commercial Laptop',
      catCode: 'laptop',
      id: l.id,
      code: `LP #${l.lpNumber}`,
      name: `${l.brand} ${l.model}`,
      specs: `${l.processor} | ${l.ram} | ${l.storage}`,
      quantity: Number(l.quantity) || 0,
      price: l.price,
      status: l.status,
      image: l.image
    }));

    const accessories = (window.adminState.state.accessories || []).map(a => ({
      category: 'Laptop Accessory',
      catCode: 'accessories',
      id: a.id,
      code: a.sku,
      name: a.name,
      specs: `${a.brand} ${a.type} | ${a.compatibility}`,
      quantity: Number(a.quantity) || 0,
      price: a.price,
      status: a.status,
      image: a.image
    }));

    const combined = [...laptops, ...accessories];
    let totalPieces = 0;
    combined.forEach(item => totalPieces += item.quantity);

    // Update 4 KPI Summary Cards
    const elTotal = document.getElementById('invCardTotal');
    const elLaptops = document.getElementById('invCardLaptops');
    const elAcc = document.getElementById('invCardAcc');
    const elStock = document.getElementById('invCardStock');

    if (elTotal) elTotal.textContent = combined.length;
    if (elLaptops) elLaptops.textContent = laptops.length;
    if (elAcc) elAcc.textContent = accessories.length;
    if (elStock) elStock.textContent = totalPieces;

    if (combined.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      if (tableWrap) tableWrap.style.display = 'none';
      if (tbody) tbody.innerHTML = '';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (tableWrap) tableWrap.style.display = 'block';

    if (tbody) {
      tbody.innerHTML = combined.map(item => {
        const stockPres = window.AdminStateManager.getPublicStockPresentation(item.quantity);
        return `
          <tr>
            <td><span class="badge-brand-pill">${item.category}</span></td>
            <td><span class="cell-lp-badge">${item.code}</span></td>
            <td><strong>${item.name}</strong></td>
            <td style="font-size: 12.5px; color: #475569;">${item.specs}</td>
            <td><strong>${item.quantity}</strong> pcs</td>
            <td><strong>₹${Number(item.price).toLocaleString('en-IN')}</strong></td>
            <td><span class="stock-badge-tag ${stockPres.badgeClass}">${stockPres.label}</span></td>
            <td>
              <button class="btn-table-action btn-table-sold" onclick="window.adminController.openSoldModal('${item.catCode}', '${item.id}')" ${item.quantity <= 0 ? 'disabled' : ''}>
                Sold
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  // ==========================================================================
  // 8. CATEGORY MANAGEMENT VIEW (SECTION 2)
  // ==========================================================================
  function renderCategoriesView() {
    const gridEl = document.getElementById('categoriesGridContainer');
    if (!gridEl) return;

    window.adminState.updateCategoryCounts();
    const categories = window.adminState.state.categories;

    if (categories.length === 0) {
      gridEl.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 56px 20px; background: #FFFFFF; border: 1px dashed #CBD5E1; border-radius: 12px;">
          <div style="width: 52px; height: 52px; border-radius: 50%; background: #EFF6FF; color: #2563EB; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto;">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          </div>
          <h3 style="font-size: 17px; font-weight: 800; color: #0F172A; margin: 0 0 6px 0;">No Categories Created Yet</h3>
          <p style="font-size: 13.5px; color: #64748B; margin: 0 0 20px 0; max-width: 440px; margin-left: auto; margin-right: auto;">
            The store category list is clean. Create your first category (such as Commercial Laptops, Laptop Accessories, Computer Peripherals) to organize your products.
          </p>
          <a href="#categories-add" class="btn-admin-primary" style="display: inline-flex; align-items: center; gap: 6px;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add First Category
          </a>
        </div>
      `;
      return;
    }

    gridEl.innerHTML = categories.map(cat => {
      const isActive = cat.status === 'active';
      return `
        <div class="admin-panel" style="display: flex; flex-direction: column; justify-content: space-between; border-top: 4px solid ${isActive ? '#2563EB' : '#94A3B8'};">
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
              <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748B;">Order #${cat.displayOrder}</span>
              <button class="status-badge ${isActive ? 'status-published' : 'status-draft'}" style="border: none; cursor: pointer;" onclick="window.adminController.toggleCategoryStatus('${cat.id}')">
                ${isActive ? 'Active' : 'Inactive'}
              </button>
            </div>
            
            <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 14px;">
              <img src="${cat.image}" alt="${cat.name}" style="width: 48px; height: 48px; border-radius: 10px; object-fit: contain; background: #F8FAFC; border: 1px solid #E2E8F0; padding: 4px;">
              <div>
                <h3 style="font-size: 16px; font-weight: 800; margin: 0; color: #0F172A;">${cat.name}</h3>
                <div style="font-size: 12px; font-family: monospace; color: #2563EB;">/${cat.slug}</div>
              </div>
            </div>

            <p style="font-size: 13px; color: #475569; line-height: 1.5; margin-bottom: 16px;">
              ${cat.description || 'No description provided.'}
            </p>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #E2E8F0; padding-top: 14px;">
            <div style="font-size: 13px; font-weight: 700; color: #0F172A;">
              <strong>${cat.itemCount || 0}</strong> Items Loaded
            </div>
            <div style="display: flex; gap: 6px;">
              <button class="btn-table-action" onclick="window.adminController.editCategory('${cat.id}')">Edit</button>
              <button class="btn-table-action btn-table-delete" onclick="window.adminController.confirmDeleteCategory('${cat.id}')">Delete</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // ==========================================================================
  // 9. DYNAMIC CATEGORY ADD ITEM FORM (SECTION 3)
  // ==========================================================================
  function initDynamicCategoryForm() {
    const catSelect = document.getElementById('addItemCategorySelect');
    if (!catSelect) return;

    catSelect.removeEventListener('change', handleCategoryFormSwitch);
    catSelect.addEventListener('change', handleCategoryFormSwitch);

    // Initial render with current selected value
    renderDynamicFormFields(catSelect.value || 'laptop');
    initImageUploadDropzone();
  }

  function handleCategoryFormSwitch(e) {
    const selectedCategory = e.target.value;
    renderDynamicFormFields(selectedCategory);
  }

  function renderDynamicFormFields(categoryCode) {
    const container = document.getElementById('dynamicFieldsContainer');
    if (!container) return;

    const schema = window.CATEGORY_FORM_SCHEMAS[categoryCode];
    if (!schema) {
      container.innerHTML = `<div class="alert-box warning">Schema for category "${categoryCode}" is not configured.</div>`;
      return;
    }

    container.innerHTML = schema.sections.map(sec => `
      <div style="margin-bottom: 24px;">
        <h3 style="font-size: 15px; font-weight: 800; color: #1E293B; margin-bottom: 14px; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px;">
          ${sec.title}
        </h3>
        <div class="form-grid-2">
          ${sec.fields.map(field => renderFieldHtml(field)).join('')}
        </div>
      </div>
    `).join('');
  }

  function renderFieldHtml(field) {
    const isRequired = field.required;
    const reqStar = isRequired ? '<span class="required-star">*</span>' : '';
    const hint = field.hint ? `<span class="form-hint">${field.hint}</span>` : '';

    if (field.type === 'select') {
      return `
        <div class="form-group ${field.id === 'description' ? 'col-full' : ''}">
          <label class="form-label" for="field_${field.id}">${field.label} ${reqStar}</label>
          <select id="field_${field.id}" name="${field.id}" class="form-select" ${isRequired ? 'required' : ''}>
            ${field.options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
          </select>
          ${hint}
        </div>
      `;
    }

    if (field.type === 'textarea') {
      return `
        <div class="form-group col-full">
          <label class="form-label" for="field_${field.id}">${field.label} ${reqStar}</label>
          <textarea id="field_${field.id}" name="${field.id}" class="form-textarea" placeholder="${field.placeholder || ''}" ${isRequired ? 'required' : ''}></textarea>
          ${hint}
        </div>
      `;
    }

    return `
      <div class="form-group">
        <label class="form-label" for="field_${field.id}">${field.label} ${reqStar}</label>
        <input type="${field.type}" id="field_${field.id}" name="${field.id}" class="form-input" placeholder="${field.placeholder || ''}" value="${field.defaultValue !== undefined ? field.defaultValue : ''}" ${isRequired ? 'required' : ''} ${field.min !== undefined ? `min="${field.min}"` : ''}>
        ${hint}
      </div>
    `;
  }

  function initImageUploadDropzone() {
    const dropzone = document.getElementById('imageUploadDropzone');
    const fileInput = document.getElementById('productImageInput');
    const previewBox = document.getElementById('imagePreviewWrap');

    if (!dropzone || !fileInput) return;

    dropzone.onclick = () => fileInput.click();

    fileInput.onchange = (e) => {
      const files = Array.from(e.target.files);
      if (!files.length) return;

      uiState.previewUploadedImages = [];
      if (previewBox) previewBox.innerHTML = '';

      files.forEach(file => {
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
          showToast(`Unsupported format (${file.name}). Please upload JPG, PNG or WebP.`, 'error');
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          showToast(`File too large (${file.name}). Maximum allowed size is 5MB.`, 'error');
          return;
        }

        const reader = new FileReader();
        reader.onload = (loadEvent) => {
          const dataUrl = loadEvent.target.result;
          uiState.previewUploadedImages.push(dataUrl);

          if (previewBox) {
            const thumbDiv = document.createElement('div');
            thumbDiv.className = 'preview-thumb-box';
            thumbDiv.innerHTML = `
              <img src="${dataUrl}" alt="Preview">
              <button type="button" class="btn-remove-thumb" title="Remove image">&times;</button>
            `;
            thumbDiv.querySelector('.btn-remove-thumb').onclick = (ev) => {
              ev.stopPropagation();
              thumbDiv.remove();
              const idx = uiState.previewUploadedImages.indexOf(dataUrl);
              if (idx > -1) uiState.previewUploadedImages.splice(idx, 1);
            };
            previewBox.appendChild(thumbDiv);
          }
        };
        reader.readAsDataURL(file);
      });
    };
  }

  function handleSaveCategorySubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    const nameInput = document.getElementById('catNameInput');
    const slugInput = document.getElementById('catSlugInput');
    const descInput = document.getElementById('catDescInput');
    const statusSelect = document.getElementById('catStatusSelect');
    const orderInput = document.getElementById('catOrderInput');

    const name = nameInput ? nameInput.value.trim() : '';
    if (!name) {
      showToast('Please enter a category name.', 'error');
      return;
    }

    const slug = slugInput ? slugInput.value.trim() : '';
    const desc = descInput ? descInput.value.trim() : '';
    const status = statusSelect ? statusSelect.value : 'active';
    const displayOrder = orderInput ? parseInt(orderInput.value, 10) || 1 : 1;

    try {
      const cat = window.adminState.addCategory({
        name,
        slug,
        description: desc,
        status,
        displayOrder
      });
      showToast(`Category "${cat.name}" registered successfully!`, 'success');
      if (nameInput) nameInput.value = '';
      if (slugInput) slugInput.value = '';
      if (descInput) descInput.value = '';
      navigateTo('categories');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  function handleSaveProductSubmit(e) {
    e.preventDefault();
    const catSelect = document.getElementById('addItemCategorySelect');
    const catCode = catSelect ? catSelect.value : 'laptop';

    const formData = {};
    const schema = window.CATEGORY_FORM_SCHEMAS[catCode];
    if (!schema) return;

    schema.sections.forEach(sec => {
      sec.fields.forEach(field => {
        const el = document.getElementById(`field_${field.id}`);
        if (el) {
          formData[field.id] = el.value;
        }
      });
    });

    // Image fallback or uploaded
    const uploadedImg = uiState.previewUploadedImages[0] || '';
    if (uploadedImg) {
      formData.image = uploadedImg;
      formData.gallery = [...uiState.previewUploadedImages];
    }

    try {
      if (catCode === 'laptop') {
        const item = window.adminState.addLaptop(formData);
        showToast(`Laptop LP #${item.lpNumber} added successfully to Showroom inventory!`, 'success');
        navigateTo('laptops');
      } else {
        const item = window.adminState.addAccessory(formData);
        showToast(`Accessory ${item.sku} added successfully to inventory!`, 'success');
        navigateTo('accessories');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  // ==========================================================================
  // 10. SOLD CONFIRMATION MODAL (SECTION 7 — STRICTLY UI ONLY)
  // ==========================================================================
  function openSoldModal(category, itemId) {
    let item = null;
    let categoryName = '';
    let lpOrSku = '';

    if (category === 'laptop') {
      item = window.adminState.state.laptops.find(l => l.id === itemId || l.lpNumber === itemId);
      categoryName = 'Commercial Laptop';
      if (item) lpOrSku = `LP #${item.lpNumber}`;
    } else {
      item = window.adminState.state.accessories.find(a => a.id === itemId || a.sku === itemId);
      categoryName = 'Laptop Accessory';
      if (item) lpOrSku = item.sku;
    }

    if (!item) {
      showToast('Item not found.', 'error');
      return;
    }

    if (item.quantity <= 0) {
      showToast('This item is already Sold Out (0 pieces remaining).', 'error');
      return;
    }

    uiState.activeSoldTarget = { category, itemId, item };

    // Fill Modal Fields
    document.getElementById('soldModalProductName').textContent = category === 'laptop' ? `${item.brand} ${item.model}` : item.name;
    document.getElementById('soldModalLpSku').textContent = lpOrSku;
    document.getElementById('soldModalAvailableQty').textContent = `${item.quantity} available`;
    
    const qtyInput = document.getElementById('soldInputQty');
    qtyInput.value = 1;
    qtyInput.max = item.quantity;
    qtyInput.min = 1;

    const priceInput = document.getElementById('soldInputPrice');
    priceInput.value = item.price;

    document.getElementById('soldInputDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('soldInputCustomerName').value = '';
    document.getElementById('soldInputCustomerPhone').value = '';
    document.getElementById('soldInputNotes').value = '';

    updateSoldTotalCalculation();

    // Event listeners for live calculation
    qtyInput.oninput = updateSoldTotalCalculation;
    priceInput.oninput = updateSoldTotalCalculation;

    openModal('soldModalOverlay');
  }

  function updateSoldTotalCalculation() {
    const qtyInput = document.getElementById('soldInputQty');
    const priceInput = document.getElementById('soldInputPrice');
    const totalEl = document.getElementById('soldModalCalculatedTotal');

    const qty = parseInt(qtyInput.value, 10) || 0;
    const price = parseFloat(priceInput.value) || 0;
    const total = qty * price;

    if (totalEl) totalEl.textContent = `₹${total.toLocaleString('en-IN')}`;
  }

  function handleConfirmSold() {
    if (!uiState.activeSoldTarget) return;

    const { category, itemId, item } = uiState.activeSoldTarget;
    const qtyInput = document.getElementById('soldInputQty');
    const priceInput = document.getElementById('soldInputPrice');
    const dateInput = document.getElementById('soldInputDate');
    const nameInput = document.getElementById('soldInputCustomerName');
    const phoneInput = document.getElementById('soldInputCustomerPhone');
    const paymentSelect = document.getElementById('soldSelectPayment');
    const notesInput = document.getElementById('soldInputNotes');

    const qty = parseInt(qtyInput.value, 10);
    const unitPrice = parseFloat(priceInput.value);

    try {
      const sale = window.adminState.recordSale({
        category,
        itemId,
        quantity: qty,
        unitPrice,
        saleDate: dateInput.value,
        customerName: nameInput.value,
        customerPhone: phoneInput.value,
        paymentMethod: paymentSelect.value,
        notes: notesInput.value
      });

      closeModal('soldModalOverlay');
      showToast(`Sale #${sale.id} recorded! Total: ₹${sale.totalAmount.toLocaleString('en-IN')}`, 'success');
      
      // Refresh current view & counts
      renderCurrentView(uiState.currentView);
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  // ==========================================================================
  // 11. SALES HISTORY TABLE (SECTION 10)
  // Columns: Sale ID | Date | Product | LP NO. / SKU | Category | Quantity | Unit Price | Total Amount | Payment Method | Status | Actions
  // ==========================================================================
  function renderSalesHistoryTable(todayOnly = false) {
    const tbody1 = document.getElementById('salesHistoryTableBody');
    const tbody2 = document.getElementById('salesHistoryTableBody2');
    if (!tbody1 && !tbody2) return;

    const stats = window.adminState.getStatistics();

    // Populate Sales History KPI Summary Cards
    const elTotRev = document.getElementById('cardHistTotalRevenue');
    if (elTotRev) elTotRev.textContent = `₹${stats.allTimeRevenue.toLocaleString('en-IN')}`;

    const elTotInv = document.getElementById('cardHistTotalInvoices');
    if (elTotInv) elTotInv.textContent = `${stats.allTimeInvoices} Total Invoices`;

    const elTodayRev = document.getElementById('cardHistTodayRevenue');
    if (elTodayRev) elTodayRev.textContent = `₹${stats.todayRevenue.toLocaleString('en-IN')}`;

    const elTodaySub = document.getElementById('cardHistTodaySubtitle');
    if (elTodaySub) elTodaySub.textContent = stats.todayRevenue === 0 ? 'No sales today' : `${stats.todayCount} invoice(s) today`;

    const elTotTx = document.getElementById('cardHistTotalTx');
    if (elTotTx) elTotTx.textContent = stats.allTimeInvoices;

    const elTotUnits = document.getElementById('cardHistTotalUnits');
    if (elTotUnits) elTotUnits.textContent = stats.totalSoldUnits;

    let sales = [...window.adminState.state.sales];

    if (todayOnly) {
      const todayStr = new Date().toISOString().split('T')[0];
      sales = sales.filter(s => s.date === todayStr);
    }

    if (uiState.salesSearch) {
      const q = uiState.salesSearch.toLowerCase();
      sales = sales.filter(s => 
        s.id.toLowerCase().includes(q) ||
        s.productName.toLowerCase().includes(q) ||
        s.lpNumber.toLowerCase().includes(q) ||
        (s.customerName && s.customerName.toLowerCase().includes(q))
      );
    }

    if (uiState.salesCatFilter !== 'all') {
      sales = sales.filter(s => s.category.toLowerCase().includes(uiState.salesCatFilter.toLowerCase()));
    }

    if (uiState.salesPaymentFilter !== 'all') {
      sales = sales.filter(s => s.paymentMethod.toLowerCase() === uiState.salesPaymentFilter.toLowerCase());
    }

    const countInfo = document.getElementById('salesHistoryCountInfo');
    if (countInfo) {
      countInfo.innerHTML = `Showing <strong>${sales.length}</strong> recorded transactions`;
    }

    const renderEmptyState = () => `
      <tr>
        <td colspan="11" style="text-align: center; padding: 56px 20px;">
          <div style="max-width: 440px; margin: 0 auto;">
            <div style="width: 52px; height: 52px; border-radius: 50%; background: #F1F5F9; color: #64748B; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px auto;">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            </div>
            <h4 style="font-size: 16px; font-weight: 800; color: #0F172A; margin: 0 0 6px 0;">No Sales Recorded Yet</h4>
            <p style="font-size: 13px; color: #64748B; margin: 0 0 18px 0;">
              Your showroom sales log is completely clean. Click "Sell / POS" on any inventory item to record a customer transaction.
            </p>
            <button type="button" class="btn-admin-primary" onclick="window.adminController.openSoldModal('laptop', '')">+ Create New Sale / POS</button>
          </div>
        </td>
      </tr>
    `;

    if (sales.length === 0) {
      const emptyHtml = renderEmptyState();
      if (tbody1) tbody1.innerHTML = emptyHtml;
      if (tbody2) tbody2.innerHTML = emptyHtml;
      return;
    }

    const rowsHtml = sales.map(s => `
      <tr>
        <td><strong style="color: #2563EB; font-family: monospace;">#${s.id}</strong></td>
        <td>${s.date}</td>
        <td><strong>${s.productName}</strong></td>
        <td><span class="cell-lp-badge">${s.lpNumber}</span></td>
        <td><span class="badge-brand-pill">${s.category}</span></td>
        <td><strong>${s.quantity}</strong></td>
        <td>₹${Number(s.unitPrice).toLocaleString('en-IN')}</td>
        <td><strong style="color: #10B981;">₹${Number(s.totalAmount).toLocaleString('en-IN')}</strong></td>
        <td><span style="font-size: 12px; font-weight: 700; background: #F1F5F9; padding: 2px 6px; border-radius: 4px;">${s.paymentMethod}</span></td>
        <td><span class="status-badge status-published">Completed</span></td>
        <td>
          <div class="table-actions-cell">
            <button class="btn-table-action" onclick="window.adminController.viewSaleDetail('${s.id}')">View</button>
            <button class="btn-table-action btn-table-delete" onclick="window.adminController.confirmCancelSale('${s.id}')">Cancel</button>
          </div>
        </td>
      </tr>
    `).join('');

    if (tbody1) tbody1.innerHTML = rowsHtml;
    if (tbody2) tbody2.innerHTML = rowsHtml;
  }

  // ==========================================================================
  // 12. STOCK MANAGEMENT VIEW (SECTION 6)
  // ==========================================================================
  function renderStockManagementView() {
    const tbody = document.getElementById('stockTableBody');
    if (!tbody) return;

    const stats = window.adminState.getStatistics();

    // Update 5 KPI Summary Cards on Stock Management Page
    const elTotProd = document.getElementById('statStockTotalProducts');
    if (elTotProd) elTotProd.textContent = (stats.laptopModels || 0) + (stats.accessoriesModels || 0);

    const elLpStock = document.getElementById('statStockLaptopUnits');
    if (elLpStock) elLpStock.textContent = `${stats.laptopUnits || 0} pcs`;

    const elAccStock = document.getElementById('statStockAccUnits');
    if (elAccStock) elAccStock.textContent = `${stats.accessoriesUnits || 0} pcs`;

    const elLowStock = document.getElementById('statStockLowStock');
    if (elLowStock) elLowStock.textContent = (stats.lowStockLaptops || 0) + (stats.lowStockAccessories || 0);

    const elOutOfStock = document.getElementById('statStockOutOfStock');
    if (elOutOfStock) elOutOfStock.textContent = (stats.outOfStockLaptops || 0) + (stats.outOfStockAccessories || 0);

    const items = [
      ...window.adminState.state.laptops.map(l => ({
        id: l.id,
        categoryType: 'laptop',
        type: 'Commercial Laptop',
        code: `LP #${l.lpNumber}`,
        name: `${l.brand} ${l.model}`,
        category: 'Laptops',
        availableQty: l.quantity,
        soldQty: l.soldQuantity || 0,
        unitPrice: l.price,
        image: l.image || 'assets/images/placeholders/laptop-placeholder.svg',
        visibility: l.status === 'published' ? 'Visible (Catalog)' : 'Hidden (Draft)'
      })),
      ...window.adminState.state.accessories.map(a => ({
        id: a.id,
        categoryType: 'accessories',
        type: 'Accessory',
        code: a.sku,
        name: a.name,
        category: a.type || 'Accessories',
        availableQty: a.quantity,
        soldQty: a.soldQuantity || 0,
        unitPrice: a.price,
        image: a.image || 'assets/images/placeholders/accessories-placeholder.svg',
        visibility: a.status === 'published' ? 'Visible (Catalog)' : 'Hidden (Draft)'
      }))
    ];

    if (items.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align: center; padding: 56px 20px;">
            <div style="max-width: 440px; margin: 0 auto;">
              <div style="width: 52px; height: 52px; border-radius: 50%; background: #F1F5F9; color: #64748B; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px auto;">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>
              </div>
              <h4 style="font-size: 16px; font-weight: 800; color: #0F172A; margin: 0 0 6px 0;">No Stock Items Found in Inventory</h4>
              <p style="font-size: 13px; color: #64748B; margin: 0 0 18px 0;">
                The inventory is currently clean. Add your first commercial laptop or accessory, or import from an Excel/CSV spreadsheet.
              </p>
              <div style="display: flex; gap: 10px; justify-content: center;">
                <a href="#inventory-add" class="btn-admin-primary">+ Add Product</a>
                <a href="#excel" class="btn-admin-secondary">Import Spreadsheet</a>
              </div>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = items.map(item => {
      const stockPres = window.AdminStateManager.getPublicStockPresentation(item.availableQty);
      return `
        <tr>
          <td><img src="${item.image}" alt="${item.name}" style="width: 36px; height: 36px; object-fit: contain; border-radius: 6px; border: 1px solid #E2E8F0; background: #F8FAFC; padding: 2px;"></td>
          <td><span class="cell-lp-badge">${item.code}</span></td>
          <td><strong>${item.name}</strong></td>
          <td><span class="badge-brand-pill">${item.category}</span></td>
          <td><strong style="font-size: 14px; color: #0F172A;">${item.availableQty}</strong> pcs</td>
          <td>${item.soldQty} pcs</td>
          <td><span class="stock-badge-tag ${stockPres.badgeClass}">${stockPres.label}</span></td>
          <td style="font-size: 12px; color: #475569;">${item.visibility}</td>
          <td>
            <div class="table-actions-cell">
              <button class="btn-table-action" onclick="window.adminController.openAdjustStockModal('${item.categoryType}', '${item.id}')" title="Adjust stock">Adjust</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // ==========================================================================
  // 13. EXCEL IMPORT & EXPORT (SECTION 11)
  // ==========================================================================
  function initExcelModule() {
    const dropzone = document.getElementById('excelDropzone');
    const fileInput = document.getElementById('excelFileInput');

    if (dropzone && fileInput) {
      dropzone.onclick = () => fileInput.click();

      fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) handleExcelFileUpload(file);
      };

      dropzone.ondragover = (e) => {
        e.preventDefault();
        dropzone.classList.add('drag-active');
      };

      dropzone.ondragleave = () => {
        dropzone.classList.remove('drag-active');
      };

      dropzone.ondrop = (e) => {
        e.preventDefault();
        dropzone.classList.remove('drag-active');
        const file = e.dataTransfer.files[0];
        if (file) handleExcelFileUpload(file);
      };
    }
  }

  function handleExcelFileUpload(file) {
    const fileInfoBox = document.getElementById('excelFileInfo');
    if (fileInfoBox) {
      fileInfoBox.innerHTML = `
        <strong>Selected File:</strong> ${file.name} (${(file.size / 1024).toFixed(1)} KB) • Reading spreadsheet...
      `;
      fileInfoBox.style.display = 'block';
    }

    const isBinary = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');

    if (isBinary && typeof XLSX !== 'undefined') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: '', raw: false });
          processSpreadsheetRows(rawRows, file.name);
        } catch (err) {
          console.error('SheetJS parse error:', err);
          showToast('Failed to parse Excel file: ' + err.message, 'error');
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      // CSV or fallback reader
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        if (typeof XLSX !== 'undefined') {
          try {
            const workbook = XLSX.read(text, { type: 'string' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: '', raw: false });
            processSpreadsheetRows(rawRows, file.name);
            return;
          } catch (err) {}
        }
        parseAndPreviewCSVText(text, file.name);
      };
      reader.readAsText(file);
    }
  }

  let stagedImportData = null;

  function processSpreadsheetRows(rows, fileName) {
    if (!rows || rows.length === 0) {
      showToast('Spreadsheet contains no data rows.', 'error');
      return;
    }

    const targetRadio = document.querySelector('input[name="excelTargetType"]:checked');
    let targetType = targetRadio ? targetRadio.value : 'laptop';

    // Auto-detect if user left default
    const firstRowKeys = Object.keys(rows[0] || {}).map(k => k.trim().toUpperCase());
    const hasLaptopHeader = firstRowKeys.some(k => k.includes('LP') || k.includes('PROCESSOR') || k.includes('GENERATION') || k.includes('STORAE'));
    if (hasLaptopHeader) targetType = 'laptop';

    function getRowVal(row, aliases) {
      const keys = Object.keys(row);
      for (const alias of aliases) {
        const found = keys.find(k => k.trim().toUpperCase() === alias.toUpperCase());
        if (found && row[found] !== undefined && String(row[found]).trim() !== '') {
          return String(row[found]).trim();
        }
      }
      for (const alias of aliases) {
        const found = keys.find(k => k.trim().toUpperCase().includes(alias.toUpperCase()));
        if (found && row[found] !== undefined && String(row[found]).trim() !== '') {
          return String(row[found]).trim();
        }
      }
      return '';
    }

    let parsedItems = [];
    let validCount = 0;
    let invalidCount = 0;
    let totalPieces = 0;

    if (targetType === 'laptop') {
      parsedItems = rows.map((row, idx) => {
        const lpNumber = getRowVal(row, ['LP NO.', 'LP NUMBER', 'LP NO', 'LP', 'ID']) || String(3900 + idx);
        const modelBrand = getRowVal(row, ['MODEL & BRAND', 'MODEL', 'BRAND']) || 'Commercial Laptop';
        
        let brand = 'HP';
        let model = modelBrand;
        const brandMatch = modelBrand.match(/^(HP|Dell|Lenovo|Apple|Asus|Acer|MSI|Toshiba|Samsung|Microsoft)\b/i);
        if (brandMatch) {
          brand = brandMatch[1];
          model = modelBrand.slice(brandMatch[0].length).trim() || 'Commercial Laptop';
        }

        const processor = getRowVal(row, ['PROCESSOR', 'CPU']) || 'Intel Core i5';
        const generation = getRowVal(row, ['GENERATION', 'GEN']) || '8th Gen';
        const ram = getRowVal(row, ['RAM', 'MEMORY']) || '8GB';
        // Support STORAE alias (from real owner spreadsheet)
        const storage = getRowVal(row, ['STORAE', 'STORAGE', 'SSD', 'HDD']) || '256GB SSD';
        const piece = parseInt(getRowVal(row, ['PIECE', 'QUANTITY', 'QTY', 'PIECES']), 10) || 1;
        const rawPrice = getRowVal(row, ['PRICE', 'SELLING PRICE', 'RATE', 'MRP']);
        const price = parseFloat(rawPrice.replace(/[^0-9.]/g, '')) || 24000;
        const pic = getRowVal(row, ['PIC', 'IMAGE', 'PHOTO']) || '../assets/images/placeholders/laptop-placeholder.svg';

        const isValid = Boolean(lpNumber && price > 0);
        if (isValid) validCount++; else invalidCount++;
        totalPieces += piece;

        return {
          id: `lp-imp-${Date.now()}-${idx}`,
          lpNumber,
          brand,
          model,
          processor,
          generation,
          ram,
          storage,
          quantity: piece,
          price,
          image: pic,
          status: 'published',
          isValid,
          warrantyDisplay: '6-12 Months Store Warranty',
          description: `${brand} ${model} Commercial Laptop • ${processor} • ${ram} • ${storage}`
        };
      });
    } else {
      // Accessories
      parsedItems = rows.map((row, idx) => {
        const sku = getRowVal(row, ['SKU', 'ITEM CODE', 'CODE', 'ID']) || `ACC-${Date.now()}-${idx + 1}`;
        const name = getRowVal(row, ['PRODUCT NAME', 'NAME', 'TITLE']) || 'Laptop Accessory';
        const brand = getRowVal(row, ['BRAND', 'MAKE']) || 'Generic';
        const type = getRowVal(row, ['ACCESSORY TYPE', 'TYPE', 'CATEGORY']) || 'Charger';
        const model = getRowVal(row, ['MODEL', 'PART NO']) || '';
        const compatibility = getRowVal(row, ['COMPATIBILITY', 'COMPATIBLE']) || 'Universal';
        const color = getRowVal(row, ['COLOR', 'COLOUR']) || 'Black';
        const warranty = getRowVal(row, ['WARRANTY']) || '1 Year Replacement';
        const piece = parseInt(getRowVal(row, ['PIECE', 'QUANTITY', 'QTY']), 10) || 1;
        const rawPrice = getRowVal(row, ['SELLING PRICE', 'PRICE', 'RATE']);
        const price = parseFloat(rawPrice.replace(/[^0-9.]/g, '')) || 1000;
        const pic = getRowVal(row, ['PIC', 'IMAGE', 'PHOTO']) || '../assets/images/placeholders/accessories-placeholder.svg';

        const isValid = Boolean(sku && price > 0);
        if (isValid) validCount++; else invalidCount++;
        totalPieces += piece;

        return {
          id: `acc-imp-${Date.now()}-${idx}`,
          sku,
          name,
          brand,
          type,
          model,
          compatibility,
          color,
          warranty,
          quantity: piece,
          price,
          purchasePrice: Math.round(price * 0.7),
          image: pic,
          status: 'published',
          isValid,
          description: `${brand} ${name}`
        };
      });
    }

    // STRICT PREVIEW ISOLATION: Staged in memory ONLY
    stagedImportData = {
      type: targetType,
      items: parsedItems
    };

    renderExcelPreviewUI(parsedItems, targetType, validCount, invalidCount, totalPieces);
  }

  function parseAndPreviewCSVText(csvText, fileName) {
    const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) {
      showToast('CSV file is empty or missing headers.', 'error');
      return;
    }

    const headers = lines[0].split(',').map(h => h.replace(/^["']|["']$/g, '').trim());
    const rowObjs = lines.slice(1).map(l => {
      const matches = l.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || l.split(',');
      const obj = {};
      headers.forEach((h, i) => {
        obj[h] = matches[i] ? matches[i].replace(/^["']|["']$/g, '').trim() : '';
      });
      return obj;
    });

    processSpreadsheetRows(rowObjs, fileName);
  }

  function renderExcelPreviewUI(items, targetType, validCount, invalidCount, totalPieces) {
    const previewContainer = document.getElementById('excelPreviewSection');
    const tableEl = document.getElementById('excelPreviewTable');
    if (!previewContainer || !tableEl) return;
    previewContainer.style.display = 'block';

    // Summary numbers
    const elTot = document.getElementById('excelSummaryTotal');
    const elVal = document.getElementById('excelSummaryValid');
    const elInv = document.getElementById('excelSummaryInvalid');
    const elPcs = document.getElementById('excelSummaryPieces');
    if (elTot) elTot.textContent = items.length;
    if (elVal) elVal.textContent = validCount;
    if (elInv) elInv.textContent = invalidCount;
    if (elPcs) elPcs.textContent = totalPieces;

    const isLaptop = targetType === 'laptop';

    const rowsHtml = items.map((item, idx) => {
      const code = isLaptop ? `LP #${item.lpNumber}` : item.sku;
      const title = isLaptop ? `${item.brand} ${item.model}` : item.name;
      const specs = isLaptop ? `${item.processor} | ${item.ram} | ${item.storage}` : `${item.type} | ${item.compatibility}`;
      const statusBadge = item.isValid
        ? `<span class="stock-badge-tag stock-in">Valid</span>`
        : `<span class="stock-badge-tag stock-soldout">Invalid Data</span>`;

      return `
        <tr>
          <td>#${idx + 1}</td>
          <td><strong style="font-family: monospace;">${code}</strong></td>
          <td><strong>${title}</strong></td>
          <td>${specs}</td>
          <td><strong>${item.quantity}</strong> pcs</td>
          <td>₹${Number(item.price).toLocaleString('en-IN')}</td>
          <td>${statusBadge}</td>
        </tr>
      `;
    }).join('');

    tableEl.innerHTML = `
      <thead>
        <tr>
          <th>#</th>
          <th>Code / LP</th>
          <th>Name / Model</th>
          <th>Specifications</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    `;

    const summaryEl = document.getElementById('excelImportSummary');
    if (summaryEl) {
      summaryEl.innerHTML = `
        <div style="font-size: 13px; color: #1E293B;">
          <strong>Preview Staged:</strong> ${items.length} rows (${totalPieces} physical pieces) detected. 
          Data is in temporary memory only and has NOT been committed to the database.
        </div>
      `;
    }

    const confirmBtn = document.getElementById('btnConfirmExcelImport');
    if (confirmBtn) {
      confirmBtn.disabled = (invalidCount > 0 && validCount === 0);
      confirmBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        Confirm &amp; Import ${validCount} ${isLaptop ? 'Laptops' : 'Accessories'} to Database
      `;
    }
  }

  function cancelExcelPreview() {
    stagedImportData = null;
    const previewContainer = document.getElementById('excelPreviewSection');
    if (previewContainer) previewContainer.style.display = 'none';
    const fileInfo = document.getElementById('excelFileInfo');
    if (fileInfo) fileInfo.style.display = 'none';
    const fileInput = document.getElementById('excelFileInput');
    if (fileInput) fileInput.value = '';
    showToast('Spreadsheet preview discarded. Database unaffected.', 'info');
  }

  function downloadTemplate(type) {
    const csvContent = window.AdminStateManager.generateTemplateCSV(type);
    const filename = `${type}_inventory_template.csv`;
    triggerFileDownload(csvContent, filename, 'text/csv;charset=utf-8;');
    showToast(`Downloaded ${filename} template!`, 'success');
  }

  function exportInventory(category) {
    const csvContent = window.adminState.exportInventoryCSV(category);
    const filename = `egadget_${category || 'all'}_inventory_${new Date().toISOString().split('T')[0]}.csv`;
    triggerFileDownload(csvContent, filename, 'text/csv;charset=utf-8;');
    showToast(`Exported ${filename} successfully!`, 'success');
  }

  function exportStockCSV() {
    let csv = 'CATEGORY,CODE,NAME,PIECES_AVAILABLE,SOLD_PIECES,UNIT_PRICE,STOCK_STATUS,VISIBILITY\r\n';
    window.adminState.state.laptops.forEach(l => {
      const pres = window.AdminStateManager.getPublicStockPresentation(l.quantity);
      csv += `"Commercial Laptop","LP #${l.lpNumber}","${l.brand} ${l.model}",${l.quantity},${l.soldQuantity || 0},${l.price},"${pres.label}","${l.status}"\r\n`;
    });
    window.adminState.state.accessories.forEach(a => {
      const pres = window.AdminStateManager.getPublicStockPresentation(a.quantity);
      csv += `"Accessory","${a.sku}","${a.name}",${a.quantity},${a.soldQuantity || 0},${a.price},"${pres.label}","${a.status}"\r\n`;
    });
    const filename = `egadget_stock_levels_${new Date().toISOString().split('T')[0]}.csv`;
    triggerFileDownload(csv, filename, 'text/csv;charset=utf-8;');
    showToast(`Exported ${filename} successfully!`, 'success');
  }

  function openAdjustStockModal(category = 'laptop', itemId = '') {
    let target = null;
    let list = category === 'accessories' ? window.adminState.state.accessories : window.adminState.state.laptops;
    if (itemId) {
      target = list.find(x => x.id === itemId || x.lpNumber === itemId || x.sku === itemId);
    } else if (list.length > 0) {
      target = list[0];
    }

    if (!target) {
      showToast('No inventory items available to adjust stock.', 'error');
      return;
    }

    const currentQty = target.quantity;
    const name = target.model ? `${target.brand} ${target.model}` : target.name;
    const newQtyStr = prompt(`Adjust Stock for "${name}"\nCurrent Quantity: ${currentQty} pieces\nEnter new physical showroom stock count:`, currentQty);
    if (newQtyStr === null) return;

    const newQty = parseInt(newQtyStr, 10);
    if (isNaN(newQty) || newQty < 0) {
      showToast('Please enter a valid non-negative number.', 'error');
      return;
    }

    window.adminState.updateStockQuantity(category, target.id, newQty);
    showToast(`Stock for "${name}" updated to ${newQty} pieces!`, 'success');
    renderCurrentView(uiState.currentView);
  }

  function triggerFileDownload(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // ==========================================================================
  // 14. REPORTS & ANALYTICS VIEW (SECTION 15)
  // ==========================================================================
  function renderReportsView() {
    const stats = window.adminState.getStatistics();

    const revTodayEl = document.getElementById('repTodaySales');
    if (revTodayEl) revTodayEl.textContent = `₹${stats.todayRevenue.toLocaleString('en-IN')}`;

    const revYestEl = document.getElementById('repYestSales');
    if (revYestEl) revYestEl.textContent = `₹${stats.yesterdayRevenue.toLocaleString('en-IN')}`;

    const revAllEl = document.getElementById('repAllSales');
    if (revAllEl) revAllEl.textContent = `₹${stats.allTimeRevenue.toLocaleString('en-IN')}`;

    const soldUnitsEl = document.getElementById('repSoldUnits');
    if (soldUnitsEl) soldUnitsEl.textContent = `${stats.totalSoldUnits} pcs`;

    const remUnitsEl = document.getElementById('repRemUnits');
    if (remUnitsEl) remUnitsEl.textContent = `${stats.remainingStock} pcs`;

    const lowStockEl = document.getElementById('repLowStock');
    if (lowStockEl) lowStockEl.textContent = `${stats.lowStockItems} items`;
  }

  // ==========================================================================
  // 15. SETTINGS MODULE & PROFILE SYNCHRONIZATION (SECTION 12 & 13)
  // ==========================================================================
  let currentAvatarBase64 = null;

  function renderSettingsView() {
    initSettingsTabs();
    loadProfileAndSettingsData();
  }

  function initSettingsTabs() {
    const tabs = document.querySelectorAll('.settings-tab-btn');
    tabs.forEach(tab => {
      tab.onclick = () => {
        tabs.forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.settings-tab-pane').forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        const targetTab = tab.getAttribute('data-tab');
        const targetPane = document.getElementById(`pane-${targetTab}`);
        if (targetPane) targetPane.classList.add('active');
      };
    });
  }

  async function loadProfileAndSettingsData() {
    const token = localStorage.getItem('egadget_admin_token');
    const apiBase = (typeof getApiBase === 'function') ? getApiBase() : (window.location.port === '8000' ? '' : 'http://127.0.0.1:8000');

    // 1. Load User Profile
    let user = null;
    try {
      if (token) {
        const res = await fetch(`${apiBase}/api/admin/profile`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            user = json.data;
          }
        }
      }
    } catch (e) {
      console.warn('Failed loading profile via API, fallback to localStorage:', e);
    }

    if (!user) {
      try {
        user = JSON.parse(localStorage.getItem('egadget_admin_user') || '{}');
      } catch (e) {
        user = {};
      }
    }

    if (user) {
      const elFull = document.getElementById('profFullName');
      const elDisp = document.getElementById('profDisplayName');
      const elEmail = document.getElementById('profEmail');
      const elPhone = document.getElementById('profPhone');
      const elDesig = document.getElementById('profDesignation');
      const elBio = document.getElementById('profBio');
      const avatarPreview = document.getElementById('profAvatarPreview');

      if (elFull) elFull.value = user.name || '';
      if (elDisp) elDisp.value = user.display_name || user.name || '';
      if (elEmail) elEmail.value = user.email || '';
      if (elPhone) elPhone.value = user.phone || '';
      if (elDesig) elDesig.value = user.designation || 'Shop Owner / Administrator';
      if (elBio) elBio.value = user.bio || '';

      if (avatarPreview) {
        if (user.avatar) {
          currentAvatarBase64 = user.avatar;
          avatarPreview.innerHTML = `<img src="${user.avatar}" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover;">`;
        } else {
          const name = user.display_name || user.name || 'SK';
          const parts = name.trim().split(' ');
          const initials = (parts.length > 1) ? (parts[0][0] + parts[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
          avatarPreview.textContent = initials;
        }
      }
    }

    // 2. Load Settings (Shop Profile & Social Media)
    try {
      const setRes = await fetch(`${apiBase}/api/public/settings`, {
        headers: { 'Accept': 'application/json' }
      });
      if (setRes.ok) {
        const setJson = await setRes.json();
        if (setJson.success && setJson.data) {
          const s = setJson.data;
          if (document.getElementById('shopName') && s.shop_name) document.getElementById('shopName').value = s.shop_name;
          if (document.getElementById('shopBranch') && s.branch_name) document.getElementById('shopBranch').value = s.branch_name;
          if (document.getElementById('shopEmail') && s.shop_email) document.getElementById('shopEmail').value = s.shop_email;
          if (document.getElementById('shopPhone') && s.shop_phone) document.getElementById('shopPhone').value = s.shop_phone;
          if (document.getElementById('shopWhatsApp') && s.shop_whatsapp) document.getElementById('shopWhatsApp').value = s.shop_whatsapp;
          if (document.getElementById('shopHours') && s.business_hours) document.getElementById('shopHours').value = s.business_hours;
          if (document.getElementById('shopAddress') && s.shop_address) document.getElementById('shopAddress').value = s.shop_address;
          if (document.getElementById('shopCity') && s.shop_city) document.getElementById('shopCity').value = s.shop_city;
          if (document.getElementById('shopState') && s.shop_state) document.getElementById('shopState').value = s.shop_state;

          if (document.getElementById('socInstagram') && s.instagram_url) document.getElementById('socInstagram').value = s.instagram_url;
          if (document.getElementById('socFacebook') && s.facebook_url) document.getElementById('socFacebook').value = s.facebook_url;
          if (document.getElementById('socYouTube') && s.youtube_url) document.getElementById('socYouTube').value = s.youtube_url;
          if (document.getElementById('socLinkedIn') && s.linkedin_url) document.getElementById('socLinkedIn').value = s.linkedin_url;
          if (document.getElementById('socWebsite') && s.website_url) document.getElementById('socWebsite').value = s.website_url;
        }
      }
    } catch (e) {
      console.warn('Failed loading settings:', e);
    }
  }

  function handleAvatarSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WEBP).', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      currentAvatarBase64 = e.target.result;
      const preview = document.getElementById('profAvatarPreview');
      if (preview) {
        preview.innerHTML = `<img src="${currentAvatarBase64}" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover;">`;
      }
      showToast('Avatar preview updated! Click "Save Profile Changes" to persist.', 'info');
    };
    reader.readAsDataURL(file);
  }

  async function handleSaveProfile(event) {
    event.preventDefault();
    const token = localStorage.getItem('egadget_admin_token');
    const apiBase = (typeof getApiBase === 'function') ? getApiBase() : (window.location.port === '8000' ? '' : 'http://127.0.0.1:8000');

    const fullName = (document.getElementById('profFullName')?.value || '').trim();
    const displayName = (document.getElementById('profDisplayName')?.value || '').trim();
    const email = (document.getElementById('profEmail')?.value || '').trim();
    const phone = (document.getElementById('profPhone')?.value || '').trim();
    const designation = (document.getElementById('profDesignation')?.value || '').trim();
    const bio = (document.getElementById('profBio')?.value || '').trim();

    if (!fullName || !email) {
      showToast('Full Name and Email Address are required.', 'error');
      return;
    }

    const payload = {
      name: fullName,
      display_name: displayName || fullName,
      email: email,
      phone: phone,
      designation: designation,
      bio: bio
    };
    if (currentAvatarBase64) {
      payload.avatar = currentAvatarBase64;
    }

    const saveBtn = document.getElementById('btnSaveProfile');
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.innerHTML = 'Saving...';
    }

    try {
      let savedUser = null;
      if (token) {
        const res = await fetch(`${apiBase}/api/admin/profile`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            savedUser = json.data;
          }
        }
      }

      if (!savedUser) {
        let existing = {};
        try { existing = JSON.parse(localStorage.getItem('egadget_admin_user') || '{}'); } catch(e) {}
        savedUser = { ...existing, ...payload };
      }

      localStorage.setItem('egadget_admin_user', JSON.stringify(savedUser));
      syncUserProfileUI(savedUser);
      showToast('Profile updated and synchronized successfully!', 'success');
    } catch (err) {
      console.error('Error saving profile:', err);
      showToast('Failed to save profile: ' + err.message, 'error');
    } finally {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg>
          Save Profile Changes
        `;
      }
    }
  }

  function syncUserProfileUI(user) {
    if (!user) return;
    const name = user.display_name || user.name || 'Administrator';
    const designation = user.designation || 'Shop Owner / Administrator';
    const branch = user.branch || 'Mehnajpur Showroom';

    // 1. Welcome banner
    const welcomeName = document.getElementById('welcomeName');
    if (welcomeName) welcomeName.textContent = name;

    // 2. Sidebar Footer
    const curName = document.getElementById('currentUserName');
    if (curName) curName.textContent = name;

    const curRole = document.getElementById('currentUserRole');
    if (curRole) curRole.textContent = `${designation} • ${branch}`;

    // 3. Topbar Header
    const topName = document.getElementById('topbarUserName');
    if (topName) topName.textContent = name;

    const topRole = document.getElementById('topbarUserRole');
    if (topRole) topRole.textContent = designation;

    // 4. Avatar Initials / Image
    const parts = name.trim().split(' ');
    const initials = (parts.length > 1) ? (parts[0][0] + parts[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();

    const sidebarAvatar = document.getElementById('avatarInitial');
    if (sidebarAvatar) {
      if (user.avatar) {
        sidebarAvatar.innerHTML = `<img src="${user.avatar}" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
      } else {
        sidebarAvatar.textContent = initials;
      }
    }

    const topbarAvatar = document.getElementById('topbarAvatarInitial');
    if (topbarAvatar) {
      if (user.avatar) {
        topbarAvatar.innerHTML = `<img src="${user.avatar}" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
      } else {
        topbarAvatar.textContent = initials;
      }
    }
  }

  async function handleSaveShopProfile(event) {
    event.preventDefault();
    const token = localStorage.getItem('egadget_admin_token');
    const apiBase = (typeof getApiBase === 'function') ? getApiBase() : (window.location.port === '8000' ? '' : 'http://127.0.0.1:8000');

    const payload = {
      shop_name: document.getElementById('shopName')?.value || '',
      branch_name: document.getElementById('shopBranch')?.value || '',
      shop_email: document.getElementById('shopEmail')?.value || '',
      shop_phone: document.getElementById('shopPhone')?.value || '',
      shop_whatsapp: document.getElementById('shopWhatsApp')?.value || '',
      business_hours: document.getElementById('shopHours')?.value || '',
      shop_address: document.getElementById('shopAddress')?.value || '',
      shop_city: document.getElementById('shopCity')?.value || '',
      shop_state: document.getElementById('shopState')?.value || ''
    };

    try {
      if (token) {
        await fetch(`${apiBase}/api/admin/profile`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      showToast('Showroom branch profile saved successfully!', 'success');
    } catch (e) {
      showToast('Saved locally. Backend response: ' + e.message, 'info');
    }
  }

  async function handleSaveSocialMedia(event) {
    event.preventDefault();
    const token = localStorage.getItem('egadget_admin_token');
    const apiBase = (typeof getApiBase === 'function') ? getApiBase() : (window.location.port === '8000' ? '' : 'http://127.0.0.1:8000');

    const payload = {
      instagram_url: document.getElementById('socInstagram')?.value || '',
      facebook_url: document.getElementById('socFacebook')?.value || '',
      youtube_url: document.getElementById('socYouTube')?.value || '',
      linkedin_url: document.getElementById('socLinkedIn')?.value || '',
      website_url: document.getElementById('socWebsite')?.value || ''
    };

    try {
      if (token) {
        await fetch(`${apiBase}/api/admin/profile`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      showToast('Social media links updated successfully!', 'success');
    } catch (e) {
      showToast('Saved locally. Backend response: ' + e.message, 'info');
    }
  }

  async function handleChangePassword(event) {
    event.preventDefault();
    const currentPass = document.getElementById('secCurrentPassword')?.value || '';
    const newPass = document.getElementById('secNewPassword')?.value || '';
    const confirmPass = document.getElementById('secConfirmPassword')?.value || '';
    const msgBox = document.getElementById('securityMsgBox');

    if (newPass !== confirmPass) {
      if (msgBox) {
        msgBox.textContent = 'New passwords do not match. Please re-enter.';
        msgBox.style.background = '#FEF2F2';
        msgBox.style.color = '#DC2626';
        msgBox.style.display = 'block';
      }
      return;
    }

    if (newPass.length < 8) {
      if (msgBox) {
        msgBox.textContent = 'Password must be at least 8 characters long.';
        msgBox.style.background = '#FEF2F2';
        msgBox.style.color = '#DC2626';
        msgBox.style.display = 'block';
      }
      return;
    }

    const token = localStorage.getItem('egadget_admin_token');
    const apiBase = (typeof getApiBase === 'function') ? getApiBase() : (window.location.port === '8000' ? '' : 'http://127.0.0.1:8000');

    try {
      const res = await fetch(`${apiBase}/api/admin/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          current_password: currentPass,
          new_password: newPass,
          new_password_confirmation: confirmPass
        })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        if (msgBox) {
          msgBox.textContent = 'Password updated successfully! Next login will require your new password.';
          msgBox.style.background = '#ECFDF5';
          msgBox.style.color = '#059669';
          msgBox.style.display = 'block';
        }
        document.getElementById('formAccountSecurity')?.reset();
        showToast('Password updated successfully!', 'success');
      } else {
        if (msgBox) {
          msgBox.textContent = json.message || 'Failed to update password. Verify current password.';
          msgBox.style.background = '#FEF2F2';
          msgBox.style.color = '#DC2626';
          msgBox.style.display = 'block';
        }
      }
    } catch (e) {
      showToast('Password update error: ' + e.message, 'error');
    }
  }

  // ==========================================================================
  // 16. MODALS & TOAST NOTIFICATION HELPERS
  // ==========================================================================
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  }

  function showToast(message, type = 'success') {
    let container = document.getElementById('adminToastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'adminToastContainer';
      container.className = 'admin-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `admin-toast toast-${type}`;
    toast.innerHTML = `
      <div style="flex: 1;">${message}</div>
      <button style="background: none; border: none; color: inherit; cursor: pointer; font-size: 16px; opacity: 0.8;" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 4500);
  }

  // ==========================================================================
  // 17. PUBLIC CONTROLLER EXPORTS
  // ==========================================================================
  window.adminController = {
    navigateTo,
    openSoldModal,
    handleConfirmSold,
    downloadTemplate,
    exportInventory,
    exportStockCSV,
    openAdjustStockModal,
    handleSaveCategorySubmit,
    handleSaveProductSubmit,
    showToast,
    closeModal,
    handleSaveProfile,
    handleSaveShopProfile,
    handleSaveSocialMedia,
    handleChangePassword,
    handleAvatarSelect,
    syncUserProfileUI,
    cancelExcelPreview,
    confirmExcelImport() {
      return window.adminController.confirmImport();
    },

    // Status toggle
    toggleStatus(category, id) {
      const newStatus = window.adminState.toggleItemStatus(category, id);
      if (newStatus) {
        showToast(`Item status changed to ${newStatus.toUpperCase()}`, 'success');
        renderCurrentView(uiState.currentView);
      }
    },

    // Delete item
    confirmDeleteItem(category, id) {
      if (confirm(`Are you sure you want to delete this ${category} record?`)) {
        window.adminState.deleteItem(category, id);
        showToast('Item deleted successfully.', 'success');
        renderCurrentView(uiState.currentView);
      }
    },

    // Category actions
    toggleCategoryStatus(catId) {
      const st = window.adminState.toggleCategoryStatus(catId);
      if (st) {
        showToast(`Category status updated to ${st.toUpperCase()}`, 'success');
        renderCategoriesView();
      }
    },

    confirmDeleteCategory(catId) {
      if (confirm('Delete this category?')) {
        window.adminState.deleteCategory(catId);
        showToast('Category deleted successfully.', 'success');
        renderCategoriesView();
      }
    },

    editCategory(catId) {
      showToast(`Category editing modal loaded for #${catId}.`, 'success');
    },

    // View Item Detail Modal
    viewItemDetail(category, id) {
      const list = category === 'laptop' ? window.adminState.state.laptops : window.adminState.state.accessories;
      const item = list.find(x => x.id === id || x.lpNumber === id || x.sku === id);
      if (!item) return;

      const body = document.getElementById('viewDetailModalBody');
      const title = document.getElementById('viewDetailModalTitle');
      if (title) title.textContent = category === 'laptop' ? `${item.brand} ${item.model}` : item.name;

      if (body) {
        body.innerHTML = `
          <div style="display: flex; gap: 20px; flex-wrap: wrap;">
            <img src="${item.image}" alt="${item.model || item.name}" style="width: 140px; height: 110px; object-fit: contain; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px;">
            <div style="flex: 1;">
              <div style="font-size: 18px; font-weight: 800; color: #0F172A; margin-bottom: 4px;">${item.brand} ${item.model || item.name}</div>
              <div style="font-size: 13px; color: #2563EB; font-weight: 700; margin-bottom: 12px;">Showroom Stock: ${item.quantity} piece(s) available</div>
              <div style="font-size: 22px; font-weight: 800; color: #0F172A; margin-bottom: 12px;">₹${Number(item.price).toLocaleString('en-IN')}</div>
              <div style="font-size: 13px; color: #475569; line-height: 1.6;">${item.description || 'Full specifications verified by Mehnajpur branch.'}</div>
            </div>
          </div>
        `;
      }
      openModal('viewDetailModalOverlay');
    },

    // Edit Item Simulation
    editItem(category, id) {
      showToast(`Edit item modal for #${id} opened. Modify fields and click update to simulate.`, 'success');
    },

    // Sale detail modal
    viewSaleDetail(saleId) {
      const sale = window.adminState.state.sales.find(s => s.id === saleId);
      if (!sale) return;

      const body = document.getElementById('viewDetailModalBody');
      const title = document.getElementById('viewDetailModalTitle');
      if (title) title.textContent = `Sale Details #${sale.id}`;

      if (body) {
        body.innerHTML = `
          <div style="padding: 10px;">
            <div style="font-size: 15px; font-weight: 700; color: #0F172A; margin-bottom: 8px;">Product: ${sale.productName}</div>
            <div style="font-size: 13px; color: #64748B; margin-bottom: 14px;">Transaction Date: ${sale.date} • Method: <strong>${sale.paymentMethod}</strong></div>
            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Unit Price:</span>
                <strong>₹${Number(sale.unitPrice).toLocaleString('en-IN')}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Quantity Sold:</span>
                <strong>${sale.quantity} piece(s)</strong>
              </div>
              <div style="display: flex; justify-content: space-between; border-top: 1px solid #CBD5E1; padding-top: 8px; font-size: 16px;">
                <span style="font-weight: 700;">Total Paid:</span>
                <strong style="color: #10B981;">₹${Number(sale.totalAmount).toLocaleString('en-IN')}</strong>
              </div>
            </div>
            <div style="font-size: 13px; color: #475569;">
              <strong>Customer:</strong> ${sale.customerName} (${sale.customerPhone})<br>
              <strong>Notes:</strong> ${sale.notes || 'None'}
            </div>
          </div>
        `;
      }
      openModal('viewDetailModalOverlay');
    },

    // Cancel sale confirmation
    confirmCancelSale(saleId) {
      if (confirm(`Cancel sale #${saleId}? Stock will be automatically restored.`)) {
        window.adminState.cancelSale(saleId);
        showToast(`Sale #${saleId} cancelled and stock restored!`, 'success');
        renderCurrentView(uiState.currentView);
      }
    },

    // Live Bulk Excel / CSV Import (Syncs MySQL and UI State)
    async confirmImport() {
      if (!stagedImportData || !stagedImportData.items || stagedImportData.items.length === 0) {
        showToast('Please select and preview a CSV spreadsheet before confirming.', 'error');
        return;
      }

      const { type, items } = stagedImportData;
      showToast(`Importing ${items.length} ${type === 'laptop' ? 'laptops' : 'accessories'}...`, 'info');

      try {
        let res;
        if (type === 'laptop') {
          res = await window.adminState.importLaptops(items);
        } else {
          res = await window.adminState.importAccessories(items);
        }

        if (res && res.success) {
          showToast(`Successfully imported ${res.count} ${type === 'laptop' ? 'laptops' : 'accessories'} into showroom inventory!`, 'success');

          stagedImportData = null;
          const previewContainer = document.getElementById('excelPreviewSection');
          if (previewContainer) previewContainer.style.display = 'none';
          const fileInfo = document.getElementById('excelFileInfo');
          if (fileInfo) fileInfo.style.display = 'none';
          const fileInput = document.getElementById('excelFileInput');
          if (fileInput) fileInput.value = '';

          navigateTo(type === 'laptop' ? 'laptops' : 'accessories');
          renderCurrentView(type === 'laptop' ? 'laptops' : 'accessories');
        } else {
          showToast('Import failed. Please check spreadsheet format.', 'error');
        }
      } catch (err) {
        showToast('Import error: ' + err.message, 'error');
      }
    },

    confirmSimulateImport(rowCount) {
      this.confirmImport();
    },

    // Reset Local Cache / State
    resetLocalCache() {
      if (confirm('Clear local cached state and restore catalog data from master database records?')) {
        if (typeof window.adminState.resetLocalCache === 'function') {
          window.adminState.resetLocalCache();
        } else if (typeof window.adminState.resetDemoState === 'function') {
          window.adminState.resetDemoState();
        }
        showToast('Local cache cleared and restored to master state.', 'success');
        renderCurrentView(uiState.currentView);
      }
    },

    // Backward-compatibility alias
    resetAllDemoData() {
      this.resetLocalCache();
    },

    // Pagination step
    changePage(type, pageNum) {
      if (type === 'laptop') {
        uiState.laptopPage = pageNum;
        renderLaptopsTable();
      } else {
        uiState.accPage = pageNum;
        renderAccessoriesTable();
      }
    },

    // Reset filters
    resetLaptopFilters() {
      uiState.laptopSearch = '';
      uiState.laptopBrandFilter = 'all';
      uiState.laptopStockFilter = 'all';
      uiState.laptopSort = 'default';
      const searchInput = document.getElementById('laptopSearchInput');
      if (searchInput) searchInput.value = '';
      renderLaptopsTable();
    },

    resetAccFilters() {
      uiState.accSearch = '';
      uiState.accTypeFilter = 'all';
      uiState.accStockFilter = 'all';
      const searchInput = document.getElementById('accSearchInput');
      if (searchInput) searchInput.value = '';
      renderAccessoriesTable();
    }
  };

  // Event Listeners for Filters & Search
  function bindFilterEvents() {
    const lpSearch = document.getElementById('laptopSearchInput');
    if (lpSearch) {
      lpSearch.addEventListener('input', (e) => {
        uiState.laptopSearch = e.target.value.trim();
        uiState.laptopPage = 1;
        renderLaptopsTable();
      });
    }

    const lpBrand = document.getElementById('laptopBrandFilterSelect');
    if (lpBrand) {
      lpBrand.addEventListener('change', (e) => {
        uiState.laptopBrandFilter = e.target.value;
        uiState.laptopPage = 1;
        renderLaptopsTable();
      });
    }

    const lpStock = document.getElementById('laptopStockFilterSelect');
    if (lpStock) {
      lpStock.addEventListener('change', (e) => {
        uiState.laptopStockFilter = e.target.value;
        uiState.laptopPage = 1;
        renderLaptopsTable();
      });
    }

    const lpSort = document.getElementById('laptopSortSelect');
    if (lpSort) {
      lpSort.addEventListener('change', (e) => {
        uiState.laptopSort = e.target.value;
        renderLaptopsTable();
      });
    }

    // Accessories filters
    const accSearch = document.getElementById('accSearchInput');
    if (accSearch) {
      accSearch.addEventListener('input', (e) => {
        uiState.accSearch = e.target.value.trim();
        uiState.accPage = 1;
        renderAccessoriesTable();
      });
    }

    const accType = document.getElementById('accTypeFilterSelect');
    if (accType) {
      accType.addEventListener('change', (e) => {
        uiState.accTypeFilter = e.target.value;
        uiState.accPage = 1;
        renderAccessoriesTable();
      });
    }

    const accStock = document.getElementById('accStockFilterSelect');
    if (accStock) {
      accStock.addEventListener('change', (e) => {
        uiState.accStockFilter = e.target.value;
        uiState.accPage = 1;
        renderAccessoriesTable();
      });
    }

    // Dynamic Add Form Submit
    const dynamicForm = document.getElementById('dynamicItemForm');
    if (dynamicForm) {
      dynamicForm.addEventListener('submit', handleSaveProductSubmit);
    }
  }

  // Document Ready
  document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
    initRouter();
    bindFilterEvents();

    // Auto-sync live MySQL inventory & sales
    if (window.adminState && typeof window.adminState.syncWithBackend === 'function') {
      window.adminState.syncWithBackend().then(() => {
        renderCurrentView(uiState.currentView);
      });
    }
  });

})();
