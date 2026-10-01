const DEFAULT_PLATFORM_DOMAIN = "localhost:3000";

/** Returns the platform hostname, including an optional local development port. */
export function getPlatformDomain(): string {
  return (process.env.PLATFORM_DOMAIN || DEFAULT_PLATFORM_DOMAIN)
    .trim()
    .toLowerCase();
}

/** Builds the public URL for a tenant subdomain. */
export function getTenantUrl(slug: string): string {
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  return `${protocol}://${slug}.${getPlatformDomain()}`;
}