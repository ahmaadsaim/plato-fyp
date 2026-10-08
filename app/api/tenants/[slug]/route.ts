import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { getTenantBySlugForUser, updateTenantTheme, upsertTenantThemeOverride } from "@/lib/tenant/repository";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const tenant = await getTenantBySlugForUser(slug, user.id);
  if (!tenant) {
    return NextResponse.json({ error: "Tenant not found or access denied" }, { status: 404 });
  }

  return NextResponse.json({ tenant });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const tenant = await getTenantBySlugForUser(slug, user.id);
  if (!tenant) {
    return NextResponse.json({ error: "Tenant not found or access denied" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const payload = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const nextThemeId = typeof payload.themeId === "string" ? payload.themeId.trim() : tenant.theme_id;
  const nextThemeSource = typeof payload.themeSource === "string" ? payload.themeSource : "LOCAL";

  if (nextThemeId) {
    await updateTenantTheme(slug, nextThemeId, user.id, nextThemeSource);
  }

  if (payload.tokensOverride || payload.layoutOverride) {
    await upsertTenantThemeOverride(tenant.id, {
      tokensOverride: payload.tokensOverride as Record<string, unknown> | undefined,
      layoutOverride: payload.layoutOverride as Record<string, unknown> | undefined,
    });
  }

  return NextResponse.json({ success: true, tenant: { ...tenant, theme_id: nextThemeId, theme_source: nextThemeSource } });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const tenant = await getTenantBySlugForUser(slug, user.id);

  if (!tenant) {
    return NextResponse.json({ error: "Tenant not found or access denied" }, { status: 404 });
  }

  await query("DELETE FROM tenants WHERE id = $1 AND user_id = $2", [tenant.id, user.id]);

  return new NextResponse(null, { status: 204 });
}