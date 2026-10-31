/**
 * E-Gadget World — Central Business Configuration
 * Mehnajpur Branch, Azamgarh
 */

const BUSINESS_CONFIG = {
  name: "E-Gadget World",
  tagline: "Your Trusted Destination for Laptops, Electronics & Digital Services",
  branch: "Mehnajpur Branch",
  owner: "Sunil Kumar Maurya (Sonu)",
  
  // Primary Contact & WhatsApp
  phone: "+91 9984359860",
  phoneRaw: "+919984359860",
  whatsappNumber: "919984359860",
  
  // Alternate Mobile (from store notes)
  alternatePhone: "+91 7355303639",
  alternatePhoneRaw: "+917355303639",

  // Physical Location
  address: {
    line1: "Near Mehnajpur Thana",
    locality: "Mehnajpur",
    district: "Azamgarh",
    state: "Uttar Pradesh",
    pincode: "276203",
    full: "Near Mehnajpur Thana, Mehnajpur, Azamgarh, Uttar Pradesh – 276203"
  },
  
  // Verified Google Maps search link (no fake coordinates)
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Near+Mehnajpur+Thana,+Mehnajpur,+Azamgarh,+Uttar+Pradesh+276203",

  // Business Hours
  hours: "8:00 AM – 9:00 PM (Monday to Sunday)",
  hoursShort: "8:00 AM – 9:00 PM",

  // Warranty Policy Range
  warrantyRange: "6 Months to 1 Year",
  warrantyFallback: "Warranty: Please Confirm with Store",

  // Branches Directory
  branches: [
    {
      id: "delhi-ho",
      city: "Burari, Delhi",
      role: "Head Office",
      isHeadOffice: true,
      status: "Operational",
      description: "Corporate headquarters managing wholesale inventory, logistics, and company operations."
    },
    {
      id: "mehnajpur",
      city: "Mehnajpur, Azamgarh",
      role: "Retail & Digital Service Branch",
      isHeadOffice: false,
      isCurrent: true,
      status: "Active Retail Showroom",
      address: "Near Mehnajpur Thana, Mehnajpur, Azamgarh, Uttar Pradesh – 276203",
      contact: "+91 9984359860 / +91 7355303639",
      hours: "8:00 AM – 9:00 PM",
      description: "Our premier retail branch offering refurbished and gaming laptops, repair services, accessories, CSC digital services, and Indian Bank information."
    },
    {
      id: "varanasi",
      city: "Varanasi",
      role: "Branch",
      isHeadOffice: false,
      status: "Branch Location",
      description: "Regional branch serving Eastern Uttar Pradesh retail and service network."
    },
    {
      id: "haldwani",
      city: "Haldwani",
      role: "Branch",
      isHeadOffice: false,
      status: "Branch Location",
      description: "Serving Uttarakhand region with distribution and technical support."
    },
    {
      id: "bangalore",
      city: "Bangalore",
      role: "Branch",
      isHeadOffice: false,
      status: "Branch Location",
      description: "Southern technology hub branch supporting enterprise sourcing and refurbishing."
    }
  ],

  // Services Offered
  services: [
    {
      id: "refurbished-laptops",
      title: "Quality Refurbished Laptops",
      shortDesc: "Tested commercial-grade laptops from Dell, HP & Lenovo with store warranty options.",
      icon: "laptop",
      available: true
    },
    {
      id: "gaming-laptops",
      title: "Gaming Laptops",
      shortDesc: "High performance laptops for gaming, video editing, rendering, and graphics workloads.",
      icon: "gamepad",
      available: true
    },
    {
      id: "laptop-accessories",
      title: "Laptop Accessories",
      shortDesc: "Original chargers, SSDs, RAM upgrades, bags, keyboards, mice, and thermal paste.",
      icon: "plug",
      available: true
    },
    {
      id: "laptop-repair",
      title: "Laptop Repair & Service",
      shortDesc: "Hardware diagnostics, screen replacement, hinge repair, chip-level motherboard service, OS installation.",
      icon: "tool",
      available: true
    },
    {
      id: "csc-services",
      title: "CSC Digital Services",
      shortDesc: "Digital citizen services including online certificates, utility bill payments, and government application assistance.",
      icon: "globe",
      available: true,
      note: "Standard public facilitation services available at the Mehnajpur center."
    },
    {
      id: "indian-bank-services",
      title: "Indian Bank Services — Details to Be Confirmed",
      shortDesc: "Information desk regarding local banking assistance and customer correspondence queries. Details under formal verification.",
      icon: "bank",
      available: false,
      isPendingVerification: true,
      note: "Informational section only. Formal verification in progress. We do not solicit or collect passwords, OTPs, PINs, or financial credentials."
    }
  ],

  // Central Social Links (Hidden or disabled if not configured yet)
  socialLinks: {
    whatsapp: {
      enabled: true,
      url: "https://wa.me/919984359860",
      label: "WhatsApp"
    },
    facebook: {
      enabled: false,
      url: "",
      label: "Facebook"
    },
    instagram: {
      enabled: false,
      url: "",
      label: "Instagram"
    },
    youtube: {
      enabled: false,
      url: "",
      label: "YouTube"
    }
  },

  // Central Assets Registry (Easily replaceable)
  assets: {
    logo: "assets/images/logo.svg",
    shopPhotos: [
      {
        id: "storefront-main",
        title: "E-Gadget World Showroom Front",
        category: "Showroom",
        caption: "Official E-Gadget World storefront and Indian Bank Customer Service Centre signboard near Mehnajpur Thana",
        url: "assets/images/shop/storefront-main.jpg"
      },
      {
        id: "showroom-display",
        title: "Commercial Laptop Display Counters",
        category: "Showroom",
        caption: "L-shaped showroom counters and illuminated wall shelves featuring Dell, HP & Lenovo commercial laptops",
        url: "assets/images/shop/showroom-display.jpg"
      },
      {
        id: "showroom-interior",
        title: "Showroom Interior & Chandelier",
        category: "Showroom",
        caption: "Premium wooden ceiling with chandelier, LED lighting, and customer demo counter at Mehnajpur branch",
        url: "assets/images/shop/showroom-interior.jpg"
      },
      {
        id: "reception-desk",
        title: "Customer Reception & Service Desk",
        category: "Service Center",
        caption: "Customer reception counter, digital diagnostic station, and wood-slat illuminated feature wall",
        url: "assets/images/shop/reception-desk.jpg"
      },
      {
        id: "storefront-entrance",
        title: "Showroom Glass Facade & Entrance",
        category: "Digital Desk",
        caption: "Storefront entrance with glass facade, safety shutter, and customer information desk",
        url: "assets/images/shop/storefront-entrance.jpg"
      }
    ]
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = BUSINESS_CONFIG;
}
