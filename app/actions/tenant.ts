"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { getTenantUrl } from "@/lib/platform";
import { createTenantForUser } from "@/lib/tenant/repository";

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

  let newTenant = null;
  try {
    newTenant = await createTenantForUser(user.id, name);
  } catch (err) {
    console.warn("[createTenantAction] Database write error:", (err as Error).message);
  }

  // Fallback for local development if database is offline
  if (!newTenant && process.env.NODE_ENV !== "production") {
    const slug = (name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-")) || "restaurant";
    newTenant = {
      id: "local-tenant-" + Date.now(),
      user_id: user.id,
      name,
      slug,
      created_at: new Date().toISOString(),
    };
  }

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

export async function saveTenantCustomizationAction(
  slug: string,
  data: {
    name?: string;
    logo?: string;
    currency?: string;
    cuisine?: string;
    phone?: string;
    address?: string;
    hours?: string;
    headline?: string;
    primaryColor?: string;
    secondaryColor?: string;
    buttonColor?: string;
    buttonTextColor?: string;
    cardColor?: string;
    backgroundColor?: string;
    textColor?: string;
    fontStyle?: string;
    animationOption?: string;
    theme?: string;
    menuProducts?: any[];
    menuCategories?: any[];
  }
) {
  try {
    const { saveTenantCustomization } = await import("@/lib/store-config");
    await saveTenantCustomization(slug, data);
    revalidatePath("/dashboard");
    revalidatePath("/");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (err) {
    console.error("[saveTenantCustomizationAction] Error:", err);
    return { success: false, error: "Failed to save customization." };
  }
}

export async function getTenantCustomizationAction(slug: string) {
  try {
    const { getTenantCustomization } = await import("@/lib/store-config");
    const data = await getTenantCustomization(slug);
    return { success: true, data };
  } catch (err) {
    console.error("[getTenantCustomizationAction] Error:", err);
    return { success: false, data: null };
  }
}

export async function deleteTenantAction(
  slug: string,
  passwordAttempt: string
): Promise<{ success: boolean; error?: string }> {
  if (!slug) {
    return { success: false, error: "Restaurant slug is required." };
  }

  if (!passwordAttempt || !passwordAttempt.trim()) {
    return { success: false, error: "Please enter your password to confirm deletion." };
  }

  const user = await requireUser();

  const { verifyUserPassword } = await import("@/lib/auth");
  const isPasswordValid = await verifyUserPassword(user.id, user.email, passwordAttempt.trim());

  if (!isPasswordValid) {
    return {
      success: false,
      error: "Incorrect password. Please verify your credentials and try again.",
    };
  }

  try {
    const { deleteTenantBySlug } = await import("@/lib/tenant/repository");
    await deleteTenantBySlug(slug, user.id);
  } catch (err) {
    console.warn("[deleteTenantAction] DB delete warning:", err);
  }

  try {
    const { deleteTenantCustomization } = await import("@/lib/store-config");
    await deleteTenantCustomization(slug);
  } catch {
    // Ignore if not present
  }

  revalidatePath("/dashboard");
  revalidatePath("/");

  return { success: true };
}


