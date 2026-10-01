import { NextRequest, NextResponse } from "next/server";
import { getPlatformDomain } from "@/lib/platform";
import { extractSlugFromHost } from "@/lib/tenant/host";

export function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  // Strictly block any attempt to access tenants via /tenant/* path
  if (url.pathname.startsWith("/tenant")) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const subdomain = extractSlugFromHost(hostname);

  if (subdomain) {
    // Private routes must only be accessed from the platform domain.
    if (url.pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(
        new URL("/dashboard", `${url.protocol}//${getPlatformDomain()}`)
      );
    }

    // Public tenant website renders at "/".
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|_next/|_static/|[\\w-]+\\.\\w+).*)",
  ],
};
