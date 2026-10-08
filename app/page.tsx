import React from "react";
import { resolveTenant } from "@/lib/tenant";
import { getSessionUser } from "@/lib/auth";
import { getStorefrontData } from "@/storefront/data/storefrontData";
import { Storefront } from "@/storefront/Storefront";
import { PlatformLanding } from "@/components/platform/landing/PlatformLanding";

interface HomePageProps {
  searchParams?: Promise<{ tenant?: string }>;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage(props: HomePageProps) {
  const searchParams = props.searchParams ? await props.searchParams : {};

  // 1. Resolve tenant from hostname or query param override (in dev)
  let tenant = await resolveTenant();
  if (!tenant && searchParams?.tenant) {
    tenant = await resolveTenant(searchParams.tenant);
  }

  // 2. If tenant resolved, render the public tenant storefront (NO LOGIN REQUIRED)
  if (tenant) {
    const storefrontData = await getStorefrontData(
      tenant.id,
      tenant.slug,
      tenant.name,
      tenant.theme_id
    );
    return <Storefront data={storefrontData} />;
  }

  // 3. Otherwise, render the platform landing page.
  const user = await getSessionUser();
  return <PlatformLanding user={user} />;
}