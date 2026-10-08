"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { getTenantUrl } from "@/lib/platform";
import { createTenantForUser, getTenantBySlugForUser, normalizeThemeSource, updateTenantTheme } from "@/lib/tenant/repository";
import { getTenantCustomization, saveTenantCustomization } from "@/lib/store-config";

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

type StoreMenuProduct = {
  id: string | number;
  name: string;
  description: string;
  price: number;
  category: string | number;
  image: string;
  isAvailable?: boolean;
  badge?: string;
  dietary?: string[];
};

type StoreMenuCategory = {
  id: string | number;
  name: string;
};

export async function createTenantAction(
  _prevState: TenantActionState | null,
  formData: FormData
): Promise<TenantActionState> {
  const user = await requireUser();
  const name = (formData.get("name") as string)?.trim();
  const rawThemeId = ((formData.get("themeId") || formData.get("theme")) as string)?.trim() || "modern";
  const rawThemeSource = ((formData.get("themeSource") as string)?.trim() || "LOCAL").toUpperCase();

  if (!name) {
    return { error: "Restaurant name is required." };
  }

  try {
    const newTenant = await createTenantForUser(user.id, name, rawThemeId, rawThemeSource);
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
  } catch (err) {
    console.warn("[createTenantAction] Database write error:", (err as Error).message);
    return { error: "Failed to create restaurant. Please try again." };
  }
}

export async function updateTenantThemeAction(
  slug: string,
  themeId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requireUser();
    const { isValidTheme } = await import("@/lib/theme/repository");
    const valid = await isValidTheme(themeId);
    if (!valid) {
      return { success: false, error: `Invalid theme ID "${themeId}". Theme does not exist.` };
    }

    const tenant = await getTenantBySlugForUser(slug, user.id);
    if (!tenant) {
      return { success: false, error: "Tenant not found or not owned by this user." };
    }

    await updateTenantTheme(slug, themeId, user.id, normalizeThemeSource("LOCAL"));
    await saveTenantCustomization(slug, { themeId, theme: themeId, themeSource: "LOCAL" });

    revalidatePath("/dashboard");
    revalidatePath("/");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (err) {
    console.error("[updateTenantThemeAction] Error:", err);
    return { success: false, error: "Failed to update theme selection." };
  }
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
    themeId?: string;
    themeSource?: string;
    menuProducts?: StoreMenuProduct[];
    menuCategories?: StoreMenuCategory[];
  }
) {
  try {
    const user = await requireUser();
    const tenant = await getTenantBySlugForUser(slug, user.id);
    if (!tenant) {
      return { success: false, error: "Tenant not found or not owned by this user." };
    }

    const selectedTheme = data.themeId || data.theme || tenant.theme_id || "modern";
    if (selectedTheme) {
      const { isValidTheme } = await import("@/lib/theme/repository");
      const valid = await isValidTheme(selectedTheme);
      if (!valid) {
        return { success: false, error: `Invalid theme ID "${selectedTheme}". Theme does not exist.` };
      }
    }

    await saveTenantCustomization(slug, {
      ...data,
      themeId: selectedTheme,
      theme: selectedTheme,
      themeSource: normalizeThemeSource(data.themeSource || "LOCAL"),
    });
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
    const user = await requireUser();
    const tenant = await getTenantBySlugForUser(slug, user.id);
    if (!tenant) {
      return { success: false, data: null };
    }

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
  const tenant = await getTenantBySlugForUser(slug, user.id);
  if (!tenant) {
    return { success: false, error: "Tenant not found or not owned by this user." };
  }

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

  revalidatePath("/dashboard");
  revalidatePath("/");

  return { success: true };
}


