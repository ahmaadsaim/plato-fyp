import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { queryOne } from "@/lib/db";
import { extractSlugFromHost } from "./host";

export interface Tenant {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  theme_id: string;
  theme_source?: string;
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

  if (!slug) {
    return null;
  }

  let tenant: Tenant | null = null;
  try {
    tenant = await queryOne<Tenant>(
      "SELECT id, user_id, name, slug, theme_id, theme_source, created_at FROM tenants WHERE slug = $1",
      [slug.toLowerCase()]
    );
  } catch {
    tenant = null;
  }

  if (tenant) {
    tenant.theme_id = tenant.theme_id || "modern";
    tenant.theme_source = tenant.theme_source || "LOCAL";
    return tenant;
  }

  if (process.env.NODE_ENV !== "production") {
    return {
      id: "demo-tenant-" + slug,
      user_id: "demo-user",
      name: slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      slug: slug.toLowerCase(),
      theme_id: "modern",
      theme_source: "LOCAL",
      created_at: new Date().toISOString(),
    };
  }

  notFound();
  return null;
}
