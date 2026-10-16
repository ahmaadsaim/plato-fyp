# PLATO

PLATO is the official repository for a multi-tenant restaurant platform. It gives restaurant owners a platform account, creates a dedicated tenant for each restaurant, and serves each restaurant site from its own subdomain.

The application is built with Next.js, React, TypeScript, and PostgreSQL. Themes and page sections are data-driven so the presentation layer can evolve independently from tenant data.

## Requirements

- Node.js 20.9 or newer and npm
- PostgreSQL 14 or newer (local or hosted)

## Quick start

```bash
git clone https://github.com/ahmaadsaim/plato-fyp.git
cd plato-fyp
npm ci
cp .env.example .env.local
```

Edit `.env.local` (or `.env`) and set `DATABASE_URL`. The example config targets a local PostgreSQL database named `plato`. Create it if needed with `createdb plato`, then run the repeatable schema migration:

```bash
npm run db:migrate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). `.env.local` and `.env` are ignored by Git; do not commit database credentials or OAuth secrets. The migration command reads `.env.local` first, then `.env`, and respects environment variables already set by the shell or deployment platform.

### Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string. |
| `PLATFORM_DOMAIN` | Yes for tenant domains | Platform hostname without a protocol (local: `localhost:3000`). |
| `APP_URL` | For Google sign-in | Canonical app origin, e.g. `http://localhost:3000` or `https://platform.example.com`; must match the browser origin. |
| `GOOGLE_CLIENT_ID` | For Google sign-in | Google Cloud OAuth **Web application** client ID. |
| `GOOGLE_CLIENT_SECRET` | For Google sign-in | Server-only OAuth client secret. Never expose it with a `NEXT_PUBLIC_` variable. |

`GOOGLE_REDIRECT_URI` and `AUTH_SECRET` are not used by this implementation. The callback URI is derived from `APP_URL` and is always `/api/auth/google/callback`.

## Google sign-in setup

1. In [Google Cloud Console](https://console.cloud.google.com/), choose a project and configure the OAuth consent screen (app name, audience, support email, and contact details). If the audience is **External** and the app is in **Testing**, add each tester's Google account.
2. Create an OAuth client ID with application type **Web application**.
3. Under **Authorized redirect URIs**, add the exact callback URL:
   - Local development: `http://localhost:3000/api/auth/google/callback`
   - Production: `https://YOUR_PLATFORM_HOST/api/auth/google/callback`
4. If prompted, add corresponding **Authorized JavaScript origins**: `http://localhost:3000` and `https://YOUR_PLATFORM_HOST`. Origins have no path. Do not add tenant subdomains; OAuth returns to the platform host.
5. Copy the client ID and secret into `.env.local` for local work, or the hosting provider's secret manager for production. Set `APP_URL` to the matching origin. Do not commit secrets. Restart the development server after changing environment values.
6. Allow a few minutes for Google Console changes to propagate. The redirect URI must match exactly (scheme, host, port, path, and trailing slash).

The app uses a server-side authorization-code flow with PKCE, state, and OIDC nonce validation. Google identity is verified on the server; only verified email claims are accepted. If a verified Google email matches an existing password account, Google login links the identity and signs in to that same account. Google signup creates a passwordless account when no matching account exists. Google sign-in requires a reachable database and the schema migration below.

### Google OAuth troubleshooting

- `redirect_uri_mismatch`: inspect the `redirect_uri` parameter in Google's error details and add that exact URL under **Authorized redirect URIs**. For local setup it should be `http://localhost:3000/api/auth/google/callback`. Check that `APP_URL` has no extra path or trailing slash.
- `access_denied` / app unavailable to test users: add the account under the OAuth consent screen's test users, or publish/verify the consent screen as appropriate.
- Generic sign-in failure: check the Next.js server terminal for `[Google OAuth]` diagnostics. Never paste authorization codes, cookies, client secrets, or full token responses into issue reports.
- Google sign-in not configured: verify `APP_URL`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET` are present in the server environment; do not prefix the secret with `NEXT_PUBLIC_`.

## Database and migrations

The authoritative schema is `lib/schema.sql`. It creates/updates users, tenants, theme overrides, and opaque revocable sessions. The migration is safe to rerun and is required both on a fresh database and when upgrading an existing installation.

1. Create the PostgreSQL database (for example, `createdb plato`) and set `DATABASE_URL` in `.env.local` or the deployment environment.
2. Apply all schema changes using `npm run db:migrate`. The script loads `.env.local` or `.env` automatically for local development; deployment environments should inject `DATABASE_URL` as a secret/environment variable.
3. Back up production data before deploying a schema change. Apply the migration once as a deployment/release step before serving code that depends on the new schema. Check that the command reports `Database migration complete`.
4. If connection details change, update the environment and rerun the command. Do not manually edit production tables to match local assumptions.

The migration adds nullable password hashes (for Google-only accounts), a unique Google subject, and the `sessions` table. The app does not seed demo credentials; registration creates real database-backed accounts.

## Accounts, sessions, and access

- Register at `/signup` with name, email, and password, or use Google signup. Sign in at `/login` with email/password or a previously linked Google account.
- A password account with a matching Google-verified email is connected automatically at Google login; the same user record and dashboard data are retained. Email by itself is never trusted unless Google marks it verified.
- Sessions are random seven-day tokens in an `HttpOnly`, `SameSite=Lax` cookie. Only a SHA-256 token hash is stored in PostgreSQL. Login rotates sessions, logout revokes the server session, and protected dashboard routes require an active database session.
- If PostgreSQL is down, login/session validation fails closed. Restore the DB connection before authenticating; no demo or localStorage fallback is provided.

## Useful commands and routes

```bash
npm run dev        # Start local development server
npm run db:migrate # Apply the PostgreSQL schema (loads .env.local/.env)
npm run lint       # Run ESLint
npm run build      # Create a production build
npm run start      # Serve the production build
```

- `/` — platform landing page (or tenant storefront on a tenant host)
- `/signup` and `/login` — account creation and sign-in
- `/dashboard` — authenticated restaurant dashboard
- `/demo` — theme gallery

Tenant hostnames use `http://<slug>.localhost:3000` in local development. For production, configure wildcard DNS and hosting for `*.your-domain` and set `PLATFORM_DOMAIN` to the platform hostname.

## Project structure

```text
app/(platform)/      Plato SaaS platform routes (dashboard, auth, demo)
app/actions/         Platform server actions
app/api/             API endpoints
app/page.tsx         Host router: tenant website vs platform landing
components/ui/       Reusable primitive UI atoms (Button, Badge, Container)
components/platform/ Plato dashboard, auth, and landing components
components/tenant/   Tenant storefront layout
data/                Local catalog JSON data
lib/auth/            Session and password helpers
lib/catalog/         Catalog repository boundary
lib/db/              PostgreSQL pool and query helpers
lib/tenant/          Tenant domain and host resolution
lib/theme/           Theme contracts, repositories, and token helpers
themes/<id>/         Theme JSON definitions and page schemas
themes/sections/     Theme section React components
themes/common/       Theme cards and ThemeContext
themes/engine/       ThemeRenderer, SectionRenderer, and sectionRegistry
```

### Adding a theme

1. Add the theme definition at `themes/<theme-id>/theme.json`.
2. Define page sections in `themes/<theme-id>/pages/<page>.json`.
3. Add or update reusable sections in `themes/sections/` and register them in `themes/engine/sectionRegistry.ts`.
4. Inspect the result at `/demo/<theme-id>`.

## Production tenant domains

Set `PLATFORM_DOMAIN` to the public platform hostname without a protocol, for example:

```env
PLATFORM_DOMAIN=localhost:3000
```

Tenant URLs then use `https://<slug>.plato.example.com`. Configure the matching wildcard DNS record and wildcard domain in your hosting provider so `*.plato.example.com` routes to this application. Use a managed PostgreSQL connection string and keep Google OAuth credentials in the deployment secret manager. Set `APP_URL` to the platform's canonical HTTPS origin.

## AI agent initialization prompt

The code block below is intentionally self-contained. Use the code block's **Copy** button in GitHub or VS Code, then give the prompt to your coding agent to initialize a fresh local checkout:

```text
You are initializing the PLATO repository, the official multi-tenant restaurant platform.

Work in the repository root and follow the existing codebase conventions. Do not replace working application code or create duplicate database abstractions.

1. Inspect package.json, README.md, lib/db/index.ts, lib/schema.sql, and the app routes before making changes.
2. Confirm Node.js 20.9+ and npm are available, then run npm install.
3. Create .env.local if it is missing with:
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/plato
   PLATFORM_DOMAIN=localhost:3000
   Do not commit .env.local or print secrets in the final response.
4. Confirm PostgreSQL is available. Create the plato database if needed, then apply the schema with `npm run db:migrate`. The script reads `.env.local` and reports success or failure.
5. Run npm run lint and fix only errors caused by initialization. Do not make unrelated refactors.
6. Start the app with npm run dev and verify that the platform home page, /signup, /login, /dashboard, and /demo respond correctly.
7. Report the exact initialization steps completed, any prerequisite that needs manual action, and the local URL. Never claim the database was initialized unless the schema command succeeded.
```

## Contributing

Keep tenant-aware behavior behind the repository and resolver boundaries. Prefer existing theme, catalog, database, and renderer abstractions before adding new ones. Run `npm run lint` and `npm run build` before opening a pull request.
