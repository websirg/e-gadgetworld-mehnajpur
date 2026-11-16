/**
 * E-Gadget World — Global Client JavaScript
 * Mehnajpur Branch, Azamgarh
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initHeaderSearch();
  initMobileNav();
  initDynamicYear();
  initContactLinks();
  initRepairModal();
  initImageFallbacks();
  initCompareHeaderBadge();
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

  // Close drawer if window resized to desktop viewport (> 992px)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 992 && mobileDrawer.classList.contains('is-open')) {
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
    el.textContent = BUSINESS_CONFIG.address.full;
  });

  document.querySelectorAll('.conf-hours').forEach(el => {
    el.textContent = BUSINESS_CONFIG.hours;
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
