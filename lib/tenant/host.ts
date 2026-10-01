import { getPlatformDomain } from "@/lib/platform";

function stripPort(host: string): string {
  return host.split(":")[0].toLowerCase().trim();
}

/** Extracts a tenant slug from local or production platform subdomains. */
export function extractSlugFromHost(host: string): string | null {
  if (!host) return null;

  const currentHost = stripPort(host);
  const platformHost = stripPort(getPlatformDomain());
  const suffix = `.${platformHost}`;

  if (!currentHost.endsWith(suffix)) return null;

  const subdomain = currentHost.slice(0, -suffix.length).trim();
  if (!subdomain || subdomain === "www" || subdomain.includes(".")) {
    return null;
  }

  return subdomain;
}