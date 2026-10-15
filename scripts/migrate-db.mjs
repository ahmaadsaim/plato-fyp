import fs from "node:fs";
import path from "node:path";
import { Client } from "pg";
import nextEnv from "@next/env";
import { neonConnectionString } from "../lib/db/connection-config.mjs";

nextEnv.loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production");

const schemaPath = path.join(process.cwd(), "lib", "schema.sql");
const schemaSql = fs.readFileSync(schemaPath, "utf8");

let client;

try {
  const variableName = process.env.DATABASE_URL_UNPOOLED ? "DATABASE_URL_UNPOOLED" : "DATABASE_URL";
  const connectionString = neonConnectionString(process.env[variableName], variableName);
  client = new Client({ connectionString, connectionTimeoutMillis: 30000 });
  await client.connect();
  await client.query("BEGIN");
  await client.query(schemaSql);
  await client.query("COMMIT");
  console.log("Database migration complete: lib/schema.sql applied successfully.");
} catch (error) {
  if (client) await client.query("ROLLBACK").catch(() => {});
  console.error("Migration failed (credentials omitted):", error.code || "connection/schema/configuration error");
  process.exitCode = 1;
} finally {
  if (client) await client.end().catch(() => {});
}
