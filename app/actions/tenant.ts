"use server";

import { revalidatePath } from "next/cache";
import { queryOne } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { getTenantUrl } from "@/lib/platform";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TenantActionState {
  error?: string;
  success?: boolean;
  tenant?: {
    id: string;
    name: string;
    slug: string;
    url: string;
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Converts a restaurant name to a URL-safe slug.
 * Example: "Pizza House!" → "pizza-house"
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export async function createTenantAction(
  _prevState: TenantActionState | null,
  formData: FormData
): Promise<TenantActionState> {
  const user = await requireUser();
  const name = (formData.get("name") as string)?.trim();

  if (!name) {
    return { error: "Restaurant name is required." };
  }

  // Generate URL-safe slug and ensure uniqueness
  const baseSlug = slugify(name) || "restaurant";
  let slug = baseSlug;
  let counter = 1;

  while (await queryOne<{ id: string }>("SELECT id FROM tenants WHERE slug = $1", [slug])) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  // Insert into PostgreSQL
  const newTenant = await queryOne<{
    id: string;
    user_id: string;
    name: string;
    slug: string;
    created_at: string;
  }>(
    "INSERT INTO tenants (user_id, name, slug) VALUES ($1, $2, $3) RETURNING id, user_id, name, slug, created_at",
    [user.id, name, slug]
  );

  if (!newTenant) {
    return { error: "Failed to create restaurant. Please try again." };
  }

  revalidatePath("/dashboard");

  return {
    success: true,
    tenant: {
      id: newTenant.id,
      name: newTenant.name,
      slug: newTenant.slug,
      url: getTenantUrl(newTenant.slug),
    },
  };
}
