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

  let slug = extractSlugFromHost(host);
  if (!slug && host && !host.includes(":") && !host.includes(".")) {
    slug = host.trim().toLowerCase();
  }

  // If no tenant subdomain, this is the platform hostname.
  if (!slug) {
    return null;
  }

  // Query PostgreSQL for the tenant
  let tenant: Tenant | null = null;
  try {
    tenant = await queryOne<Tenant>(
      "SELECT id, user_id, name, slug, created_at FROM tenants WHERE slug = $1",
      [slug.toLowerCase()]
    );
  } catch {
    tenant = null;
  }

  // If tenant not found in DB:
  if (!tenant) {
    // In local development, gracefully provide a fallback tenant so subdomains work offline
    if (process.env.NODE_ENV !== "production") {
      return {
        id: "demo-tenant-" + slug,
        user_id: "demo-user",
        name: slug
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" "),
        slug: slug.toLowerCase(),
        created_at: new Date().toISOString(),
      };
    }
    notFound();
  }

  return tenant;
}
