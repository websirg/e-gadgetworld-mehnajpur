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
  }

  function renderDashboardQuickTable() {
    const tbody = document.getElementById('dashRecentTableBody');
    if (!tbody) return;

    const laptops = window.adminState.state.laptops.slice(0, 5);
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
              Sold
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
      tbody.innerHTML = `
        <tr>
          <td colspan="11" style="text-align: center; padding: 40px 20px;">
            <div style="font-size: 15px; font-weight: 700; color: #475569; margin-bottom: 6px;">No Laptop Models Found</div>
            <div style="font-size: 13px; color: #94A3B8; margin-bottom: 16px;">Try adjusting your search query or brand filter.</div>
            <button class="btn-admin-secondary" onclick="window.adminController.resetLaptopFilters()">Reset All Filters</button>
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
      tbody.innerHTML = `
        <tr>
          <td colspan="10" style="text-align: center; padding: 40px 20px;">
            <div style="font-size: 15px; font-weight: 700; color: #475569; margin-bottom: 6px;">No Accessories Found</div>
            <div style="font-size: 13px; color: #94A3B8; margin-bottom: 16px;">Try adjusting your search query or accessory type.</div>
            <button class="btn-admin-secondary" onclick="window.adminController.resetAccFilters()">Reset All Filters</button>
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
    if (!tbody) return;

    const laptops = window.adminState.state.laptops.map(l => ({
      category: 'Commercial Laptop',
      catCode: 'laptop',
      id: l.id,
      code: `LP #${l.lpNumber}`,
      name: `${l.brand} ${l.model}`,
      specs: `${l.processor} | ${l.ram} | ${l.storage}`,
      quantity: l.quantity,
      price: l.price,
      status: l.status,
      image: l.image
    }));

    const accessories = window.adminState.state.accessories.map(a => ({
      category: 'Laptop Accessory',
      catCode: 'accessories',
      id: a.id,
      code: a.sku,
      name: a.name,
      specs: `${a.brand} ${a.type} | ${a.compatibility}`,
      quantity: a.quantity,
      price: a.price,
      status: a.status,
      image: a.image
    }));

    const combined = [...laptops, ...accessories];

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

  // ==========================================================================
  // 8. CATEGORY MANAGEMENT VIEW (SECTION 2)
  // ==========================================================================
  function renderCategoriesView() {
    const gridEl = document.getElementById('categoriesGridContainer');
    if (!gridEl) return;

    window.adminState.updateCategoryCounts();
    const categories = window.adminState.state.categories;

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
    const tbody = document.getElementById('salesHistoryTableBody');
    if (!tbody) return;

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

    if (sales.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="11" style="text-align: center; padding: 40px 20px;">
            <div style="font-size: 15px; font-weight: 700; color: #475569; margin-bottom: 6px;">No Sales Records Found</div>
            <div style="font-size: 13px; color: #94A3B8; margin-bottom: 16px;">Click the "Sold" button on any laptop or accessory to record a sale.</div>
            <button class="btn-admin-primary" onclick="window.adminController.navigateTo('laptops')">Go to Laptops Inventory</button>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = sales.map(s => `
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
  }

  // ==========================================================================
  // 12. STOCK MANAGEMENT VIEW (SECTION 6)
  // ==========================================================================
  function renderStockManagementView() {
    const tbody = document.getElementById('stockTableBody');
    if (!tbody) return;

    const stats = window.adminState.getStatistics();
    
    const items = [
      ...window.adminState.state.laptops.map(l => ({
        type: 'Commercial Laptop',
        code: `LP #${l.lpNumber}`,
        name: `${l.brand} ${l.model}`,
        availableQty: l.quantity,
        soldQty: l.soldQuantity || 0,
        unitPrice: l.price
      })),
      ...window.adminState.state.accessories.map(a => ({
        type: 'Accessory',
        code: a.sku,
        name: a.name,
        availableQty: a.quantity,
        soldQty: a.soldQuantity || 0,
        unitPrice: a.price
      }))
    ];

    tbody.innerHTML = items.map(item => {
      const stockPres = window.AdminStateManager.getPublicStockPresentation(item.availableQty);
      return `
        <tr>
          <td><span class="cell-lp-badge">${item.code}</span></td>
          <td><strong>${item.name}</strong></td>
          <td><span class="badge-brand-pill">${item.type}</span></td>
          <td><strong style="font-size: 14px;">${item.availableQty}</strong> pcs</td>
          <td>${item.soldQty} pcs</td>
          <td><span class="stock-badge-tag ${stockPres.badgeClass}">${stockPres.label}</span></td>
          <td style="font-size: 12px; color: #475569;">
            ${item.availableQty > 2 ? 'In Stock (Exact Qty Hidden on Website)' : item.availableQty > 0 ? 'Urgency Warning Displayed' : 'Sold Out / Unavailable'}
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
        <strong>Selected File:</strong> ${file.name} (${(file.size / 1024).toFixed(1)} KB) • Reading file contents...
      `;
      fileInfoBox.style.display = 'block';
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      parseAndPreviewCSV(text, file.name);
    };
    reader.readAsText(file);
  }

  function parseAndPreviewCSV(csvText, fileName) {
    const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) {
      showToast('CSV file is empty or missing headers.', 'error');
      return;
    }

    const headers = lines[0].split(',').map(h => h.replace(/^["']|["']$/g, '').trim());
    const rows = lines.slice(1).map(l => {
      // Basic CSV regex split
      const matches = l.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || l.split(',');
      return matches.map(c => c.replace(/^["']|["']$/g, '').trim());
    });

    const previewContainer = document.getElementById('excelPreviewSection');
    const tableEl = document.getElementById('excelPreviewTable');

    if (!previewContainer || !tableEl) return;
    previewContainer.style.display = 'block';

    const isLaptop = headers.some(h => h.toUpperCase().includes('LP NO') || h.toUpperCase().includes('MODEL'));

    let validCount = 0;
    let warningCount = 0;

    const rowsHtml = rows.map((row, idx) => {
      const code = row[0] || `ROW-${idx + 1}`;
      const name = row[1] || 'Unnamed Product';
      const pic = isLaptop ? (row[8] || '') : (row[10] || '');

      let warning = '';
      if (!pic) {
        warning = 'Missing Image (Default SVG will be used)';
        warningCount++;
      } else {
        validCount++;
      }

      return `
        <tr>
          <td>#${idx + 1}</td>
          <td><strong>${code}</strong></td>
          <td>${name}</td>
          <td>${row[2] || '-'}</td>
          <td>${row[6] || 1} pcs</td>
          <td>${row[7] || '-'}</td>
          <td>
            ${warning ? `<span class="stock-badge-tag stock-low">${warning}</span>` : `<span class="stock-badge-tag stock-in">Valid</span>`}
          </td>
        </tr>
      `;
    }).join('');

    tableEl.innerHTML = `
      <thead>
        <tr>
          <th>#</th>
          <th>Code / LP</th>
          <th>Name / Model</th>
          <th>Specs</th>
          <th>Piece</th>
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
        <div>
          <strong>${rows.length} Total Rows Detected:</strong> ${validCount} fully valid, ${warningCount} with notices.
          <div style="font-size: 12px; color: #1E40AF; margin-top: 2px;">Ready for simulated preview import into local browser session.</div>
        </div>
        <button class="btn-admin-primary" onclick="window.adminController.confirmSimulateImport(${rows.length})">
          Confirm Import (UI Preview Only)
        </button>
      `;
    }
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
  // 15. SETTINGS VIEW
  // ==========================================================================
  function renderSettingsView() {
    // Shows system settings and cache management
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
    showToast,
    closeModal,

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

    // Simulate Excel Import
    confirmSimulateImport(rowCount) {
      showToast(`Import of ${rowCount} items completed!`, 'success');
      navigateTo('laptops');
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
  });

})();
