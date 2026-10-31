/**
 * E-Gadget World — Global Client JavaScript
 * Mehnajpur Branch, Azamgarh
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initDynamicYear();
  initContactLinks();
  initRepairModal();
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
 * Mobile Navigation Drawer & Hamburger
 */
function initMobileNav() {
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  if (!hamburgerBtn || !mobileDrawer) return;

  // Create backdrop if not existing
  let backdrop = document.querySelector('.mobile-nav-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'mobile-nav-backdrop';
    document.body.appendChild(backdrop);
  }

  const toggleNav = (forceState) => {
    const shouldOpen = typeof forceState === 'boolean' ? forceState : !hamburgerBtn.classList.contains('is-active');
    hamburgerBtn.classList.toggle('is-active', shouldOpen);
    mobileDrawer.classList.toggle('is-open', shouldOpen);
    backdrop.classList.toggle('is-active', shouldOpen);
    document.body.style.overflow = shouldOpen ? 'hidden' : '';
  };

  hamburgerBtn.addEventListener('click', () => toggleNav());
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
