import React from "react";
import { requireUser } from "@/lib/auth";
import { CreateRestaurantView } from "@/components/dashboard/CreateRestaurantView";

export default async function CreateRestaurantPage() {
  await requireUser();
  return <CreateRestaurantView />;
}
