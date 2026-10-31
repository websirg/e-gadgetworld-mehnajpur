/**
 * E-Gadget World — Product Details View Handler
 * Mehnajpur Branch, Azamgarh
 */

document.addEventListener('DOMContentLoaded', () => {
  initProductDetailsPage();
});

function initProductDetailsPage() {
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

  const laptop = LaptopService.getById(lpParam);
  if (!laptop) {
    renderNotFound(container, `Laptop with LP #${lpParam} was not found in our current Mehnajpur inventory.`);
    return;
  }

  renderProductDetails(container, laptop);
  renderRelatedLaptops(laptop);
}

function renderNotFound(container, message) {
  container.innerHTML = `
    <div class="catalog-empty-state" style="margin: 40px 0;">
      <div class="catalog-empty-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h2 class="catalog-empty-title">Product Not Found</h2>
      <p class="catalog-empty-desc">${message}</p>
      <a href="laptops.html" class="btn btn-primary">Browse All 24 Available Laptops</a>
    </div>
  `;
}

function renderProductDetails(container, laptop) {
  // Update document title for SEO
  document.title = `${laptop.brand} ${laptop.model} (LP #${laptop.lpNumber}) | E-Gadget World Mehnajpur`;

  const stock = LaptopService.getStockStatus(laptop.quantity);
  const formattedPrice = LaptopService.formatINR(laptop.price);
  const warrantyLabel = LaptopService.getWarrantyLabel(laptop);
  const waBuyUrl = LaptopService.generateWhatsAppBuyUrl(laptop);
  const mainImg = (laptop.images && laptop.images.length > 0) ? laptop.images[0] : 'assets/images/laptops/dell-latitude.svg';

  // Buy on WhatsApp CTA logic
  let buyButtonHtml = '';
  if (stock.canBuy) {
    buyButtonHtml = `
      <a href="${waBuyUrl}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-lg btn-full" title="Buy via WhatsApp">
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z"/>
        </svg>
        Buy on WhatsApp
      </a>
    `;
  } else {
    buyButtonHtml = `
      <button class="btn btn-disabled btn-lg btn-full" disabled>
        Currently Unavailable (Out of Stock)
      </button>
    `;
  }

  container.innerHTML = `
    <!-- Breadcrumb -->
    <nav class="breadcrumb" style="margin-bottom: 24px; font-size: 0.875rem; color: var(--text-muted);">
      <a href="index.html">Home</a> &gt; 
      <a href="laptops.html">Laptops</a> &gt; 
      <span style="color: var(--text-primary); font-weight: 600;">${laptop.brand} ${laptop.model} (LP #${laptop.lpNumber})</span>
    </nav>

    <div class="product-detail-layout">
      <!-- Left Column: Gallery & Visuals -->
      <div class="detail-gallery-box">
        <div style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
          <span class="laptop-badge-lp">LP #${laptop.lpNumber}</span>
          <span class="badge ${stock.badgeClass}">${stock.label}</span>
        </div>

        <img src="${mainImg}" alt="${laptop.brand} ${laptop.model}" class="detail-main-img" id="detailMainImage">
        
        <p style="margin-top: 20px; font-size: 0.8125rem; color: var(--text-muted);">
          Refurbished &amp; Multi-Point Inspected Unit at Mehnajpur Branch
        </p>
      </div>

      <!-- Right Column: Specs & Purchasing Action -->
      <div class="detail-info-box">
        <div class="detail-badge-row">
          <span class="badge badge-brand">${laptop.brand}</span>
          ${laptop.badge ? `<span class="laptop-badge-custom">${laptop.badge}</span>` : ''}
          <span class="badge ${stock.badgeClass}">${stock.qtyLabel}</span>
        </div>

        <h1 class="detail-title">${laptop.brand} ${laptop.model}</h1>
        
        <p style="color: var(--text-secondary); font-size: 1rem; line-height: 1.6; margin-bottom: 24px;">
          ${laptop.description}
        </p>

        <!-- Pricing Card -->
        <div class="detail-price-box">
          <div>
            <div style="font-size: 0.8125rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Actual Store Price</div>
            <div class="detail-price-big">${formattedPrice}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Taxes Included • No Hidden Fees</div>
          </div>
          <div>
            <div class="badge ${stock.badgeClass}" style="font-size: 0.875rem; padding: 6px 14px;">
              ${stock.label} (${laptop.quantity} in stock)
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

        ${laptop.reviewFlag ? `
          <div class="laptop-review-flag" style="margin-bottom: 24px; padding: 10px 14px; font-size: 0.84375rem;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18" style="flex-shrink: 0;">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <div>
              <strong>Physical Verification Flag:</strong> ${laptop.reviewFlag}.
            </div>
          </div>
        ` : ''}

        <!-- Actions -->
        <div class="detail-cta-box">
          ${buyButtonHtml}
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
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
                <th>Current Stock</th>
                <td>${laptop.quantity} pieces available</td>
              </tr>
              <tr>
                <th>Condition</th>
                <td>${laptop.condition}</td>
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

  const allLaptops = LaptopService.getAll();
  // Filter other laptops from same brand or similar price range
  let related = allLaptops.filter(l => l.lpNumber !== currentLaptop.lpNumber && l.brand === currentLaptop.brand);
  if (related.length < 3) {
    const additional = allLaptops.filter(l => l.lpNumber !== currentLaptop.lpNumber && !related.includes(l));
    related = [...related, ...additional];
  }

  related = related.slice(0, 3);
  relatedContainer.innerHTML = related.map(laptop => LaptopService.createCardHtml(laptop, { showCompare: false })).join('');
}
