/**
 * E-Gadget World — Product Details View Handler
 * Mehnajpur Branch, Azamgarh
 * Strictly Public Enquiry-Based (Zero Public Stock Exposure)
 */

document.addEventListener('DOMContentLoaded', () => {
  initProductDetailsPage();
});

window.addEventListener('egadget:inventory-synced', () => {
  initProductDetailsPage();
});

async function initProductDetailsPage() {
  const container = document.getElementById('productDetailContainer');
  if (!container) return;

  // Extract LP Number from Query Param (?lp=3963) or Hash (#3963)
  const urlParams = new URLSearchParams(window.location.search);
  let lpParam = urlParams.get('lp');
  if (!lpParam && window.location.hash) {
    lpParam = window.location.hash.replace('#', '').trim();
  }

  if (!lpParam) {
    renderNotFound(container, 'No laptop selected. Please choose a laptop from our catalog.');
    return;
  }

  let laptop = typeof LaptopService !== 'undefined' ? LaptopService.getById(lpParam) : null;

  if (!laptop) {
    // Show loading state while querying live Laravel API
    container.innerHTML = `
      <div style="padding: 60px 20px; text-align: center;">
        <div style="width: 36px; height: 36px; border: 3px solid #E2E8F0; border-top-color: #2563EB; border-radius: 50%; margin: 0 auto 16px; animation: spin 0.8s linear infinite;"></div>
        <p style="font-size: 14px; color: #64748B; font-weight: 600;">Loading laptop specifications...</p>
      </div>
    `;

    const apiBase = (typeof LaptopService !== 'undefined' && LaptopService.getApiBase) ? LaptopService.getApiBase() : '';
    try {
      const res = await fetch(`${apiBase}/api/public/laptops/${encodeURIComponent(lpParam)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const dbItem = json.data;
          laptop = {
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
            warrantyMonths: 12,
            warrantyDisplay: '6-12 Months Store Warranty',
            images: dbItem.pic ? [dbItem.pic] : ['assets/images/placeholders/laptop-placeholder.svg'],
            featured: Boolean(dbItem.featured),
            badge: dbItem.badge || '',
            description: dbItem.desc || `${dbItem.brand} ${dbItem.model} commercial laptop with ${dbItem.processor}, ${dbItem.ram} RAM and ${dbItem.storage}. Tested in Mehnajpur showroom.`
          };
        }
      }
    } catch (e) {
      console.warn('Direct laptop detail fetch warning:', e);
    }
  }

  if (!laptop) {
    renderNotFound(container, `Laptop with LP #${lpParam} was not found in our Mehnajpur catalog.`);
    return;
  }

  renderProductDetails(container, laptop);
  renderRelatedLaptops(laptop);
}

function renderNotFound(container, message) {
  container.innerHTML = `
    <div class="catalog-empty-state" style="margin: 40px 0; padding: 48px 24px; text-align: center; background: #FFFFFF; border-radius: 12px; border: 1px solid #E2E8F0;">
      <div class="catalog-empty-icon" style="margin-bottom: 16px;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2" style="margin: 0 auto; display: block;">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h2 class="catalog-empty-title" style="font-size: 20px; font-weight: 800; color: #0F172A; margin-bottom: 8px;">Product Not Found</h2>
      <p class="catalog-empty-desc" style="font-size: 14px; color: #64748B; max-width: 480px; margin: 0 auto 20px;">${message}</p>
      <a href="laptops.html" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; font-weight: 700; border-radius: 8px;">Browse Commercial Laptops</a>
    </div>
  `;
}

function renderProductDetails(container, laptop) {
  // Update document title for SEO
  document.title = `${laptop.brand} ${laptop.model} (LP #${laptop.lpNumber}) | E-Gadget World Mehnajpur`;

  const formattedPrice = LaptopService.formatINR(laptop.price);
  const warrantyLabel = LaptopService.getWarrantyLabel(laptop);
  const waEnquiryUrl = LaptopService.generateWhatsAppEnquiryUrl(laptop);
  const stock = LaptopService.getStockStatus ? LaptopService.getStockStatus(laptop.quantity) : { label: 'In Stock', badgeClass: 'badge-stock-in' };
  const mainImg = (laptop.images && laptop.images.length > 0 && laptop.images[0])
    ? laptop.images[0]
    : ImageFallbackHelper.getLaptopFallback();

  container.innerHTML = `
    <!-- Breadcrumb -->
    <nav class="breadcrumb" style="margin-bottom: 24px; font-size: 0.9375rem; color: var(--text-muted);">
      <a href="index.html">Home</a> &gt; 
      <a href="laptops.html">Laptops</a> &gt; 
      <span style="color: var(--text-primary); font-weight: 600;">${laptop.brand} ${laptop.model} (LP #${laptop.lpNumber})</span>
    </nav>

    <div class="product-detail-layout">
      <!-- Left Column: Gallery & Visuals -->
      <div class="detail-gallery-box">
        <div style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
          <span class="laptop-badge-lp">LP #${laptop.lpNumber}</span>
          <span class="badge badge-brand">Commercial Grade</span>
        </div>

        <img src="${mainImg}" alt="${laptop.brand} ${laptop.model}" class="detail-main-img" id="detailMainImage" onerror="if (typeof ImageFallbackHelper !== 'undefined') ImageFallbackHelper.handleLaptopImgError(this);">
        
        <p style="margin-top: 20px; font-size: 0.875rem; color: var(--text-muted); text-align: center;">
          Refurbished &amp; Multi-Point Inspected Unit • Mehnajpur Showroom
        </p>
      </div>

      <!-- Right Column: Specs & Purchasing Action -->
      <div class="detail-info-box">
        <div class="detail-badge-row">
          <span class="badge badge-brand">${laptop.brand}</span>
          ${laptop.badge ? `<span class="laptop-badge-custom">${laptop.badge}</span>` : ''}
          <span class="stock-pill ${stock.badgeClass}">${stock.label}</span>
          <span class="badge" style="background-color: #ECFDF5; color: #047857; border: 1px solid #A7F3D0;">100% Verified</span>
        </div>

        <h1 class="detail-title">${laptop.brand} ${laptop.model}</h1>
        
        <p style="color: var(--text-secondary); font-size: 1.0625rem; line-height: 1.6; margin-bottom: 24px;">
          ${laptop.description}
        </p>

        <!-- Pricing Card -->
        <div class="detail-price-box">
          <div>
            <div style="font-size: 0.8125rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Actual Store Price</div>
            <div class="detail-price-big">${formattedPrice}</div>
            <div style="font-size: 0.8125rem; color: var(--text-muted);">Taxes Included • No Hidden Fees</div>
          </div>
          <div>
            <div class="badge badge-brand" style="font-size: 0.875rem; padding: 8px 16px;">
              Ready for Showroom Demo
            </div>
          </div>
        </div>

        <!-- Warranty Callout -->
        <div class="detail-warranty-card">
          <div class="detail-warranty-title">Store Warranty Policy</div>
          <div class="detail-warranty-text">
            <strong>${warrantyLabel}</strong>. E-Gadget World offers warranty options ranging from 6 months to 1 year on laptops. Contact store staff at Mehnajpur branch for exact warranty terms and extension options for this model.
          </div>
        </div>

        <!-- Actions -->
        <div class="detail-cta-box">
          <a href="${waEnquiryUrl}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-lg btn-full" title="Enquire on WhatsApp">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z"/>
            </svg>
            Enquire on WhatsApp
          </a>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px;">
            <a href="tel:+919984359860" class="btn btn-outline">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              Call Store
            </a>
            <button class="btn btn-outline" onclick="CompareService?.toggleCompare('${laptop.lpNumber}', true); CompareService?.openModal();">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
              Compare
            </button>
          </div>
        </div>

        <!-- Specifications Table -->
        <div class="specs-table-wrap">
          <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 16px;">Verified Technical Specifications</h3>
          <table class="specs-table">
            <tbody>
              <tr>
                <th>LP Number</th>
                <td><span class="laptop-badge-lp">#${laptop.lpNumber}</span></td>
              </tr>
              <tr>
                <th>Brand</th>
                <td>${laptop.brand}</td>
              </tr>
              <tr>
                <th>Model</th>
                <td>${laptop.model}</td>
              </tr>
              <tr>
                <th>Processor</th>
                <td>${laptop.processor}</td>
              </tr>
              <tr>
                <th>Generation</th>
                <td>${laptop.generation}</td>
              </tr>
              <tr>
                <th>RAM</th>
                <td>${laptop.ram}</td>
              </tr>
              <tr>
                <th>Storage</th>
                <td>${laptop.storage}</td>
              </tr>
              <tr>
                <th>Condition</th>
                <td>${laptop.condition}</td>
              </tr>
              <tr>
                <th>Warranty</th>
                <td>${warrantyLabel}</td>
              </tr>
              <tr>
                <th>Store Location</th>
                <td>Mehnajpur Branch, Near Mehnajpur Thana, Azamgarh</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderRelatedLaptops(currentLaptop) {
  const relatedContainer = document.getElementById('relatedLaptopsGrid');
  if (!relatedContainer) return;

  const allLaptops = (typeof LaptopService !== 'undefined') ? LaptopService.getAll() : [];
  let related = allLaptops.filter(l => l.lpNumber !== currentLaptop.lpNumber && l.brand === currentLaptop.brand);
  if (related.length < 3) {
    const additional = allLaptops.filter(l => l.lpNumber !== currentLaptop.lpNumber && !related.includes(l));
    related = [...related, ...additional];
  }

  related = related.slice(0, 3);
  if (related.length === 0) {
    relatedContainer.innerHTML = `<p style="color: #64748B; font-size: 14px; grid-column: 1 / -1; text-align: center;">More models arriving soon in showroom.</p>`;
    return;
  }
  relatedContainer.innerHTML = related.map(laptop => LaptopService.createCardHtml(laptop, { showCompare: false })).join('');
}
