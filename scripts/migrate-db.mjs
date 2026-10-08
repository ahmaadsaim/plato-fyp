import fs from "node:fs";
import path from "node:path";
import { Client } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is not set. Add it to your environment before running migrations.");
  process.exit(1);
}

const schemaPath = path.join(process.cwd(), "lib", "schema.sql");
const schemaSql = fs.readFileSync(schemaPath, "utf8");

const client = new Client({ connectionString });

try {
  await client.connect();
  await client.query(schemaSql);
  console.log("Database migration complete: lib/schema.sql applied successfully.");
} catch (error) {
  console.error("Migration failed:", error);
  process.exitCode = 1;
} finally {
  await client.end();
}
