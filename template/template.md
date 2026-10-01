# 📐 Storefront Architecture & Component Guideline (`template.md`)

This document provides an in-depth breakdown of the entire storefront page structure, state lifecycle, component hierarchy, and data dependencies. Use this guide to understand how every part of the template operates, how components talk to each other, and how to customize or extend any section.

---

## 🗺️ High-Level Architecture & Page Flow

```
                      ┌────────────────────────────────────────┐
                      │          RootLayout (layout.tsx)        │
                      │  • Injects Google Font (Poppins)       │
                      │  • Loads StoreConfig (getStoreConfig)  │
                      │  • Generates Dynamic SEO Metadata      │
                      │  • Wraps tree in <StoreProvider>       │
                      └───────────────────┬────────────────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                               ▼
     ┌────────────────────────┐                      ┌────────────────────────┐
     │   Home Page (page.tsx) │                      │ Checkout (checkout/page)│
     │  • Header              │                      │  • Back Nav & Logo     │
     │  • HeroBanner          │                      │  • Delivery Form       │
     │  • MenuCategories      │                      │  • Payment Method      │
     │  • ProductsGrid        │                      │  • Order Summary       │
     │  • Footer              │                      │  • Order Submission    │
     │  • CartSidebar         │                      └────────────────────────┘
     └────────────────────────┘
```

---

## 🌳 Component Hierarchy

```
app/layout.tsx
└── StoreProvider (context/StoreContext.tsx)
    ├── app/page.tsx
    │   ├── Header (components/header.tsx)
    │   │   ├── Branch Selector Button & Modal
    │   │   ├── Call to Order Quick-Link
    │   │   ├── Brand Logo
    │   │   ├── Mobile Hamburger Navigation Drawer
    │   │   └── Cart Icon Button (with live counter)
    │   │
    │   ├── HeroBanner (components/hero-banner.tsx)
    │   │   ├── SVG / Raster Slide Renderer
    │   │   ├── Navigation Arrows (Prev / Next)
    │   │   └── Dot Slide Indicators
    │   │
    │   ├── MenuCategories (components/menu-categories.tsx)
    │   │   ├── "All" Tab + Category Pills
    │   │   └── Smooth-Scroll Category Jump Handlers
    │   │
    │   ├── ProductsGrid (components/products-grid.tsx)
    │   │   └── [Per Category]
    │   │       ├── Category Banner Image (with pop animation)
    │   │       └── Product Cards Grid (3 columns desktop, 2 tablet, 1 mobile)
    │   │           └── ProductCard (components/product-card.tsx)
    │   │               ├── Product Thumbnail (40% width)
    │   │               ├── Title, Description & Price Badge (60% width)
    │   │               ├── "Add To Cart" Button
    │   │               └── ProductModal (components/product-modal.tsx) [on click]
    │   │                   ├── React Portal Overlay
    │   │                   ├── Add-Ons Checkbox List
    │   │                   ├── Meal Combo Radio List
    │   │                   ├── Special Instructions Input
    │   │                   ├── Quantity Controls (- / +)
    │   │                   └── Live Total Price "Add To Cart" Button
    │   │
    │   ├── Footer (components/footer.tsx)
    │   │   ├── Brand Logo, Tagline & Description
    │   │   ├── Quick Links
    │   │   ├── Address, Phone & Email
    │   │   ├── Operating Hours
    │   │   └── Copyright & Social Media Links
    │   │
    │   └── CartSidebar (components/cart-sidebar.tsx)
    │       ├── Slide-out Drawer Overlay
    │       ├── Cart Item List (with thumbnail, add-ons, note, quantity, remove)
    │       ├── Subtotal Calculation
    │       └── "Proceed to Checkout" Action Button
    │
    └── app/checkout/page.tsx
        ├── Sticky Header (Back button, store logo, page title)
        ├── Left Column (Form Inputs):
        │   ├── Customer Contact (Name, Phone, Email)
        │   ├── Delivery Address & City
        │   ├── Special Delivery Instructions
        │   └── Payment Selector (Cash on Delivery, WhatsApp Order, Card)
        └── Right Column (Summary Card):
            ├── Cart Items Mini-List
            ├── Price Breakdown (Subtotal, Delivery Fee, Total)
            └── "Place Order" Button -> Success Screen Animation
```

---

## 🔍 Detailed Component Deep Dive

### 1. `app/layout.tsx` (Root Layout)
- **Role**: Entry point for HTML layout, font setup, and top-level data hydration.
- **Key Functions**:
  - `generateMetadata()`: Reads `config.metadata` server-side and automatically configures `<title>`, `<meta description>`, Open Graph cards, and favicon.
  - Injects Google Font `Poppins` with weights `300` through `800`.
  - Wraps the entire application inside `<StoreProvider initialConfig={config}>`.

---

### 2. `components/header.tsx` (Header & Navigation)
- **Role**: Top-level header, location branch picker, direct phone dialer, mobile menu, and cart trigger.
- **Sections**:
  1. **Top Announcement Bar**:
     - Background dynamically styled with `theme.primaryColor`.
     - Left: **Branch Selector** button showing current active branch. Clicking opens a modal listing all configured branches from `config.branches`.
     - Right: **Call and Order** button linking directly to `tel:${config.metadata.contact.phone}`.
  2. **Main Navigation Row**:
     - Left: Hamburger menu opening a slide-out drawer with navigation links and WhatsApp quick-chat.
     - Center: Centered store logo image or store text.
     - Right: Cart bag icon with animated bounce badge displaying `cartItems.length`.
- **Data Source**: `config.metadata`, `config.branches`, `useStore()`.

---

### 3. `components/hero-banner.tsx` (Hero Carousel)
- **Role**: Full-width promotional banner with auto/manual sliding.
- **Features**:
  - Supports both SVG and raster image banners (e.g. `.svg`, `.png`, `.jpg`).
  - Maintains a responsive aspect ratio (`900 / 375`) to avoid layout shifts.
  - Previous and Next chevron buttons.
  - Dot indicators at the bottom indicating active slide.
  - Gracefully renders nothing if `config.heroBanners` is empty.
- **Data Source**: `config.heroBanners`.

---

### 4. `components/menu-categories.tsx` (Category Navigation Tabs)
- **Role**: Sticky/scrollable horizontal pill buttons allowing quick jumps to menu sections.
- **Behavior**:
  - Always includes an **"All"** tab followed by all categories in `config.categories`.
  - Clicking any tab executes a smooth window scroll with an offset to account for fixed headers.
  - Highlights the currently active category using `theme.primaryColor`.
- **Data Source**: `config.categories`.

---

### 5. `components/products-grid.tsx` (Category Sections & Product Grid)
- **Role**: Groups products by category, displays category banners, and renders responsive product grids.
- **Features**:
  - **Category Banners**: If a category has a `banner` image URL, it displays an animated full-width banner at the top of the section.
  - **Intersection Observer**: Observes category banners as the user scrolls into view and applies a smooth `@keyframes pop` scale animation.
  - **Grid Layout**: Responsive CSS Grid (`1 col` on mobile, `2 cols` on tablets, `3 cols` on large displays).
- **Data Source**: `config.categories`, `config.products`.

---

### 6. `components/product-card.tsx` (Product Menu Card)
- **Role**: Interactive card presenting individual food items.
- **Layout**:
  - **Horizontal Split**: Left 35-40% displays product image with zoom hover transition; Right 60-65% displays product name, description (with line clamping), price tag, and "Add To Cart" button.
  - **Badge Support**: If `product.badge` is set (e.g. "Popular", "New", "Chef Special"), displays a branded pill badge over the image.
  - Clicking anywhere on the card opens `ProductModal`.
- **Data Source**: `product` prop, `useStore()`.

---

### 7. `components/product-modal.tsx` (Customization Dialog)
- **Role**: Pop-up modal where customers configure their burger/dish before adding it to the cart.
- **Features**:
  - **React Portal**: Rendered into `document.body` via `createPortal` with `z-[9999]` and backdrop blur to prevent z-index clipping.
  - **Body Scroll Lock**: Automatically disables `document.body.style.overflow` while open.
  - **Add-Ons List**: Checkboxes for extras (e.g. "2x Thick!", "Extra Cheese"). Can be defined per product or fall back to `config.globalAddOns`.
  - **Meal Options**: Radio buttons for combo upgrades (e.g. "Drink + Fries"). Can be defined per product or fall back to `config.globalMealOptions`.
  - **Special Instructions**: Textarea for dietary or preparation requests.
  - **Live Dynamic Pricing**: Real-time formula:
    $$\text{Total} = (\text{Base Price} + \sum \text{AddOns} + \text{Meal Option}) \times \text{Quantity}$$
  - **Add to Cart**: Dispatches configured item to `StoreContext` and closes the modal.

---

### 8. `components/cart-sidebar.tsx` (Slide-Out Cart Drawer)
- **Role**: Right-hand drawer showing current basket items and subtotal.
- **Features**:
  - Backdrop overlay clicking outside closes the drawer.
  - **Empty State**: Friendly illustration and "Explore Menu" call to action.
  - **Item Row**: Image thumbnail, title, selected add-ons, meal upgrades, special notes, quantity decrement/increment buttons, and trash button.
  - **Summary**: Live subtotal formatted in the store's currency.
  - **Checkout Button**: Routes customer directly to `/checkout`.

---

### 9. `components/footer.tsx` (Store Footer)
- **Role**: Comprehensive brand footer providing contact info and reassurance.
- **Sections**:
  - Store Logo & Tagline (e.g. "STRAIT OUT'A HEAVEN").
  - Quick Links navigation.
  - Contact Us: Address, phone number (clickable `tel:`), and email (clickable `mailto:`).
  - Operating Hours: Configured days and opening/closing hours.
  - Bottom Bar: Dynamic current year copyright and social media icon buttons (Facebook, Instagram, Twitter).

---

### 10. `app/checkout/page.tsx` (Checkout Flow)
- **Role**: Order finalization and dispatch screen.
- **Sections**:
  - **Delivery Details Form**: Full Name, Phone Number, Optional Email, Full Address, City, and Delivery Instructions.
  - **Payment Methods**:
    - **Cash on Delivery (COD)**: Standard default payment.
    - **Instant WhatsApp Order**: When selected, clicking "Place Order" formats the entire order with line items, address, and total, and opens the store's WhatsApp chat with a prefilled message.
    - **Online Card**: Prepared with disabled/coming soon badge for Stripe or payment gateway integration.
  - **Order Summary**: Line item review, delivery fee from `config.metadata.delivery.fee`, and calculated grand total.
  - **Success Animation**: Displays an animated checkmark modal upon completion, clears the cart from storage, and redirects home.

---

## ⚡ State & Data Architecture (`StoreContext.tsx`)

`StoreContext` is the central brain of the storefront. It manages:

```typescript
interface StoreContextType {
  config: StoreConfig                       // Complete store configuration JSON
  selectedBranch: Branch | null             // Currently selected restaurant branch
  setSelectedBranch: (branch: Branch) => void
  cartItems: CartItem[]                     // Array of items in basket
  cartOpen: boolean                         // Controls CartSidebar visibility
  setCartOpen: (open: boolean) => void
  addToCart: (item: any) => void            // Appends item with unique ID
  removeFromCart: (itemId: string | number) => void
  updateQuantity: (itemId: string | number, qty: number) => void
  clearCart: () => void                     // Wipes cart state & localStorage
  cartSubtotal: number                      // Sum of items
  deliveryFee: number                       // From config.metadata.delivery.fee
  cartTotal: number                         // Subtotal + Delivery Fee
  formatPrice: (amount: number) => string   // Formats e.g. "Rs. 920" or "$14.99"
}
```

### Persistence & Dynamic Theming
1. **Local Storage Sync**: Every cart modification automatically persists to `localStorage.getItem('cart_<storeId>')` so items are retained across browser refreshes and page transitions.
2. **CSS Variable Theming**: When `StoreProvider` mounts, it reads `config.metadata.theme` and sets:
   ```javascript
   document.documentElement.style.setProperty('--brand-primary', theme.primaryColor)
   document.documentElement.style.setProperty('--brand-primary-fg', theme.primaryForeground)
   document.documentElement.style.setProperty('--brand-accent', theme.accentColor)
   ```
   This ensures that all Tailwind classes relying on `--brand-primary` immediately match the customer's brand colors.

---

## 🗂️ How JSON Config Maps to the UI

| JSON Path in `default-store.json` | Affected Component(s) | Effect on Frontend |
| :--- | :--- | :--- |
| `metadata.name` | `layout.tsx`, `header.tsx`, `footer.tsx`, `checkout/page.tsx` | Site title, browser tab name, header & footer store title. |
| `metadata.tagline` | `footer.tsx` | Subtitle displayed under footer logo. |
| `metadata.logo` | `header.tsx`, `footer.tsx`, `checkout/page.tsx` | Header brand logo and footer brand image. |
| `metadata.currency` | All components displaying prices | Symbol (`Rs.`, `$`, `€`), position (`before` vs `after`), decimals. |
| `metadata.theme.primaryColor` | Entire storefront | Top header banner, active category pill, buttons, cart badge, modal highlights. |
| `metadata.delivery.fee` | `cart-sidebar.tsx`, `checkout/page.tsx` | Delivery charge added to cart subtotal. |
| `metadata.contact.phone` | `header.tsx`, `footer.tsx` | "Call and Order" phone target, footer phone link. |
| `metadata.contact.whatsapp` | `header.tsx`, `checkout/page.tsx` | WhatsApp chat drawer button, WhatsApp order dispatcher. |
| `branches` | `header.tsx` branch modal | Selectable pickup/delivery store locations. |
| `heroBanners` | `hero-banner.tsx` | Main carousel slides, promotional banners. |
| `categories` | `menu-categories.tsx`, `products-grid.tsx` | Navigation pills and category banner divisions. |
| `products` | `products-grid.tsx`, `product-card.tsx`, `product-modal.tsx` | Menu items, prices, images, add-ons, and meal options. |
| `globalAddOns` | `product-modal.tsx` | Default extra toppings available across products. |
| `globalMealOptions` | `product-modal.tsx` | Default drink & side combo upgrades. |

---

## 🎨 Pre-Packaged Demo Businesses (A through E)

The reusable template provides 5 ready-to-use business configurations showcasing its flexibility:

1. **Business A: Burger Craft & Co.** ([`config/samples/burger-craft.json`](file:///d:/online-ordering-system/template/config/samples/burger-craft.json))
   - Cuisine: Gourmet smash patties, brioche buns, crinkle cut fries, hand-spun shakes.
   - Theme: Amber gold `#f59e0b` & deep charcoal, USD ($).
2. **Business B: Artisan Crust Co.** ([`config/samples/pizza-artisan.json`](file:///d:/online-ordering-system/template/config/samples/pizza-artisan.json))
   - Cuisine: Wood-fired Neapolitan pizza, San Marzano dips, hot honey extras.
   - Theme: Italian terracotta `#e64a19`, USD ($).
3. **Business C: Sakura Sushi Bar** ([`config/samples/sushi-sakura.json`](file:///d:/online-ordering-system/template/config/samples/sushi-sakura.json))
   - Cuisine: Omakase boxes, torched aburi rolls, gyoza, fresh sashimi platters.
   - Theme: Rose pink `#e11d48` & dark slate, USD ($).
4. **Business D: Velvet Roasters & Bakery** ([`config/samples/velvet-bakery.json`](file:///d:/online-ordering-system/template/config/samples/velvet-bakery.json))
   - Cuisine: Specialty single-origin coffees, flaky croissants, Parisian brunch tartines.
   - Theme: Warm caramel `#b45309`, EUR (€).
5. **Business E: La Fiesta Taco Cantina** ([`config/samples/taco-cantina.json`](file:///d:/online-ordering-system/template/config/samples/taco-cantina.json))
   - Cuisine: Crispy beef birria quesatacos with consomé, street tacos, fresh horchata.
   - Theme: Vibrant emerald `#10b981`, USD ($).

---

## 🛡️ Non-Destructive Isolation Guarantee

This reusable template is maintained in full isolation:
- **Zero modification to existing website**: Root files (`app/page.tsx`, `app/checkout/page.tsx`, `components/`, etc.) remain completely untouched.
- **Independent state and storage**: Cart items and branch selection are namespaced to `cart_<storeId>`, preventing state collisions.
- **Decoupled assets & dependencies**: The template uses its own configuration files, types, and modular components, allowing it to be deployed independently or as a multi-tenant SaaS frontend.
