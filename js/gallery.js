/**
 * E-Gadget World — Gallery & Lightbox Viewer
 * Mehnajpur Branch, Azamgarh
 */

class ShopGallery {
  constructor() {
    this.photos = (typeof BUSINESS_CONFIG !== 'undefined' && BUSINESS_CONFIG.assets && BUSINESS_CONFIG.assets.shopPhotos)
      ? BUSINESS_CONFIG.assets.shopPhotos
      : [];
    
    this.currentIndex = 0;
    this.filteredPhotos = [...this.photos];
    this.gridEl = document.getElementById('shopGalleryGrid');
    this.lightboxEl = document.getElementById('galleryLightbox');
    this.lightboxImg = document.getElementById('lightboxImg');
    this.lightboxCaption = document.getElementById('lightboxCaption');
    this.lightboxCounter = document.getElementById('lightboxCounter');

    this.init();
  }

  init() {
    this.renderGrid();
    this.bindEvents();
  }

  bindEvents() {
    // Filter buttons
    document.querySelectorAll('[data-gallery-filter]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('[data-gallery-filter]').forEach(b => b.classList.remove('btn-primary'));
        document.querySelectorAll('[data-gallery-filter]').forEach(b => b.classList.add('btn-outline'));
        btn.classList.remove('btn-outline');
        btn.classList.add('btn-primary');

        const cat = btn.getAttribute('data-gallery-filter');
        if (cat === 'all') {
          this.filteredPhotos = [...this.photos];
        } else {
          this.filteredPhotos = this.photos.filter(p => p.category.toLowerCase().replace(/\s+/g, '-') === cat);
        }
        this.renderGrid();
      });
    });

    // Lightbox Controls
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');

    if (closeBtn) closeBtn.addEventListener('click', () => this.closeLightbox());
    if (prevBtn) prevBtn.addEventListener('click', () => this.navigate(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => this.navigate(1));

    if (this.lightboxEl) {
      this.lightboxEl.addEventListener('click', (e) => {
        if (e.target === this.lightboxEl) this.closeLightbox();
      });
    }

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
      if (!this.lightboxEl || !this.lightboxEl.classList.contains('is-active')) return;
      if (e.key === 'Escape') this.closeLightbox();
      if (e.key === 'ArrowLeft') this.navigate(-1);
      if (e.key === 'ArrowRight') this.navigate(1);
    });
  }

  renderGrid() {
    if (!this.gridEl) return;

    if (this.filteredPhotos.length === 0) {
      this.gridEl.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px 0;">No photos in this category.</p>`;
      return;
    }

    this.gridEl.innerHTML = this.filteredPhotos.map((photo, index) => `
      <div class="gallery-card" onclick="window.galleryInstance.openLightbox(${index})">
        <img src="${photo.url}" alt="${photo.title}" class="gallery-card-img" loading="lazy">
        <div class="gallery-card-overlay">
          <span class="gallery-card-tag">${photo.category}</span>
          <h4 class="gallery-card-title">${photo.title}</h4>
        </div>
      </div>
    `).join('');
  }

  openLightbox(index) {
    if (!this.lightboxEl || !this.lightboxImg) return;
    this.currentIndex = index;
    this.updateLightboxContent();
    this.lightboxEl.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    if (!this.lightboxEl) return;
    this.lightboxEl.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  navigate(direction) {
    this.currentIndex = (this.currentIndex + direction + this.filteredPhotos.length) % this.filteredPhotos.length;
    this.updateLightboxContent();
  }

  updateLightboxContent() {
    const photo = this.filteredPhotos[this.currentIndex];
    if (!photo) return;

    this.lightboxImg.src = photo.url;
    this.lightboxImg.alt = photo.title;
    if (this.lightboxCaption) {
      this.lightboxCaption.innerHTML = `<strong>${photo.title}</strong> — ${photo.caption}`;
    }
    if (this.lightboxCounter) {
      this.lightboxCounter.textContent = `${this.currentIndex + 1} / ${this.filteredPhotos.length}`;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('shopGalleryGrid')) {
    window.galleryInstance = new ShopGallery();
  }
});
