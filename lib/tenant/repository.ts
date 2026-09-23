import { queryOne } from "@/lib/db";
import type { Tenant } from "./resolveTenant";

export function slugifyTenantName(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createTenantForUser(
  userId: string,
  name: string
): Promise<Tenant | null> {
  const baseSlug = slugifyTenantName(name) || "restaurant";
  let slug = baseSlug;
  let counter = 1;

  while (await queryOne<{ id: string }>("SELECT id FROM tenants WHERE slug = $1", [slug])) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return queryOne<Tenant>(
    "INSERT INTO tenants (user_id, name, slug) VALUES ($1, $2, $3) RETURNING id, user_id, name, slug, created_at",
    [userId, name, slug]
  );
}

export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  return queryOne<Tenant>(
    "SELECT id, user_id, name, slug, created_at FROM tenants WHERE slug = $1",
    [slug.toLowerCase()]
  );
}