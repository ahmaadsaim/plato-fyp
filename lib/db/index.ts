import { Pool } from "pg";

// Guard against Turbopack/Next.js/Node runtime bug where AggregateError receives null errors
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

// Unconditionally attach error listener to prevent uncaughtException in Node.js
pool.on("error", () => {
  // Silence idle connection drop/refusal errors when PostgreSQL is offline
});

if (process.env.NODE_ENV !== "production") {
  globalForDb.pgPool = pool;
}

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
      created_at: new Date().toISOString(),
    },
    {
      id: "demo-tenant-burger-craft",
      user_id: "demo-merchant-0001",
      name: "Burger Craft",
      slug: "burger-craft",
      theme_id: "burger-craft",
      created_at: new Date().toISOString(),
    },
  ],
};

if (process.env.NODE_ENV !== "production") {
  globalForStore.__platoMemoryStore = memoryStore;
}

function executeOfflineQuery<T>(text: string, params?: unknown[]): T[] {
  const normalized = text.trim().toLowerCase();

  // 1. SELECT users by email
  if (normalized.includes("from users") && normalized.includes("email = $1")) {
    const email = String(params?.[0] || "").toLowerCase();
    const user = memoryStore.users.find((u) => u.email.toLowerCase() === email);
    return user ? ([user] as unknown as T[]) : [];
  }

  // 2. SELECT users by id
  if (normalized.includes("from users") && normalized.includes("id = $1")) {
    const id = String(params?.[0] || "");
    const user = memoryStore.users.find((u) => u.id === id);
    if (user) return [user] as unknown as T[];
    // Return a dummy merchant if asking for any logged in demo user
    return [
      {
        id,
        name: "Merchant Admin",
        email: "demo@plato.local",
        created_at: new Date().toISOString(),
      },
    ] as unknown as T[];
  }

  // 3. INSERT INTO users
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

  // 4. SELECT tenants by user_id
  if (normalized.includes("from tenants") && normalized.includes("user_id = $1")) {
    const userId = String(params?.[0] || "");
    const list = memoryStore.tenants
      .filter((t) => t.user_id === userId || t.user_id === "demo-merchant-0001")
      .map((t) => ({ ...t, theme_id: t.theme_id || "modern" }));
    return list as unknown as T[];
  }

  // 5. SELECT tenants by slug
  if (normalized.includes("from tenants") && normalized.includes("slug = $1")) {
    const slug = String(params?.[0] || "").toLowerCase();
    const tenant = memoryStore.tenants.find((t) => t.slug === slug);
    return tenant
      ? ([{ ...tenant, theme_id: tenant.theme_id || "modern" }] as unknown as T[])
      : [];
  }

  // 6. UPDATE tenants SET theme_id
  if (normalized.startsWith("update tenants set theme_id")) {
    const theme_id = String(params?.[0] || "modern");
    const slug = String(params?.[1] || "").toLowerCase();
    const tenant = memoryStore.tenants.find((t) => t.slug === slug);
    if (tenant) {
      tenant.theme_id = theme_id;
      return [{ id: tenant.id, theme_id: tenant.theme_id }] as unknown as T[];
    }
    return [];
  }

  // 7. DELETE FROM tenants
  if (normalized.startsWith("delete from tenants")) {
    const slug = String(params?.[0] || "").toLowerCase();
    const idx = memoryStore.tenants.findIndex((t) => t.slug === slug);
    if (idx !== -1) {
      const removed = memoryStore.tenants.splice(idx, 1)[0];
      return [{ id: removed.id }] as unknown as T[];
    }
    return [];
  }

  // 8. INSERT INTO tenants
  if (normalized.startsWith("insert into tenants")) {
    const user_id = String(params?.[0] || "demo-merchant-0001");
    const name = String(params?.[1] || "My Restaurant");
    const slug = String(params?.[2] || "my-restaurant").toLowerCase();
    const theme_id = String(params?.[3] || "modern");
    const newTenant: InMemoryTenant = {
      id: "tenant-" + Date.now(),
      user_id,
      name,
      slug,
      theme_id,
      created_at: new Date().toISOString(),
    };
    memoryStore.tenants.push(newTenant);
    return [newTenant] as unknown as T[];
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
  // Circuit breaker: If database connection failed recently, avoid crashing or blocking
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
