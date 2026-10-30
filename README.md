# E-Gadget World — Mehnajpur Branch Website

Official production-quality static website for **E-Gadget World**, Mehnajpur, Azamgarh.

- **Shop Owner:** Sunil Kumar Maurya (Sonu)
- **Primary Contact / WhatsApp:** +91 9984359860
- **Alternate Mobile:** +91 7355303639
- **Address:** Near Mehnajpur Thana, Mehnajpur, Azamgarh, Uttar Pradesh – 276203
- **Business Hours:** 8:00 AM – 9:00 PM (Monday to Sunday)

---

## 📁 Project Directory Structure

```text
egadget-world-mehnajpur/
├── index.html                # Homepage with 10 sections
├── laptops.html              # Dedicated catalog with live search & filters
├── laptop-details.html       # Dedicated laptop detail page (?lp=3963)
├── services.html             # Laptop repair, accessories, CSC & banking info
├── about.html                # Store background, owner profile & mission
├── branches.html             # Company branch directory (Delhi, Mehnajpur, etc.)
├── gallery.html              # Interactive photo gallery & lightbox
├── contact.html              # Contact details, map link & WhatsApp forms
├── privacy-policy.html       # Privacy policy
├── terms.html                # Terms and conditions
├── disclaimer.html           # Brand & legal disclaimer
├── sitemap.xml               # SEO XML sitemap
├── robots.txt                # Search crawler configuration
├── css/
│   ├── style.css             # Base design tokens, typography, header & footer
│   ├── components.css        # Cards, badges, modals, comparison table, lightbox
│   └── responsive.css        # Tablet, mobile layout & sticky contact bars
├── js/
│   ├── config.js             # Central business configuration (phones, address, hours)
│   ├── products-data.js      # 24 laptop inventory records & WhatsApp link builder
│   ├── main.js               # Header, mobile menu, repair enquiry modal
│   ├── catalog.js            # Live search, filters, sorting & URL state sync
│   ├── product-details.js    # Dedicated product specs & WhatsApp buy loader
│   ├── compare.js            # 3-laptop side-by-side comparison dock & modal
│   └── gallery.js            # Lightbox modal with next/previous & keyboard navigation
├── data/
│   └── products.json         # Raw JSON dataset of all 24 laptops (38 pieces total)
└── assets/
    └── images/
        ├── logo.svg          # Brand logo (easily replaceable with uploaded logo)
        ├── laptops/          # High-resolution vector laptop graphics
        └── shop/             # Showroom, workbench, and desk photos
```

---

## 💻 24 Laptops Verified Inventory (38 Pieces Total)

All 24 records from the supplied inventory are loaded into `data/products.json` and `js/products-data.js`:

1. **LP #3930:** Lenovo ThinkPad L14 • i5 11th Gen • 8GB • 256GB SSD • 2 Qty • ₹32,000
2. **LP #3440:** Lenovo ThinkPad L14 • i5 11th Gen • 8GB • 256GB SSD • 1 Qty • ₹32,000
3. **LP #3909:** HP EliteBook 840 G3 • i5 6th Gen • 4GB • 256GB SSD • 1 Qty • ₹23,000
4. **LP #3963:** HP EliteBook 840 G5 • i5 8th Gen • 8GB • 256GB SSD • 1 Qty • ₹26,500
5. **LP #3923:** HP EliteBook 840 G4 • i5 7th Gen • 4GB • 256GB SSD • 1 Qty • ₹24,000
6. **LP #1859:** HP 348 G4 • i5 7th Gen • 8GB • 256GB SSD • 1 Qty • ₹21,000
7. **LP #2585:** HP ProBook 440 G1 • i5 4th Gen • 8GB • 256GB SSD • 1 Qty • ₹17,500
8. **LP #4002:** HP EliteBook Folio 9480M • i5 4th Gen • 8GB • 256GB SSD • 4 Qty • ₹18,000
9. **LP #3995:** HP EliteBook 840 G1 Touch • i5 4th Gen • 8GB • 256GB SSD • 2 Qty • ₹19,000
10. **LP #3935:** HP EliteBook 840 G3 • i5 6th Gen • 8GB • 256GB SSD • 1 Qty • ₹23,000
11. **LP #2356:** Dell Latitude E7450 • i5 5th Gen • 8GB • 256GB SSD • 1 Qty • ₹19,500
12. **LP #7426:** Lenovo IdeaPad V130 • i3 7th Gen • 4GB • 256GB SSD • 2 Qty • ₹18,500
13. **LP #7298:** Dell Vostro 3490 • i5 10th Gen • 8GB • 256GB SSD • 5 Qty • ₹26,500
14. **LP #7067:** Dell Inspiron N4110 • i3 2nd Gen • 6GB • 320GB HDD • 1 Qty • ₹11,000
15. **LP #7189:** Dell Vostro 3500 • i5 1st Gen • 8GB • 500GB HDD • 1 Qty • ₹10,500
16. **LP #7138:** Dell Vostro 3569 • i5 6th Gen • 8GB • 256GB SSD • 1 Qty • ₹20,000
17. **LP #3790:** Dell Latitude 3490 • i5 8th Gen • 8GB • 256GB SSD • 3 Qty • ₹18,000
18. **LP #3583:** Dell Latitude 3400 • i3 8th Gen • 4GB • 256GB SSD • 1 Qty • ₹18,000
19. **LP #3395:** Dell Latitude 3490 • i3 7th Gen • 4GB • 256GB SSD • 2 Qty • ₹18,500
20. **LP #2741:** Dell Latitude 5440 • i3 4th Gen • 8GB • 500GB HDD • 1 Qty • ₹14,000
21. **LP #7004:** HP Pavilion G6 • i3 2nd Gen • 4GB • 500GB HDD • 1 Qty • ₹10,000
22. **LP #3996:** Dell Latitude E5450 • i5 5th Gen • 8GB • 256GB SSD • 1 Qty • ₹18,000
23. **LP #3128:** Dell Latitude 5480 • i5 7th Gen • 8GB • 256GB SSD • 2 Qty • ₹21,000
24. **LP #3429:** Dell Latitude 5480 • i5 6th Gen • 8GB • 256GB SSD • 1 Qty • ₹20,000

---

## 🔄 How to Update Stock, Add Laptops, or Change Prices

1. Open `data/products.json` and `js/products-data.js`.
2. To update stock:
   - Change `"quantity": 2` to `"quantity": 0` when sold out.
   - The website will **automatically** show a red "Out of Stock" badge, display "Currently Unavailable", and disable the WhatsApp purchase button.
3. To add a new laptop:
   - Simply copy one item object, assign a new unique `lpNumber`, fill in the specs, price, and piece quantity.
   - Deploy or refresh the website.

---

## 🖼️ How to Upload or Replace Logo and Real Photos

All asset references are centrally configured:
1. **Business Logo:**
   - Save your uploaded logo file as `assets/images/logo.png` (or `.svg`).
   - In `js/config.js`, update:
     ```javascript
     assets: {
       logo: "assets/images/logo.png"
     }
     ```
2. **Shop Photographs:**
   - Place your real shop photos in `assets/images/shop/` (e.g., `shop-front.jpg`, `shop-counter.jpg`).
   - In `js/config.js`, update the `shopPhotos` array with your filenames.

---

## 🚀 Deployment Instructions

### Option 1: Netlify (Free & Fastest)
1. Go to [Netlify](https://www.netlify.com/) and drag and drop the `egadget-world-mehnajpur` folder into the Netlify Drop area.
2. Your website is immediately live with HTTPS!

### Option 2: Hostinger or CPanel Hosting
1. Compress the contents of `egadget-world-mehnajpur` into a `.zip` file.
2. In Hostinger File Manager, open `public_html`.
3. Upload and extract the zip file.
4. Your website is instantly accessible at your domain.

### Option 3: Local Testing
- Simply double-click `index.html` to open in Google Chrome, Microsoft Edge, or Firefox.
- Or run a quick local server in PowerShell:
  ```powershell
  python -m http.server 8000
  ```
  Then open `http://localhost:8000`.
