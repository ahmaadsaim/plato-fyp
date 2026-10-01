/**
 * Multi-Tenant Subdomain & Custom Domain Resolver
 * 
 * Extracts the tenant slug or domain identifier from the incoming request hostname.
 * Supports:
 * - Localhost with query param (e.g. localhost:3000?tenant=pizza-artisan)
 * - SaaS Subdomains (e.g. store1.saasdomain.com -> store1)
 * - Custom domains (e.g. order.myburgerstore.com -> custom domain lookup)
 */

export interface TenantIdentification {
  tenantSlug: string
  isCustomDomain: boolean
  hostname: string
}

export function extractTenantFromHost(
  host: string | null,
  saasDomain = process.env.NEXT_PUBLIC_SAAS_ROOT_DOMAIN || 'mysaas.com'
): TenantIdentification {
  if (!host) {
    return { tenantSlug: 'default', isCustomDomain: false, hostname: '' }
  }

  // Strip port if present
  const cleanHost = host.split(':')[0].toLowerCase()

  // Local development fallback
  if (cleanHost === 'localhost' || cleanHost === '127.0.0.1') {
    return { tenantSlug: 'default', isCustomDomain: false, hostname: cleanHost }
  }

  // Check if it's a subdomain of the SaaS platform
  if (cleanHost.endsWith(`.${saasDomain}`)) {
    const subdomain = cleanHost.replace(`.${saasDomain}`, '')
    return {
      tenantSlug: subdomain,
      isCustomDomain: false,
      hostname: cleanHost,
    }
  }

  // Otherwise, it's a customer's custom domain (e.g. order.clientbrand.com)
  return {
    tenantSlug: cleanHost,
    isCustomDomain: true,
    hostname: cleanHost,
  }
}
