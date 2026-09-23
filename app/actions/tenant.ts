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

  const newTenant = await createTenantForUser(user.id, name);

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
