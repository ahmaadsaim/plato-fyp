import nextEnv from "@next/env";
import { Client } from "pg";
import { neonConnectionString } from "../lib/db/connection-config.mjs";

// npm runs predev in a fresh process before starting Next.js.
nextEnv.loadEnvConfig(process.cwd(), !process.argv.includes("--production") && process.env.NODE_ENV !== "production");

async function connectDb() {
  const connectionString = neonConnectionString(process.env.DATABASE_URL);
  const url = new URL(connectionString);
  if (!process.env.AUTH_SECRET) {
    throw new Error("AUTH_SECRET is required. Set a random session secret in your server environment.");
  }

  let client;
  try {
    client = new Client({ connectionString, connectionTimeoutMillis: 30000 });
    await client.connect();
    await client.query("SELECT 1");
    await client.query("SELECT id, name, email, password_hash FROM public.users LIMIT 0");
    await client.query("SELECT id, user_id, name, slug, theme_id, theme_source FROM public.tenants LIMIT 0");
    await client.query("SELECT id, tenant_id, tokens_override, layout_override FROM public.theme_overrides LIMIT 0");
    console.log(`[database] Connected successfully: ${url.hostname}`);
    console.log("[database] App tables verified; signup and login use Neon.");
  } catch (error) {
    const code = typeof error?.code === "string" && /^[A-Z0-9_]+$/.test(error.code)
      ? ` (${error.code})` : "";
    throw new Error(`Database check failed${code}. Check your connection and run npm run db:migrate if tables are missing.`);
  } finally {
    if (client) await client.end().catch(() => {});
  }
}

try {
  await connectDb();
} catch (error) {
  console.error(`[database] ${error.message}`);
  console.error("[database] Server was not started.");
  process.exitCode = 1;
}
