import React from "react";
import { requireUser } from "@/lib/auth";
import { CreateRestaurantView } from "@/components/platform/dashboard/CreateRestaurantView";

export default async function CreateRestaurantPage() {
  await requireUser();
  return <CreateRestaurantView />;
}
