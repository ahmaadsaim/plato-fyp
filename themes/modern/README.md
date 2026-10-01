# Modern Restaurant Theme

A high-performance, responsive restaurant storefront theme designed for artisanal kitchens, pizzerias, burger joints, and modern fast-casual eateries.

## Architecture

This theme follows the strict Shopify-like JSON-driven paradigm:
- **`theme.json`**: Declares theme metadata, design tokens (colors, typography, spacing, radius, shadows, layout), and supported section types.
- **`pages/home.json`**: Declares the ordered list of sections to render on the home page, with custom settings per section.
- **Components & Registry**: Implemented in React in `themes/sections/` and registered in `themes/engine/sectionRegistry.ts`.

## Tokens Available

| Category | Key | Description |
|---|---|---|
| Colors | `primary`, `primaryHover` | Main brand call-to-action color |
| Colors | `secondary`, `secondaryHover` | Secondary action and surface tones |
| Colors | `background`, `surface`, `surfaceCard` | Dark aesthetic layered surfaces |
| Colors | `text`, `mutedText`, `border` | Typography and structural dividers |
| Colors | `accent`, `badge`, `price` | Highlight accents, badges, and emerald pricing |
| Typography | `fontFamily`, `headingFont` | Typography stack |
| Spacing | `section`, `container`, `card` | Section paddings and container gutters |
| Radius | `small`, `medium`, `large`, `full` | Border radius scales |
| Layout | `maxWidth`, `productColumns` | Storefront layout constraints |

## Section Types Supported

1. `navbar`: Header with optional announcement strip, restaurant logo, navigational anchors, and order CTA.
2. `hero`: Appetizing hero banner with headline, description, ratings, delivery badges, and CTA buttons.
3. `categories`: Visual category grid/pills for customer exploration.
4. `product-grid`: Menu showcase with category tab filtering, responsive grid, and interactive dish cards.
5. `promo`: Promotional callout banner with coupon code copy functionality.
6. `footer`: Multi-column footer with brand profile, operating hours, newsletter signup, and copyright.

## How to Customize or Override for Tenants

In a multi-tenant environment, a restaurant tenant can provide overrides to any token or setting without modifying this base theme. The engine merges tenant overrides over the base `theme.json` using `mergeTheme()`.
