import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { createTenantForUser } from "@/lib/tenant/repository";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tenants = await query(
    "SELECT id, user_id, name, slug, created_at FROM tenants WHERE user_id = $1 ORDER BY created_at DESC",
    [user.id]
  );

  return NextResponse.json({ tenants });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const name =
    typeof body === "object" && body !== null && "name" in body && typeof body.name === "string"
      ? body.name.trim()
      : "";

  if (!name) {
    return NextResponse.json({ error: "Restaurant name is required" }, { status: 400 });
  }

  const tenant = await createTenantForUser(user.id, name);

  if (!tenant) {
    return NextResponse.json({ error: "Failed to create tenant" }, { status: 500 });
  }

  return NextResponse.json({ tenant }, { status: 201 });
}