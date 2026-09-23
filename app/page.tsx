import React from "react";
import { resolveTenant } from "@/lib/tenant";
import { getSessionUser } from "@/lib/auth";
import { TenantWebsite } from "@/components/tenant/TenantWebsite";
import { PlatformLanding } from "@/components/platform/PlatformLanding";

export default async function HomePage() {
  // 1. Resolve tenant from the request hostname.
  const tenant = await resolveTenant();

  // 2. If tenant resolved from hostname, render the public tenant website (NO LOGIN REQUIRED)
  if (tenant) {
    return <TenantWebsite tenant={tenant} />;
  }

  // 3. Otherwise, render the platform landing page.
  const user = await getSessionUser();
  return <PlatformLanding user={user} />;
}