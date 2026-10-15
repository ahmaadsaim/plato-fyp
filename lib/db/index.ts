import { Pool } from "pg";
import { neonConnectionString } from "./connection-config.mjs";

const globalForDb = globalThis as unknown as {
  pgPool?: Pool;
  pgPoolConnectionString?: string;
};
const poolState: typeof globalForDb = process.env.NODE_ENV === "production" ? {} : globalForDb;

// Give idle Neon compute time to wake up and bound connections per instance.
function getPool(): Pool {
  const connectionString = neonConnectionString(process.env.DATABASE_URL);

  if (!poolState.pgPool || poolState.pgPoolConnectionString !== connectionString) {
    const oldPool = poolState.pgPool;
    poolState.pgPool = new Pool({
      connectionString,
      max: 5,
      connectionTimeoutMillis: 30000,
      idleTimeoutMillis: 10000,
    });
    poolState.pgPoolConnectionString = connectionString;
    poolState.pgPool.on("error", () => {
      console.error("An idle database connection failed. Check Neon connectivity.");
    });
    if (oldPool) {
      void oldPool.end().catch(() => {
        console.error("Could not close the previous database connection pool.");
      });
    }
  }
  return poolState.pgPool;
}

export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const result = await getPool().query(text, params);
  return result.rows as T[];
}

export async function queryOne<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}
