import { query, queryOne } from "@/lib/db";
import { isValidTheme } from "@/lib/theme/repository";
import type { Tenant } from "./resolveTenant";

export type ThemeSource = "LOCAL" | "DATABASE";

export interface ThemeOverrideRecord {
  id: string;
  tenant_id: string;
  tokens_override: Record<string, unknown> | null;
  layout_override: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

function hydrateTenant(tenant: Partial<Tenant> | null | undefined): Tenant | null {
  if (!tenant) return null;

  return {
    ...tenant,
    theme_id: tenant.theme_id || "modern",
    theme_source: normalizeThemeSource((tenant as { theme_source?: string | null }).theme_source),
  } as Tenant;
}

function deepMerge<T extends Record<string, unknown>>(base: T = {} as T, patch: Record<string, unknown> = {}): T {
  const merged = { ...base } as Record<string, unknown>;

  for (const [key, value] of Object.entries(patch)) {
    if (value && typeof value === "object" && !Array.isArray(value) && merged[key] && typeof merged[key] === "object" && !Array.isArray(merged[key])) {
      merged[key] = deepMerge(merged[key] as Record<string, unknown>, value as Record<string, unknown>);
      continue;
    }

    merged[key] = value;
  }

  return merged as T;
}

export function slugifyTenantName(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeThemeSource(value?: string | null): ThemeSource {
  const normalized = (value || "LOCAL").toString().trim().toUpperCase();
  return normalized === "DATABASE" ? "DATABASE" : "LOCAL";
}

export async function createTenantForUser(
  userId: string,
  name: string,
  themeId: string = "modern",
  themeSource: ThemeSource | string = "LOCAL"
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
    "INSERT INTO tenants (user_id, name, slug, theme_id, theme_source) VALUES ($1, $2, $3, $4, $5) RETURNING id, user_id, name, slug, theme_id, theme_source, created_at",
    [userId, name, slug, validThemeId, normalizeThemeSource(themeSource)]
  );

  if (tenant) {
    await ensureTenantThemeOverride(tenant.id);
  }

  return hydrateTenant(tenant);
}

export async function getUserTenants(userId: string): Promise<Tenant[]> {
  const rows = await query<Tenant>(
    "SELECT id, user_id, name, slug, theme_id, theme_source, created_at FROM tenants WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );

  return rows.map((tenant) => hydrateTenant(tenant) as Tenant);
}

export async function getTenantByIdForUser(tenantId: string, userId: string): Promise<Tenant | null> {
  const tenant = await queryOne<Tenant>(
    "SELECT id, user_id, name, slug, theme_id, theme_source, created_at FROM tenants WHERE id = $1 AND user_id = $2",
    [tenantId, userId]
  );

  return hydrateTenant(tenant);
}

export async function updateTenantTheme(
  slug: string,
  themeId: string,
  userId?: string,
  themeSource: ThemeSource | string = "LOCAL"
): Promise<boolean> {
  const valid = await isValidTheme(themeId);
  if (!valid) {
    throw new Error(`Invalid theme ID: "${themeId}". Theme does not exist.`);
  }

  const normalizedThemeSource = normalizeThemeSource(themeSource);
  const queryText = userId
    ? "UPDATE tenants SET theme_id = $1, theme_source = $2 WHERE slug = $3 AND user_id = $4 RETURNING id"
    : "UPDATE tenants SET theme_id = $1, theme_source = $2 WHERE slug = $3 RETURNING id";
  const params = userId
    ? [themeId, normalizedThemeSource, slug.toLowerCase(), userId]
    : [themeId, normalizedThemeSource, slug.toLowerCase()];

  const res = await queryOne<{ id: string }>(queryText, params);
  return !!res;
}

export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  const tenant = await queryOne<Tenant>(
    "SELECT id, user_id, name, slug, theme_id, theme_source, created_at FROM tenants WHERE slug = $1",
    [slug.toLowerCase()]
  );

  return hydrateTenant(tenant);
}

export async function getTenantBySlugForUser(slug: string, userId: string): Promise<Tenant | null> {
  const tenant = await queryOne<Tenant>(
    "SELECT id, user_id, name, slug, theme_id, theme_source, created_at FROM tenants WHERE slug = $1 AND user_id = $2",
    [slug.toLowerCase(), userId]
  );

  return hydrateTenant(tenant);
}

export async function getTenantThemeOverride(tenantId: string): Promise<ThemeOverrideRecord | null> {
  return queryOne<ThemeOverrideRecord>(
    "SELECT id, tenant_id, tokens_override, layout_override, created_at, updated_at FROM theme_overrides WHERE tenant_id = $1",
    [tenantId]
  );
}

export async function ensureTenantThemeOverride(tenantId: string): Promise<ThemeOverrideRecord | null> {
  const existing = await getTenantThemeOverride(tenantId);
  if (existing) {
    return existing;
  }

  return queryOne<ThemeOverrideRecord>(
    "INSERT INTO theme_overrides (tenant_id, tokens_override, layout_override) VALUES ($1, '{}'::jsonb, '{}'::jsonb) RETURNING id, tenant_id, tokens_override, layout_override, created_at, updated_at",
    [tenantId]
  );
}

export async function upsertTenantThemeOverride(
  tenantId: string,
  payload: {
    tokensOverride?: Record<string, unknown>;
    layoutOverride?: Record<string, unknown>;
  } = {}
): Promise<ThemeOverrideRecord | null> {
  const existing = await getTenantThemeOverride(tenantId);
  const currentTokens = existing?.tokens_override && typeof existing.tokens_override === "object" ? (existing.tokens_override as Record<string, unknown>) : {};
  const currentLayout = existing?.layout_override && typeof existing.layout_override === "object" ? (existing.layout_override as Record<string, unknown>) : {};

  const nextTokens = deepMerge(currentTokens, payload.tokensOverride || {});
  const nextLayout = deepMerge(currentLayout, payload.layoutOverride || {});

  return queryOne<ThemeOverrideRecord>(
    `INSERT INTO theme_overrides (tenant_id, tokens_override, layout_override)
     VALUES ($1, $2::jsonb, $3::jsonb)
     ON CONFLICT (tenant_id) DO UPDATE
     SET tokens_override = EXCLUDED.tokens_override,
         layout_override = EXCLUDED.layout_override
     RETURNING id, tenant_id, tokens_override, layout_override, created_at, updated_at`,
    [tenantId, JSON.stringify(nextTokens), JSON.stringify(nextLayout)]
  );
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

export async function deleteTenantThemeOverride(tenantId: string): Promise<boolean> {
  try {
    const res = await queryOne<{ id: string }>(
      "DELETE FROM theme_overrides WHERE tenant_id = $1 RETURNING id",
      [tenantId]
    );
    return !!res;
  } catch {
    return false;
  }
}