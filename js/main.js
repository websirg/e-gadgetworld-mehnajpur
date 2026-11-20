/**
 * E-Gadget World — Global Client JavaScript
 * Mehnajpur Branch, Azamgarh
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initHeaderSearch();
  initNavDropdowns();
  initMobileNav();
  initDynamicYear();
  initContactLinks();
  initRepairModal();
  initImageFallbacks();
  initCompareHeaderBadge();
  initAdminHeaderButton();
});

/**
 * Sticky Header elevation shadow on scroll
 */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Header Live Search with Auto-Suggest Dropdown
 */
function initHeaderSearch() {
  const searchInput = document.getElementById('headerSearchInput');
  const dropdown = document.getElementById('headerSearchDropdown');
  const clearBtn = document.getElementById('headerSearchClear');
  const form = document.getElementById('headerSearchForm');

  if (!searchInput || !dropdown) return;

  let debounceTimer = null;

  const performSearch = () => {
    const query = searchInput.value.trim().toLowerCase();

    if (clearBtn) {
      clearBtn.style.display = query ? 'block' : 'none';
    }

    if (query.length < 2) {
      dropdown.style.display = 'none';
      dropdown.innerHTML = '';
      return;
    }

    if (typeof PRODUCT_INVENTORY === 'undefined' || !Array.isArray(PRODUCT_INVENTORY)) {
      dropdown.style.display = 'none';
      return;
    }

    const matches = PRODUCT_INVENTORY.filter(laptop => {
      const matchLp = laptop.lpNumber && laptop.lpNumber.toLowerCase().includes(query);
      const matchBrand = laptop.brand && laptop.brand.toLowerCase().includes(query);
      const matchModel = laptop.model && laptop.model.toLowerCase().includes(query);
      const matchProc = laptop.processor && laptop.processor.toLowerCase().includes(query);
      return matchLp || matchBrand || matchModel || matchProc;
    });

    if (matches.length === 0) {
      dropdown.innerHTML = `
        <div class="search-dropdown-empty">
          No laptops matched "<strong>${escapeHtml(query)}</strong>".
          <div style="margin-top: 6px;">
            <a href="laptops.html?search=${encodeURIComponent(query)}" style="color: var(--color-primary); font-weight: 700; text-decoration: underline;">Search Full Catalog</a>
          </div>
        </div>
      `;
      dropdown.style.display = 'block';
      return;
    }

    const topMatches = matches.slice(0, 5);
    const html = topMatches.map(laptop => {
      const formattedPrice = typeof LaptopService !== 'undefined'
        ? LaptopService.formatINR(laptop.price)
        : `₹${Number(laptop.price).toLocaleString('en-IN')}`;
      const img = (laptop.images && laptop.images.length > 0 && laptop.images[0])
        ? laptop.images[0]
        : 'assets/images/placeholders/laptop-placeholder.svg';
      const detailUrl = `laptop-details.html?lp=${laptop.lpNumber}`;

      return `
        <a href="${detailUrl}" class="search-dropdown-item">
          <img src="${img}" alt="${escapeHtml(laptop.brand)} ${escapeHtml(laptop.model)}" class="search-item-img" onerror="if (typeof ImageFallbackHelper !== 'undefined') ImageFallbackHelper.handleLaptopImgError(this);">
          <div class="search-item-info">
            <div class="search-item-title">${escapeHtml(laptop.brand)} ${escapeHtml(laptop.model)}</div>
            <div class="search-item-spec">${escapeHtml(laptop.processor)} • ${escapeHtml(laptop.ram)} RAM</div>
          </div>
          <div class="search-item-price">${formattedPrice}</div>
        </a>
      `;
    }).join('');

    const footer = `
      <div class="search-dropdown-footer">
        <a href="laptops.html?search=${encodeURIComponent(query)}">
          View all ${matches.length} matching models in catalog &rarr;
        </a>
      </div>
    `;

    dropdown.innerHTML = html + footer;
    dropdown.style.display = 'block';
  };

  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(performSearch, 150);
  });

  searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim().length >= 2) {
      performSearch();
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearBtn.style.display = 'none';
      dropdown.style.display = 'none';
      dropdown.innerHTML = '';
      searchInput.focus();
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.header-search-container')) {
      dropdown.style.display = 'none';
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdown.style.display = 'none';
    }
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Desktop Header Navigation Dropdowns (Click, Touch, Outside-Click, Escape)
 */
function initNavDropdowns() {
  const dropdowns = document.querySelectorAll('.nav-has-dropdown');
  if (!dropdowns.length) return;

  dropdowns.forEach(dropdown => {
    const toggleBtn = dropdown.querySelector('.nav-dropdown-toggle');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = dropdown.classList.contains('is-open');

      // Close all other dropdowns
      dropdowns.forEach(d => {
        if (d !== dropdown) {
          d.classList.remove('is-open');
          const b = d.querySelector('.nav-dropdown-toggle');
          if (b) b.setAttribute('aria-expanded', 'false');
        }
      });

      if (isOpen) {
        dropdown.classList.remove('is-open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      } else {
        dropdown.classList.add('is-open');
        toggleBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Close when clicking outside of any dropdown
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-has-dropdown')) {
      dropdowns.forEach(d => {
        d.classList.remove('is-open');
        const b = d.querySelector('.nav-dropdown-toggle');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdowns.forEach(d => {
        d.classList.remove('is-open');
        const b = d.querySelector('.nav-dropdown-toggle');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
    }
  });
}

/**
 * Mobile Navigation Drawer & Hamburger
 */
function initMobileNav() {
  const hamburgerBtn = document.getElementById('hamburgerBtn') || document.querySelector('.hamburger-btn');
  const mobileDrawer = document.getElementById('mobileNavDrawer') || document.querySelector('.mobile-nav-drawer');
  const closeBtn = document.getElementById('mobileDrawerClose');
  if (!mobileDrawer) return;

  // Create backdrop if not existing
  let backdrop = document.querySelector('.mobile-nav-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'mobile-nav-backdrop';
    document.body.appendChild(backdrop);
  }

  const toggleNav = (forceState) => {
    const isCurrentlyOpen = mobileDrawer.classList.contains('is-open');
    const shouldOpen = typeof forceState === 'boolean' ? forceState : !isCurrentlyOpen;
    
    if (hamburgerBtn) {
      hamburgerBtn.classList.toggle('is-active', shouldOpen);
      hamburgerBtn.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    }
    mobileDrawer.classList.toggle('is-open', shouldOpen);
    backdrop.classList.toggle('is-active', shouldOpen);
    document.body.style.overflow = shouldOpen ? 'hidden' : '';
  };

  // Close drawer if window resized to desktop viewport (> 1024px)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024 && mobileDrawer.classList.contains('is-open')) {
      toggleNav(false);
    }
  });

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => toggleNav());
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => toggleNav(false));
  }

  backdrop.addEventListener('click', () => toggleNav(false));

  // Mobile Accordion Toggle for Laptop / Accessories
  const accordionBtn = document.getElementById('mobileLaptopAccBtn') || mobileDrawer.querySelector('.mobile-accordion-btn');
  const accordionContent = document.getElementById('mobileLaptopAccContent') || mobileDrawer.querySelector('.mobile-accordion-content');
  if (accordionBtn && accordionContent) {
    accordionBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isExpanded = accordionBtn.getAttribute('aria-expanded') === 'true';
      accordionBtn.classList.toggle('is-open', !isExpanded);
      accordionBtn.setAttribute('aria-expanded', !isExpanded ? 'true' : 'false');
      accordionContent.classList.toggle('is-open', !isExpanded);
    });
  }

  // Close when clicking nav link
  const navLinks = mobileDrawer.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => toggleNav(false));
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
      toggleNav(false);
    }
  });
}

/**
 * Header Compare Badge Count Synchronizer
 */
function initCompareHeaderBadge() {
  window.updateHeaderCompareBadge = function() {
    const badge = document.getElementById('headerCompareCount');
    if (!badge) return;

    let count = 0;
    try {
      const stored = sessionStorage.getItem('egadget_compare_lps');
      if (stored) {
        const list = JSON.parse(stored);
        if (Array.isArray(list)) count = list.length;
      }
    } catch (e) {
      count = 0;
    }

    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-flex' : 'none';
  };

  window.updateHeaderCompareBadge();
}

/**
 * Current Year for Footer
 */
function initDynamicYear() {
  const yearEls = document.querySelectorAll('.current-year');
  const currentYear = new Date().getFullYear();
  yearEls.forEach(el => {
    el.textContent = currentYear;
  });
}

/**
 * Ensure all WhatsApp links and direct calls use central config
 */
function initContactLinks() {
  if (typeof BUSINESS_CONFIG === 'undefined') return;

  // Contact number elements
  document.querySelectorAll('.conf-phone').forEach(el => {
    el.textContent = BUSINESS_CONFIG.phone;
  });

  document.querySelectorAll('.conf-phone-link').forEach(el => {
    el.href = `tel:${BUSINESS_CONFIG.phoneRaw}`;
  });

  document.querySelectorAll('.conf-whatsapp-link').forEach(el => {
    if (typeof LaptopService !== 'undefined') {
      el.href = LaptopService.generateWhatsAppInquiryUrl('general');
    } else {
      el.href = `https://wa.me/${BUSINESS_CONFIG.whatsappNumber}`;
    }
  });

  document.querySelectorAll('.conf-maps-link').forEach(el => {
    el.href = BUSINESS_CONFIG.googleMapsUrl;
  });

  document.querySelectorAll('.conf-address').forEach(el => {
    if (el.closest('.top-bar')) {
      el.textContent = "Near Mehnajpur Thana, Azamgarh 276203";
    } else {
      el.textContent = BUSINESS_CONFIG.address.full;
    }
  });

  document.querySelectorAll('.conf-hours').forEach(el => {
    if (el.closest('.top-bar')) {
      el.textContent = "8:00 AM – 9:00 PM Daily";
    } else {
      el.textContent = BUSINESS_CONFIG.hours;
    }
  });
}

/**
 * Global Repair Enquiry Modal Handler
 */
function initRepairModal() {
  const triggerBtns = document.querySelectorAll('[data-open-repair-modal]');
  const modal = document.getElementById('repairModal');
  if (!modal) return;

  const closeBtn = modal.querySelector('.modal-close-btn');
  const form = document.getElementById('quickRepairForm');

  const openModal = () => {
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  triggerBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  }));

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('repairCustomerName')?.value || '';
      const phone = document.getElementById('repairCustomerPhone')?.value || '';
      const model = document.getElementById('repairLaptopModel')?.value || '';
      const problem = document.getElementById('repairProblemDesc')?.value || '';

      const waUrl = LaptopService.generateWhatsAppInquiryUrl('repair', {
        name,
        phone,
        laptopModel: model,
        problem
      });

      window.open(waUrl, '_blank');
      closeModal();
      form.reset();
    });
  }
}

/**
 * Universal Image Fallback Watchdog
 * Ensures zero broken/blank product image areas across the entire website.
 */
function initImageFallbacks() {
  document.querySelectorAll('img').forEach(img => {
    // If not already explicitly handled, attach fallback safety
    if (!img.getAttribute('onerror') && typeof ImageFallbackHelper !== 'undefined') {
      const isLaptop = img.classList.contains('laptop-card-img') || 
                       img.classList.contains('detail-main-img') || 
                       (img.alt && img.alt.toLowerCase().includes('laptop'));
      
      const isAccessory = img.classList.contains('accessory-img') ||
                          (img.alt && (img.alt.toLowerCase().includes('charger') || 
                                       img.alt.toLowerCase().includes('ssd') || 
                                       img.alt.toLowerCase().includes('ram') || 
                                       img.alt.toLowerCase().includes('accessories')));

      if (isLaptop) {
        img.addEventListener('error', function() {
          ImageFallbackHelper.handleLaptopImgError(this);
        });
      } else if (isAccessory) {
        img.addEventListener('error', function() {
          ImageFallbackHelper.handleAccessoryImgError(this, img.alt);
        });
      }
    }
  });
}

/**
 * Header Admin Login / Dashboard Button Management
 * Automatically checks authentication status and updates button label/link
 */
function initAdminHeaderButton() {
  const token = localStorage.getItem('egadget_admin_token');
  const userStr = localStorage.getItem('egadget_admin_user');
  let user = null;
  try {
    if (userStr) user = JSON.parse(userStr);
  } catch (e) {
    user = null;
  }

  const isAuthenticated = Boolean(token);

  // Auto-inject header button into .header-actions if not present in static markup
  let headerBtn = document.getElementById('headerAdminBtn');
  const headerActions = document.querySelector('.header-actions');
  if (!headerBtn && headerActions) {
    headerBtn = document.createElement('a');
    headerBtn.id = 'headerAdminBtn';
    headerBtn.className = 'header-action-btn btn-header-admin';
    headerBtn.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
      <span class="action-btn-text admin-btn-text">Admin</span>
    `;
    const hamburgerBtn = headerActions.querySelector('.hamburger-btn');
    if (hamburgerBtn) {
      headerActions.insertBefore(headerBtn, hamburgerBtn);
    } else {
      headerActions.appendChild(headerBtn);
    }
  }

  // Auto-inject drawer button into mobile drawer if not present
  let drawerBtn = document.getElementById('drawerAdminBtn');
  const drawer = document.getElementById('mobileNavDrawer');
  const drawerFooter = document.querySelector('.mobile-drawer-footer');
  if (!drawerBtn && drawer && drawerFooter) {
    const adminWrap = document.createElement('div');
    adminWrap.className = 'mobile-drawer-admin';
    adminWrap.innerHTML = `
      <a href="admin/login.html" class="mobile-drawer-admin-btn" id="drawerAdminBtn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        <span class="drawer-admin-text">Admin Login</span>
      </a>
    `;
    drawer.insertBefore(adminWrap, drawerFooter);
    drawerBtn = adminWrap.querySelector('#drawerAdminBtn');
  }

  // Update Top Bar button if present
  const topBarBtn = document.getElementById('topBarAdminBtn');
  if (topBarBtn) {
    if (isAuthenticated) {
      topBarBtn.href = 'admin/dashboard.html';
      topBarBtn.classList.add('is-authenticated');
      topBarBtn.title = `Admin Console: ${user?.name || 'Staff'}`;
      const label = topBarBtn.querySelector('.admin-btn-label');
      if (label) label.textContent = 'Dashboard';
    } else {
      topBarBtn.href = 'admin/login.html';
      topBarBtn.classList.remove('is-authenticated');
      topBarBtn.title = 'Staff Admin Login';
      const label = topBarBtn.querySelector('.admin-btn-label');
      if (label) label.textContent = 'Admin Login';
    }
  }

  // Update Header Action button
  if (headerBtn) {
    if (isAuthenticated) {
      headerBtn.href = 'admin/dashboard.html';
      headerBtn.classList.add('is-authenticated');
      headerBtn.title = `Admin Dashboard (${user?.name || 'Authorized Staff'})`;
      const text = headerBtn.querySelector('.admin-btn-text');
      if (text) text.textContent = 'Dashboard';
    } else {
      headerBtn.href = 'admin/login.html';
      headerBtn.classList.remove('is-authenticated');
      headerBtn.title = 'Staff Admin Login';
      const text = headerBtn.querySelector('.admin-btn-text');
      if (text) text.textContent = 'Admin Login';
    }
  }

  // Update Mobile Drawer button
  if (drawerBtn) {
    if (isAuthenticated) {
      drawerBtn.href = 'admin/dashboard.html';
      drawerBtn.classList.add('is-authenticated');
      const text = drawerBtn.querySelector('.drawer-admin-text');
      if (text) text.textContent = 'Management Dashboard';
    } else {
      drawerBtn.href = 'admin/login.html';
      drawerBtn.classList.remove('is-authenticated');
      const text = drawerBtn.querySelector('.drawer-admin-text');
      if (text) text.textContent = 'Admin Login';
    }
  }
}
