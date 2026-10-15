/** Validate server-only Neon configuration without exposing credentials in errors. */
export function neonConnectionString(value, variableName = "DATABASE_URL") {
  if (!value) {
    throw new Error(`${variableName} is required. Configure the Neon connection URL.`);
  }

  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${variableName} must be a valid PostgreSQL connection URL.`);
  }

  if (!["postgres:", "postgresql:"].includes(url.protocol) || !url.hostname.endsWith(".neon.tech")) {
    throw new Error(`${variableName} must point to Neon PostgreSQL. Local databases are not supported by the app.`);
  }

  const sslMode = url.searchParams.get("sslmode");
  if (sslMode && !["require", "verify-ca", "verify-full"].includes(sslMode)) {
    throw new Error(`${variableName} must require SSL.`);
  }
  if (!sslMode) url.searchParams.set("sslmode", "require");
  return url.toString();
}
