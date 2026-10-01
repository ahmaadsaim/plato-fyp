# 🍔 SaaS Multi-Tenant Storefront Template

A high-performance, white-label online ordering frontend template built for food ordering SaaS platforms, restaurant chains, and ghost kitchens.

This template delivers the **exact same premium UI, snappy micro-animations, product modal customizer, slide-out cart, and checkout flow** as Holy Buns, but is **100% config-driven**. Any restaurant or brand can be launched in minutes simply by providing a JSON file or fetching from your SaaS API.

---

## 🚀 Key Features

- **100% Config-Driven**: Change branding, logos, colors, banners, categories, products, add-ons, and branches without touching a single line of React code.
- **Dynamic Theming**: Color palettes (`primaryColor`, `accentColor`, `primaryForeground`) are injected dynamically via CSS variables, enabling instant rebranding.
- **Multi-Tenant Ready**: Supports standalone deployments (1 store per repo), SaaS subdomains (`brand.yoursaas.com`), and custom domains (`order.brand.com`).
- **Product Customizer Modal**: Configurable add-ons (+ prices), meal combo upgrades, and special preparation instructions.
- **Persistent Cart & Checkout**: Slide-out cart drawer with quantity management, auto-calculated delivery fee, currency formatting, and multiple payment options (COD, WhatsApp order, Online card).
- **SEO & Social Share Ready**: Generates metadata (`<title>`, `<meta description>`, Open Graph cards, favicons) dynamically from the store configuration.

---

## 📁 Project Structure

```
template/
├── app/
│   ├── checkout/
│   │   └── page.tsx           # Config-driven checkout with payment methods
│   ├── globals.css            # Tailwind + CSS variable tokens
│   ├── layout.tsx             # Dynamic metadata & StoreProvider wrapper
│   └── page.tsx               # Storefront homepage
├── components/
│   ├── cart-sidebar.tsx       # Slide-out cart with add-on summary
│   ├── footer.tsx             # Contact info, opening hours, social links
│   ├── header.tsx             # Branch switcher, call-to-order, dynamic logo
│   ├── hero-banner.tsx        # Responsive carousel slider
│   ├── menu-categories.tsx    # Horizontal scrollable category tabs
│   ├── product-card.tsx       # Responsive menu item card
│   ├── product-modal.tsx      # Add-on and meal selection modal
│   ├── demo-store-switcher.tsx# Real-time multi-tenant business preset switcher
│   └── products-grid.tsx      # Category sections & animated banners
├── config/
│   ├── default-store.json     # Holy Buns reference configuration
│   └── samples/
│       ├── burger-craft.json  # Business A: Gourmet Smash Burgers & Loaded Fries
│       ├── pizza-artisan.json # Business B: Wood-Fired Neapolitan Pizza & Dips
│       ├── sushi-sakura.json  # Business C: Modern Japanese Sushi & Omakase
│       ├── velvet-bakery.json # Business D: Specialty Coffee & Artisan Bakery
│       └── taco-cantina.json  # Business E: Street Tacos & Mexican Cantina
├── context/
│   └── StoreContext.tsx       # Global store state (cart, branch, theme, live config)
├── lib/
│   ├── store-config.ts        # Config loader, sample store dictionary & currency formatter
│   └── tenant.ts              # Subdomain & custom domain resolver
├── types/
│   └── store.ts               # Complete TypeScript interfaces
├── public/                    # Assets, banners, and logos
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚡ Quick Start (Running Locally)

1. Navigate to the template directory:
   ```bash
   cd template
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ How to Customize a Store

All store data lives in [`config/default-store.json`](./config/default-store.json).

### 1. Change Brand Name, Logo, and Colors
```json
"metadata": {
  "name": "Artisan Crust Co.",
  "tagline": "WOOD-FIRED PERFECTION",
  "description": "Authentic Italian wood-fired pizza.",
  "logo": "/artisan-logo.png",
  "theme": {
    "primaryColor": "#ff5722",
    "primaryForeground": "#ffffff",
    "accentColor": "#ff5722"
  }
}
```

### 2. Set Currency & Delivery Settings
```json
"currency": {
  "symbol": "$",
  "code": "USD",
  "position": "before"
},
"delivery": {
  "fee": 3.99,
  "freeDeliveryAbove": 40.00
}
```

### 3. Add or Modify Products
```json
{
  "id": 101,
  "name": "Truffle Mushroom Pizza",
  "description": "Wild forest mushrooms, truffle cream, fior di latte mozzarella",
  "price": 18.50,
  "image": "/mushroom-burger.png",
  "category": 1,
  "isAvailable": true,
  "addOns": [
    { "name": "Extra Truffle Oil", "price": 2.00 },
    { "name": "Burrata Cheese", "price": 4.50 }
  ]
}
```

---

## 🎨 Pre-Built Business Presets

The template comes pre-packaged with 5 diverse, ready-to-run business configurations in `config/samples/`:

| Business Preset | Cuisine / Type | Brand Colors | Currency | Config File |
| :--- | :--- | :--- | :--- | :--- |
| **Business A: Burger Craft & Co.** | Gourmet Smash Burgers | `#f59e0b` (Amber Gold) | USD ($) | [`burger-craft.json`](./config/samples/burger-craft.json) |
| **Business B: Artisan Crust Co.** | Wood-Fired Neapolitan Pizza | `#e64a19` (Terracotta) | USD ($) | [`pizza-artisan.json`](./config/samples/pizza-artisan.json) |
| **Business C: Sakura Sushi Bar** | Modern Japanese & Omakase | `#e11d48` (Rose Pink) | USD ($) | [`sushi-sakura.json`](./config/samples/sushi-sakura.json) |
| **Business D: Velvet Roasters** | Specialty Coffee & Bakery | `#b45309` (Warm Caramel) | EUR (€) | [`velvet-bakery.json`](./config/samples/velvet-bakery.json) |
| **Business E: La Fiesta Cantina** | Street Tacos & Fresh Grill | `#10b981` (Emerald Green) | USD ($) | [`taco-cantina.json`](./config/samples/taco-cantina.json) |

Switch between any of these presets interactively using the **floating Demo Business Switcher** in the bottom-left corner of the storefront, or by setting `NEXT_PUBLIC_DEFAULT_TENANT` in your `.env.local`.

---

## 🌐 SaaS Multi-Tenancy (Subdomains & Custom Domains)

To run this in multi-tenant SaaS mode:

1. **Set Environment Variables**:
   In `.env.local`:
   ```env
   NEXT_PUBLIC_SAAS_ROOT_DOMAIN=yourplatform.com
   NEXT_PUBLIC_SAAS_API_URL=https://api.yourplatform.com
   ```

2. **How Domain Resolution Works**:
   - `client1.yourplatform.com` -> Resolves `tenantSlug: "client1"`
   - `order.clientcustomdomain.com` -> Resolves `tenantSlug: "order.clientcustomdomain.com"`
   - The template fetches the matching `StoreConfig` from your SaaS backend API via [`lib/store-config.ts`](./lib/store-config.ts).

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for full backend integration and deployment instructions.
