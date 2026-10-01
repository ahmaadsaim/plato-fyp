# 🛠️ SaaS Setup & Deployment Guide

This guide walks you through setting up this storefront template as part of a multi-tenant SaaS platform where customers can have storefronts on subdomains (e.g. `brand.yoursaas.com`) or custom domains (e.g. `order.brand.com`).

---

## 1. Multi-Tenant Architecture Overview

```
[Customer Browser]
       │
       ▼
[Next.js Middleware / Layout] ── extracts host (e.g. cafe.yoursaas.com or order.cafe.com)
       │
       ▼
[lib/store-config.ts] ── fetches store JSON config from SaaS DB / API
       │
       ▼
[StoreProvider] ── injects theme, currency, branches, products
       │
       ▼
[Dynamic Storefront UI] ── renders branded experience with custom logo & colors
```

---

## 2. Setting Up Dynamic Domain Middleware (Optional)

If hosting all tenants on a single Next.js deployment, create `template/middleware.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { extractTenantFromHost } from './lib/tenant'

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

export function middleware(req: NextRequest) {
  const hostname = req.headers.get('host')
  const { tenantSlug, isCustomDomain } = extractTenantFromHost(hostname)

  // Pass the identified tenant to downstream server components via custom headers
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-tenant-slug', tenantSlug)
  requestHeaders.set('x-is-custom-domain', String(isCustomDomain))

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}
```

---

## 3. Database Schema for SaaS Backend

Store configurations map 1:1 with standard relational (PostgreSQL) or document (MongoDB) schemas:

### PostgreSQL Example (Prisma / Drizzle)
```sql
CREATE TABLE stores (
  id VARCHAR(64) PRIMARY KEY,
  subdomain VARCHAR(64) UNIQUE NOT NULL,
  custom_domain VARCHAR(255) UNIQUE,
  name VARCHAR(255) NOT NULL,
  tagline VARCHAR(255),
  description TEXT,
  logo_url TEXT,
  currency_symbol VARCHAR(10) DEFAULT 'Rs.',
  currency_code VARCHAR(10) DEFAULT 'PKR',
  primary_color VARCHAR(20) DEFAULT '#60dbdc',
  contact_phone VARCHAR(50),
  contact_email VARCHAR(100),
  delivery_fee NUMERIC(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  store_id VARCHAR(64) REFERENCES stores(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  banner_url TEXT,
  sort_order INT DEFAULT 0
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  store_id VARCHAR(64) REFERENCES stores(id) ON DELETE CASCADE,
  category_id INT REFERENCES categories(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true
);
```

---

## 4. Custom Domains & Vercel Wildcard DNS

### Setting Up Wildcard Subdomains
1. In your DNS provider (Cloudflare, Namecheap, Route 53), add a wildcard record:
   - **Type**: `CNAME`
   - **Name**: `*`
   - **Target**: `cname.vercel-dns.com` (or your SaaS hosting provider)
2. Any subdomain `anything.yoursaas.com` will route directly to your Next.js application!

### Setting Up Custom Domains for Clients
1. Add the domain to your Vercel project via the Vercel API:
   ```bash
   POST https://api.vercel.com/v10/projects/{projectId}/domains
   {
     "name": "order.clientrestaurant.com"
   }
   ```
2. The client sets a CNAME in their DNS:
   - **Host**: `order`
   - **Value**: `cname.vercel-dns.com`
3. The storefront automatically detects `order.clientrestaurant.com` and loads their store configuration!

---

## 5. Order Webhook Integration

When customers submit an order at `/checkout`, the payload is formatted as:

```json
{
  "orderId": "ORD-123456",
  "storeId": "holy-buns-lahore",
  "customer": {
    "name": "Ali Mazhar",
    "phone": "+92 300 0000000",
    "email": "customer@example.com",
    "address": "Street 5, Phase 4",
    "city": "Lahore",
    "instructions": "Leave at front gate"
  },
  "branch": {
    "id": 1,
    "name": "Bahria Town"
  },
  "items": [
    {
      "productId": 1,
      "name": "Saint Stack",
      "price": 920,
      "quantity": 2,
      "selectedAddOns": ["2x Thick!"],
      "selectedMeal": "Drink + Fries",
      "totalPrice": 3280
    }
  ],
  "subtotal": 3280,
  "deliveryFee": 150,
  "total": 3430,
  "paymentMethod": "cod"
}
```

Point your SaaS webhook or API route in `.env`:
```env
NEXT_PUBLIC_SAAS_API_URL=https://api.yoursaas.com
```
And every order will automatically dispatch to your central order management system.
