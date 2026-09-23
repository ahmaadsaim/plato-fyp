import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { queryOne } from "@/lib/db";
import { extractSlugFromHost } from "./host";

export interface Tenant {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  created_at: string;
}

export { extractSlugFromHost } from "./host";

/**
 * Central Reusable Tenant Resolver
 * Determines the tenant from the request hostname:
 * 1. Reads the incoming request host from headers (or optional hostOverride).
 * 2. Extracts the tenant slug from the hostname.
 * 3. Queries PostgreSQL for the tenant matching that slug.
 * 4. If slug is present but tenant is not found in database, triggers notFound() (404).
 * 5. If hostname has no configured tenant subdomain, returns null.
 */
export async function resolveTenant(hostOverride?: string): Promise<Tenant | null> {
  let host = hostOverride;

  if (!host) {
    try {
      const headersList = await headers();
      host = headersList.get("host") || "";
    } catch {
      host = "";
    }
  }

  const slug = extractSlugFromHost(host);

  // If no tenant subdomain, this is the platform hostname.
  if (!slug) {
    return null;
  }

  // Query PostgreSQL for the tenant
  const tenant = await queryOne<Tenant>(
    "SELECT id, user_id, name, slug, created_at FROM tenants WHERE slug = $1",
    [slug.toLowerCase()]
  );

  // If tenant does not exist in DB, return 404
  if (!tenant) {
    notFound();
  }

  return tenant;
}
