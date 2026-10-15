import nextEnv from "@next/env";
import { Client } from "pg";
import { neonConnectionString } from "../lib/db/connection-config.mjs";

nextEnv.loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production");
let client;
try {
  client = new Client({ connectionString: neonConnectionString(process.env.DATABASE_URL), connectionTimeoutMillis: 30000 });
  await client.connect();
  const result = await client.query(`SELECT 'users' AS table_name, COUNT(*) FROM users
    UNION ALL SELECT 'tenants', COUNT(*) FROM tenants
    UNION ALL SELECT 'theme_overrides', COUNT(*) FROM theme_overrides`);
  console.table(result.rows);
  console.log("Database connection and current schema verified.");
} catch (error) {
  console.error("Database check failed (credentials omitted):", error.code || "connection/schema/configuration error");
  process.exitCode = 1;
} finally {
  if (client) await client.end().catch(() => {});
}
