import React from "react";
import { requireUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { Tenant } from "@/lib/tenant";
import { DashboardView } from "@/components/platform/dashboard/DashboardView";
import { getPlatformDomain } from "@/lib/platform";

export default async function DashboardPage() {
  const user = await requireUser();

  let tenants: Tenant[] = [];
  try {
    tenants = await query<Tenant>(
      "SELECT id, user_id, name, slug, created_at FROM tenants WHERE user_id = $1 ORDER BY created_at DESC",
      [user.id]
    );
  } catch (err) {
    console.warn("[DashboardPage] Database query skipped (offline mode):", (err as Error).message);
    tenants = [];
  }

  return (
    <DashboardView
      user={user}
      initialTenants={tenants}
      platformDomain={getPlatformDomain()}
      platformProtocol={process.env.NODE_ENV === "production" ? "https" : "http"}
    />
  );
}
