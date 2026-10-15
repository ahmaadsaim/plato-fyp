import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";
import { neonConnectionString } from "../lib/db/connection-config.mjs";
import bcrypt from "bcryptjs";
import * as jose from "jose";

function loadModule(filename, imports, env = {}) {
  const output = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText;
  const exports = {};
  vm.runInNewContext(output, {
    exports,
    require(name) {
      if (name === "./connection-config.mjs") return { neonConnectionString };
      assert.ok(name in imports, `Unexpected import: ${name}`);
      return imports[name];
    },
    process: { env },
    console,
    TextEncoder,
  });
  return exports;
}

test("database errors propagate and subsequent requests retry PostgreSQL", async () => {
  let attempts = 0;
  let options;
  class Pool {
    constructor(config) { options = config; }
    on() {}
    async query() {
      attempts++;
      if (attempts === 1) throw new Error("database unavailable");
      return { rows: [{ id: "real-user" }] };
    }
  }
  const db = loadModule("lib/db/index.ts", { pg: { Pool } }, { DATABASE_URL: "postgresql://example.neon.tech/db?sslmode=require" });
  assert.equal(attempts, 0, "import must not apply schema");
  await assert.rejects(db.query("SELECT id FROM users"), /database unavailable/);
  assert.equal(options.connectionTimeoutMillis, 30000);
  assert.equal((await db.queryOne("SELECT id FROM users")).id, "real-user");
  assert.equal(attempts, 2);
});

test("missing database URL never attempts an implicit localhost connection", async () => {
  class Pool {
    on() {}
    query() { assert.fail("Must not connect without DATABASE_URL"); }
  }
  const db = loadModule("lib/db/index.ts", { pg: { Pool } });
  await assert.rejects(db.queryOne("SELECT 1"), /DATABASE_URL is required/);
});

test("changing the loaded URL replaces the pool and does not reuse an old connection", async () => {
  const connections = [];
  let closed = 0;
  class Pool {
    constructor(config) { this.url = config.connectionString; connections.push(this.url); }
    on() {}
    async end() { closed++; }
    async query() {
      if (this.url.includes("invalid.neon.tech")) throw new Error("invalid connection");
      return { rows: [{ id: "real-user" }] };
    }
  }
  const env = { DATABASE_URL: "postgresql://working.neon.tech/db?sslmode=require" };
  const db = loadModule("lib/db/index.ts", { pg: { Pool } }, env);
  await db.query("SELECT 1");
  env.DATABASE_URL = "postgresql://invalid.neon.tech/db?sslmode=require";
  await assert.rejects(db.query("SELECT 1"), /invalid connection/);
  assert.deepEqual(connections, ["postgresql://working.neon.tech/db?sslmode=require", "postgresql://invalid.neon.tech/db?sslmode=require"]);
  assert.equal(closed, 1);
});

test("Neon configuration rejects local databases and insecure SSL without leaking secrets", () => {
  assert.throws(() => neonConnectionString("postgresql://user:private-password@localhost:5432/plato"), /must point to Neon/);
  assert.throws(() => neonConnectionString("postgresql://example.neon.tech/db?sslmode=disable"), /must require SSL/);
  assert.throws(() => neonConnectionString("private-password"), /valid PostgreSQL connection URL/);
  assert.equal(new URL(neonConnectionString("postgresql://example.neon.tech/db")).searchParams.get("sslmode"), "require");
});

function authActions(queryOne) {
  let sessions = 0;
  const actions = loadModule("app/actions/auth.ts", {
    "next/navigation": { redirect() { assert.fail("Must not redirect without authenticated user"); } },
    "@/lib/db": { queryOne },
    "@/lib/auth": {
      hashPassword: async () => "hash",
      verifyPassword: async () => false,
      createSession: async () => { sessions++; },
      destroySession: async () => {},
    },
  });
  return { actions, sessions: () => sessions };
}

test("signup database failure does not manufacture a local session", async () => {
  const { actions, sessions } = authActions(async () => { throw new Error("offline"); });
  const form = new FormData();
  form.set("name", "Test User"); form.set("email", "test@example.com"); form.set("password", "secret123");
  assert.ok((await actions.signupAction(null, form)).error);
  assert.equal(sessions(), 0);
});

test("previous demo credentials require a real database user", async () => {
  let queried = false;
  const { actions, sessions } = authActions(async () => { queried = true; return null; });
  const form = new FormData();
  form.set("email", "demo@plato.local"); form.set("password", "plato123");
  assert.ok((await actions.loginAction(null, form)).error);
  assert.equal(queried, true);
  assert.equal(sessions(), 0);
});

test("password confirmation rejects fallback passwords and database outages", async () => {
  const auth = loadModule("lib/auth/index.ts", {
    bcryptjs: { compare: async () => false },
    jose: {},
    "next/headers": {},
    "next/navigation": {},
    "@/lib/db": { queryOne: async () => { throw new Error("offline"); } },
  });
  assert.equal(await auth.verifyUserPassword("user-id", "user@example.com", "admin123"), false);
});

test("sessions require a configured secret rather than a development fallback", async () => {
  const auth = loadModule("lib/auth/index.ts", {
    bcryptjs: {},
    jose: { SignJWT: class {
      setSubject() { return this; }
      setProtectedHeader() { return this; }
      setIssuedAt() { return this; }
      setExpirationTime() { return this; }
      sign() { assert.fail("Must not sign without AUTH_SECRET"); }
    } },
    "next/headers": {},
    "next/navigation": {},
    "@/lib/db": {},
  });
  await assert.rejects(auth.createSession({ id: "user", name: "Test", email: "test@example.com" }), /AUTH_SECRET must be configured/);
});

test("signup hashes the database insert and login validates the stored hash before a session", async () => {
  const user = { id: "database-user-id", name: "Test User", email: "test@example.com" };
  let storedHash;
  let cookie;
  const cookieStore = {
    set(name, value, options) { cookie = { name, value, options }; },
    get() { return cookie ? { value: cookie.value } : undefined; },
    delete() { cookie = undefined; },
  };
  const redirect = () => { throw Object.assign(new Error("redirect"), { digest: "NEXT_REDIRECT;replace;/dashboard;303;" }); };
  const queryOne = async (sql, params) => {
    if (sql.startsWith("SELECT id FROM users")) return null;
    if (sql.startsWith("INSERT INTO users")) {
      assert.equal(params[1], user.email);
      storedHash = params[2];
      return user;
    }
    return storedHash ? { ...user, password_hash: storedHash } : null;
  };
  const auth = loadModule("lib/auth/index.ts", {
    bcryptjs: bcrypt,
    jose,
    "next/headers": { cookies: async () => cookieStore },
    "next/navigation": { redirect },
    "@/lib/db": { queryOne },
  }, { AUTH_SECRET: "test-only-random-session-secret" });
  const actions = loadModule("app/actions/auth.ts", {
    "next/navigation": { redirect },
    "@/lib/db": { queryOne },
    "@/lib/auth": auth,
  });
  const form = new FormData();
  form.set("name", user.name); form.set("email", " TEST@EXAMPLE.COM "); form.set("password", "secret123");
  await assert.rejects(actions.signupAction(null, form), /redirect/);
  assert.notEqual(storedHash, "secret123");
  assert.equal(await bcrypt.compare("secret123", storedHash), true);
  assert.equal(cookie.options.httpOnly, true);
  assert.equal((await auth.getSessionUser()).id, user.id);
  await auth.destroySession();
  form.set("password", "incorrect");
  assert.equal((await actions.loginAction(null, form)).error, "Invalid email or password.");
  assert.equal(cookie, undefined);
  form.set("password", "secret123");
  await assert.rejects(actions.loginAction(null, form), /redirect/);
  assert.equal((await auth.getSessionUser()).id, user.id);
});

test("a valid session cookie cannot authenticate a user missing from the database", async () => {
  let token;
  const auth = loadModule("lib/auth/index.ts", {
    bcryptjs: bcrypt,
    jose,
    "next/headers": { cookies: async () => ({ set(_name, value) { token = value; }, get() { return { value: token }; } }) },
    "next/navigation": {},
    "@/lib/db": { queryOne: async () => null },
  }, { AUTH_SECRET: "test-only-random-session-secret" });
  await auth.createSession({ id: "deleted-user", name: "Deleted", email: "deleted@example.com" });
  assert.equal(await auth.getSessionUser(), null);
});
