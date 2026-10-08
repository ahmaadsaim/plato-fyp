import fs from "node:fs";
import path from "node:path";
import { Pool } from "pg";

if (typeof globalThis.AggregateError === "function") {
  const OriginalAggregateError = globalThis.AggregateError;
  const patchedFlag = "__plato_aggregate_patched__";
  if (!(OriginalAggregateError as unknown as Record<string, boolean>)[patchedFlag]) {
    class SafeAggregateError extends OriginalAggregateError {
      constructor(errors: Iterable<unknown> | null | undefined, message?: string, options?: unknown) {
        super(errors ?? [], message, options as ErrorOptions);
      }
    }
    Object.defineProperty(SafeAggregateError, patchedFlag, { value: true });
    globalThis.AggregateError = SafeAggregateError as unknown as AggregateErrorConstructor;
  }
}

const globalForDb = globalThis as unknown as {
  pgPool: Pool | undefined;
};

export const pool =
  globalForDb.pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: process.env.NODE_ENV === "production" ? 5000 : 1000,
  });

pool.on("error", () => {
  // Silence idle connection drop/refusal errors when PostgreSQL is offline
});

if (process.env.NODE_ENV !== "production") {
  globalForDb.pgPool = pool;
}

async function ensureDatabaseSchema() {
  if (!process.env.DATABASE_URL) {
    return;
  }

  try {
    const schemaPath = path.join(process.cwd(), "lib", "schema.sql");
    const schemaSql = fs.readFileSync(schemaPath, "utf8");
    await pool.query(schemaSql);
  } catch {
    // Ignore startup migration failures during local/offline development.
  }
}

void ensureDatabaseSchema();

interface InMemoryUser {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
}

interface InMemoryTenant {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  theme_id: string;
  theme_source: string;
  created_at: string;
}

const globalForStore = globalThis as unknown as {
  __platoMemoryStore?: {
    users: InMemoryUser[];
    tenants: InMemoryTenant[];
  };
};

const memoryStore = globalForStore.__platoMemoryStore ?? {
  users: [
    {
      id: "demo-merchant-0001",
      name: "Saim (Store Owner)",
      email: "demo@plato.local",
      password_hash: "",
      created_at: new Date().toISOString(),
    },
    {
      id: "demo-merchant-0001",
      name: "Saim (Store Owner)",
      email: "admin@plato.local",
      password_hash: "",
      created_at: new Date().toISOString(),
    },
  ],
  tenants: [
    {
      id: "demo-tenant-pizza-house",
      user_id: "demo-merchant-0001",
      name: "Pizza House",
      slug: "pizza-house",
      theme_id: "modern",
      theme_source: "LOCAL",
      created_at: new Date().toISOString(),
    },
    {
      id: "demo-tenant-burger-craft",
      user_id: "demo-merchant-0001",
      name: "Burger Craft",
      slug: "burger-craft",
      theme_id: "burger-craft",
      theme_source: "LOCAL",
      created_at: new Date().toISOString(),
    },
  ],
};

if (process.env.NODE_ENV !== "production") {
  globalForStore.__platoMemoryStore = memoryStore;
}

function executeOfflineQuery<T>(text: string, params?: unknown[]): T[] {
  const normalized = text.trim().toLowerCase();

  if (normalized.includes("from users") && normalized.includes("email = $1")) {
    const email = String(params?.[0] || "").toLowerCase();
    const user = memoryStore.users.find((u) => u.email.toLowerCase() === email);
    return user ? ([user] as unknown as T[]) : [];
  }

  if (normalized.includes("from users") && normalized.includes("id = $1")) {
    const id = String(params?.[0] || "");
    const user = memoryStore.users.find((u) => u.id === id);
    if (user) return [user] as unknown as T[];
    return [
      {
        id,
        name: "Merchant Admin",
        email: "demo@plato.local",
        created_at: new Date().toISOString(),
      },
    ] as unknown as T[];
  }

  if (normalized.startsWith("insert into users")) {
    const name = String(params?.[0] || "User");
    const email = String(params?.[1] || "user@plato.local");
    const password_hash = String(params?.[2] || "");
    const newUser: InMemoryUser = {
      id: "user-" + Date.now(),
      name,
      email,
      password_hash,
      created_at: new Date().toISOString(),
    };
    memoryStore.users.push(newUser);
    return [newUser] as unknown as T[];
  }

  if (normalized.includes("from tenants") && normalized.includes("user_id = $1")) {
    const userId = String(params?.[0] || "");
    const list = memoryStore.tenants
      .filter((t) => t.user_id === userId || t.user_id === "demo-merchant-0001")
      .map((t) => ({ ...t, theme_id: t.theme_id || "modern", theme_source: t.theme_source || "LOCAL" }));
    return list as unknown as T[];
  }

  if (normalized.includes("from tenants") && normalized.includes("slug = $1")) {
    const slug = String(params?.[0] || "").toLowerCase();
    const tenant = memoryStore.tenants.find((t) => t.slug === slug);
    return tenant
      ? ([{ ...tenant, theme_id: tenant.theme_id || "modern", theme_source: tenant.theme_source || "LOCAL" }] as unknown as T[])
      : [];
  }

  if (normalized.startsWith("update tenants set theme_id")) {
    const theme_id = String(params?.[0] || "modern");
    const theme_source = String(params?.[1] || "LOCAL");
    const slug = String(params?.[2] || "").toLowerCase();
    const tenant = memoryStore.tenants.find((t) => t.slug === slug);
    if (tenant) {
      tenant.theme_id = theme_id;
      tenant.theme_source = theme_source;
      return [{ id: tenant.id, theme_id: tenant.theme_id, theme_source: tenant.theme_source }] as unknown as T[];
    }
    return [];
  }

  if (normalized.startsWith("delete from tenants")) {
    const slug = String(params?.[0] || "").toLowerCase();
    const idx = memoryStore.tenants.findIndex((t) => t.slug === slug);
    if (idx !== -1) {
      const removed = memoryStore.tenants.splice(idx, 1)[0];
      return [{ id: removed.id }] as unknown as T[];
    }
    return [];
  }

  if (normalized.startsWith("insert into tenants")) {
    const user_id = String(params?.[0] || "demo-merchant-0001");
    const name = String(params?.[1] || "My Restaurant");
    const slug = String(params?.[2] || "my-restaurant").toLowerCase();
    const theme_id = String(params?.[3] || "modern");
    const theme_source = String(params?.[4] || "LOCAL");
    const newTenant: InMemoryTenant = {
      id: "tenant-" + Date.now(),
      user_id,
      name,
      slug,
      theme_id,
      theme_source,
      created_at: new Date().toISOString(),
    };
    memoryStore.tenants.push(newTenant);
    return [newTenant] as unknown as T[];
  }

  if (normalized.includes("from theme_overrides") && normalized.includes("tenant_id = $1")) {
    return [] as unknown as T[];
  }

  return [];
}

let dbOffline = false;
let lastFailure = 0;

export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const now = Date.now();
  if (dbOffline && now - lastFailure < 60000) {
    return executeOfflineQuery<T>(text, params);
  }

  try {
    const result = await pool.query(text, params);
    dbOffline = false;
    return result.rows as T[];
  } catch {
    dbOffline = true;
    lastFailure = Date.now();
    return executeOfflineQuery<T>(text, params);
  }
}

export async function queryOne<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T | null> {
  try {
    const rows = await query<T>(text, params);
    return rows[0] ?? null;
  } catch {
    return null;
  }
}
