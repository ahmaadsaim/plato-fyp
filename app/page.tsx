import React from "react";
import { resolveTenant } from "@/lib/tenant";
import { getSessionUser } from "@/lib/auth";
import { getStoreConfigForTenant } from "@/lib/store-config";
import { TenantWebsite } from "@/components/tenant/TenantWebsite";
import { PlatformLanding } from "@/components/platform/landing/PlatformLanding";

interface HomePageProps {
  searchParams?: Promise<{ tenant?: string }>;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage(props: HomePageProps) {
  const searchParams = props.searchParams ? await props.searchParams : {};

  // 1. Resolve tenant from hostname or query param override
  let tenant = await resolveTenant();
  if (!tenant && searchParams?.tenant) {
    tenant = await resolveTenant(searchParams.tenant);
  }

  // 2. If tenant resolved, render the public tenant website using the template (NO LOGIN REQUIRED)
  if (tenant) {
    const storeConfig = await getStoreConfigForTenant(tenant.slug, tenant.name);
    return <TenantWebsite tenant={tenant} initialConfig={storeConfig} />;
  }

  // 3. Otherwise, render the platform landing page.
  const user = await getSessionUser();
  return <PlatformLanding user={user} />;
}