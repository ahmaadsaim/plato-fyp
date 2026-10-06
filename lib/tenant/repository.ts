import { queryOne } from "@/lib/db";
import { isValidTheme } from "@/lib/theme/repository";
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
  name: string,
  themeId: string = "modern"
): Promise<Tenant | null> {
  const validThemeId = (await isValidTheme(themeId)) ? themeId : "modern";
  const baseSlug = slugifyTenantName(name) || "restaurant";
  let slug = baseSlug;
  let counter = 1;

  while (await queryOne<{ id: string }>("SELECT id FROM tenants WHERE slug = $1", [slug])) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const tenant = await queryOne<Tenant>(
    "INSERT INTO tenants (user_id, name, slug, theme_id) VALUES ($1, $2, $3, $4) RETURNING id, user_id, name, slug, theme_id, created_at",
    [userId, name, slug, validThemeId]
  );

  return tenant;
}

export async function updateTenantTheme(
  slug: string,
  themeId: string,
  userId?: string
): Promise<boolean> {
  const valid = await isValidTheme(themeId);
  if (!valid) {
    throw new Error(`Invalid theme ID: "${themeId}". Theme does not exist.`);
  }

  const queryText = userId
    ? "UPDATE tenants SET theme_id = $1 WHERE slug = $2 AND user_id = $3 RETURNING id"
    : "UPDATE tenants SET theme_id = $1 WHERE slug = $2 RETURNING id";
  const params = userId ? [themeId, slug.toLowerCase(), userId] : [themeId, slug.toLowerCase()];

  const res = await queryOne<{ id: string }>(queryText, params);
  return !!res;
}

export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  const tenant = await queryOne<Tenant>(
    "SELECT id, user_id, name, slug, theme_id, created_at FROM tenants WHERE slug = $1",
    [slug.toLowerCase()]
  );
  if (tenant && !tenant.theme_id) {
    tenant.theme_id = "modern";
  }
  return tenant;
}

export async function deleteTenantBySlug(slug: string, userId: string): Promise<boolean> {
  try {
    const res = await queryOne<{ id: string }>(
      "DELETE FROM tenants WHERE slug = $1 AND user_id = $2 RETURNING id",
      [slug.toLowerCase(), userId]
    );
    return !!res;
  } catch {
    return false;
  }
}