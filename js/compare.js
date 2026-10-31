/**
 * E-Gadget World — Laptop Comparison Service
 * Allows comparing up to 3 laptops side-by-side
 * Strictly Public Enquiry-Based (Zero Public Stock Exposure)
 */

const CompareService = {
  maxItems: 3,
  selectedLps: [],

  init() {
    this.loadState();
    this.createDockElement();
    this.createModalElement();
    this.syncCardCheckboxes();
    this.renderDock();
  },

  loadState() {
    try {
      const stored = sessionStorage.getItem('egadget_compare_lps');
      if (stored) {
        this.selectedLps = JSON.parse(stored);
      }
    } catch (e) {
      this.selectedLps = [];
    }
  },

  saveState() {
    try {
      sessionStorage.setItem('egadget_compare_lps', JSON.stringify(this.selectedLps));
    } catch (e) {}
  },

  toggleCompare(lpNumber, isChecked) {
    const cleanLp = String(lpNumber).trim();
    if (isChecked) {
      if (this.selectedLps.includes(cleanLp)) return;
      if (this.selectedLps.length >= this.maxItems) {
        alert(`You can compare up to ${this.maxItems} laptops at once. Please remove one first.`);
        this.syncCardCheckboxes();
        return;
      }
      this.selectedLps.push(cleanLp);
    } else {
      this.selectedLps = this.selectedLps.filter(id => id !== cleanLp);
    }

    this.saveState();
    this.syncCardCheckboxes();
    this.renderDock();
  },

  remove(lpNumber) {
    this.toggleCompare(lpNumber, false);
  },

  clearAll() {
    this.selectedLps = [];
    this.saveState();
    this.syncCardCheckboxes();
    this.renderDock();
  },

  syncCardCheckboxes() {
    document.querySelectorAll('[data-compare-lp]').forEach(cb => {
      const lp = cb.getAttribute('data-compare-lp');
      cb.checked = this.selectedLps.includes(lp);
    });
  },

  createDockElement() {
    if (document.getElementById('compareDock')) return;

    const dock = document.createElement('div');
    dock.id = 'compareDock';
    dock.className = 'compare-dock';
    dock.innerHTML = `
      <div class="compare-dock-inner">
        <div style="display: flex; align-items: center; gap: 14px;">
          <strong style="font-size: 0.9375rem;">Compare Laptops (<span id="compareCount">0</span>/3):</strong>
          <div class="compare-items-preview" id="compareItemsPreview"></div>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <button class="btn btn-outline btn-sm" style="color: #FFFFFF; border-color: rgba(255,255,255,0.3);" onclick="CompareService.clearAll()">Clear</button>
          <button class="btn btn-primary btn-sm" onclick="CompareService.openModal()">Compare Now</button>
        </div>
      </div>
    `;
    document.body.appendChild(dock);
  },

  createModalElement() {
    if (document.getElementById('compareModal')) return;

    const modal = document.createElement('div');
    modal.id = 'compareModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title">Laptop Specifications Comparison</h3>
          <button class="modal-close-btn" onclick="CompareService.closeModal()">&times;</button>
        </div>
        <div class="modal-body" id="compareModalBody"></div>
      </div>
    `;
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.closeModal();
    });
    document.body.appendChild(modal);
  },

  renderDock() {
    const dock = document.getElementById('compareDock');
    const preview = document.getElementById('compareItemsPreview');
    const countEl = document.getElementById('compareCount');
    if (!dock || !preview || !countEl) return;

    countEl.textContent = this.selectedLps.length;

    if (this.selectedLps.length > 0) {
      dock.classList.add('is-visible');
      preview.innerHTML = this.selectedLps.map(lp => {
        const laptop = LaptopService.getById(lp);
        const name = laptop ? `${laptop.brand} ${laptop.model}` : `LP #${lp}`;
        return `
          <div class="compare-item-chip">
            <span>${name}</span>
            <span class="compare-item-chip-remove" onclick="CompareService.remove('${lp}')">&times;</span>
          </div>
        `;
      }).join('');
    } else {
      dock.classList.remove('is-visible');
      preview.innerHTML = '';
    }
  },

  openModal() {
    if (this.selectedLps.length === 0) {
      alert('Please select at least 1 laptop to compare.');
      return;
    }

    const modal = document.getElementById('compareModal');
    const body = document.getElementById('compareModalBody');
    if (!modal || !body) return;

    const laptops = this.selectedLps.map(lp => LaptopService.getById(lp)).filter(Boolean);

    body.innerHTML = `
      <div style="overflow-x: auto;">
        <table class="comparison-table">
          <thead>
            <tr>
              <th>Feature</th>
              ${laptops.map(l => `
                <th>
                  <div style="font-size: 0.8125rem; color: var(--color-primary); font-weight: 700;">LP #${l.lpNumber}</div>
                  <div style="font-size: 1.0625rem; font-weight: 800; margin-bottom: 4px;">${l.brand} ${l.model}</div>
                  <div style="font-size: 1.25rem; font-weight: 900; color: var(--text-primary);">${LaptopService.formatINR(l.price)}</div>
                </th>
              `).join('')}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Processor</td>
              ${laptops.map(l => `<td><strong>${l.processor}</strong></td>`).join('')}
            </tr>
            <tr>
              <td>Generation</td>
              ${laptops.map(l => `<td>${l.generation}</td>`).join('')}
            </tr>
            <tr>
              <td>RAM Memory</td>
              ${laptops.map(l => `<td>${l.ram}</td>`).join('')}
            </tr>
            <tr>
              <td>Storage Drive</td>
              ${laptops.map(l => `<td>${l.storage}</td>`).join('')}
            </tr>
            <tr>
              <td>Price</td>
              ${laptops.map(l => `<td><strong style="color: var(--color-primary);">${LaptopService.formatINR(l.price)}</strong></td>`).join('')}
            </tr>
            <tr>
              <td>Store Warranty</td>
              ${laptops.map(l => `<td>${LaptopService.getWarrantyLabel(l)}</td>`).join('')}
            </tr>
            <tr>
              <td>Quality Status</td>
              ${laptops.map(l => `<td><span class="badge" style="background-color: #ECFDF5; color: #047857; border: 1px solid #A7F3D0;">100% Verified</span></td>`).join('')}
            </tr>
            <tr>
              <td>Action</td>
              ${laptops.map(l => {
                const waUrl = LaptopService.generateWhatsAppEnquiryUrl(l);
                return `<td><a href="${waUrl}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-sm">Enquire on WhatsApp</a></td>`;
              }).join('')}
            </tr>
          </tbody>
        </table>
      </div>
    `;

    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  },

  closeModal() {
    const modal = document.getElementById('compareModal');
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  CompareService.init();
});
