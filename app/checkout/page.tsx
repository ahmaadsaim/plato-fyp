import React from "react";
import { resolveTenant } from "@/lib/tenant";
import { getStoreConfigForTenant } from "@/lib/store-config";
import CheckoutClient from "@/components/tenant/CheckoutClient";

export const dynamic = "force-dynamic";

interface CheckoutPageProps {
  searchParams?: Promise<{ tenant?: string }>;
}

export default async function CheckoutPage(props: CheckoutPageProps) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  let tenant = await resolveTenant();

  if (!tenant && searchParams?.tenant) {
    tenant = await resolveTenant(searchParams.tenant);
  }

  const slug = tenant?.slug || "holy-buns";
  const name = tenant?.name || "Holy Buns";
  const config = await getStoreConfigForTenant(slug, name);

  return <CheckoutClient initialConfig={config} />;
}
