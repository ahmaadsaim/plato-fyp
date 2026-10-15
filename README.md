# PLATO

PLATO is the official repository for a multi-tenant restaurant platform. It gives restaurant owners a platform account, creates a dedicated tenant for each restaurant, and serves each restaurant site from its own subdomain.

The application is built with Next.js, React, TypeScript, and PostgreSQL. Themes and page sections are data-driven so the presentation layer can evolve independently from tenant data.

## Requirements

- Node.js 20.9 or newer
- npm
- A Neon PostgreSQL project (Free plan is sufficient to start development)

## Initialize locally

Clone the repository and install dependencies:

```bash
git clone https://github.com/ahmaadsaim/plato-fyp.git
cd plato-fyp
npm install
```

Create `.env.local` in the project root:

```env
# Copy both URLs from the Neon project's Connect panel; retain SSL parameters.
# Pooled URL for the application (hostname contains -pooler).
DATABASE_URL="<NEON_POOLED_CONNECTION_URL>"
# Direct URL for explicit schema migrations.
DATABASE_URL_UNPOOLED="<NEON_DIRECT_CONNECTION_URL>"

# Required in development and production; generate a long random value
AUTH_SECRET=replace-with-a-long-random-secret

# Local tenant URLs are http://<slug>.localhost:3000
# In production, set this to the platform domain without https://
PLATFORM_DOMAIN=localhost:3000
```

`.env.local` is ignored by Git. Never commit database credentials or production secrets.

## Initialize the database

Ask the project owner for Neon access, then copy the pooled and direct connection URLs for the assigned development branch into `.env.local`. Do not use the production branch for routine development or share credentials in Git/chat. The app can run locally while its database runs on Neon.

For a new empty database, apply the existing schema once:

```bash
npm run db:migrate
```

Verify connectivity and table counts:

```bash
npm run db:check
```

Both commands load Next.js environment files; process environment values take precedence. Schema migration prefers `DATABASE_URL_UNPOOLED`, falling back to `DATABASE_URL`. The running app uses the three Neon tables `users`, `tenants`, and `theme_overrides`. Connection URLs must point to Neon and require SSL; localhost PostgreSQL is no longer an application backend. Application startup does not change the schema, and database failures do not switch to an in-memory store.

See [DATABASE_TABLES.md](DATABASE_TABLES.md) for the proposed whole-FYP table inventory, including later and conditional modules. It identifies candidates only; it is not an implemented schema.

The [schema design under lib](lib/schema-design/README.md) contains review SQL and [relationship diagrams](lib/schema-design/relationships.md). It is separate from `lib/schema.sql` and `db:migrate`; the tenant model and several business rules remain unresolved. Use a disposable database to review the SQL, not the source database or Neon production.

Signup stores a merchant account and bcrypt password hash in Neon's `users` table. Login checks that stored hash; sessions require `AUTH_SECRET` and a user still present in Neon. Demo credentials and temporary sessions have been removed. Missing tenants return 404 instead of generating a demo restaurant. Restaurant and theme-override writes use the same Neon connection.

The current setup starts fresh on Neon; local records are not imported. `db:migrate` initializes/updates the schema without resetting existing records. Global template JSON files stay in the project and are rendered as before. Menu, order and branch modules from the schema draft are not integrated by this setup.

### Completed integration — 2026-10-09

- Successfully applied `lib/schema.sql` to Neon using `npm run db:migrate`: `users`, `tenants`, and `theme_overrides`.
- Connected the existing account, restaurant and theme-override flows to Neon; removed local database and demo-auth fallbacks.
- Added database/schema checks before development and production startup.
- Verification passed: 10 database/auth regression tests, TypeScript and production build. ESLint reported 0 errors and 43 existing warnings.

The regression tests use stubbed database connections; live signup/login and a separate post-migration table-count check remain unverified. The whole-FYP SQL and relationship diagrams remain a review draft.

### Optional Neon CLI

The repository includes a minimal `neon.ts` policy. After installing the Neon CLI and logging in, link your assigned branch and pull connection variables:

```bash
neon link --project-id lingering-thunder-08132311 --branch <YOUR_DEVELOPMENT_BRANCH> -y --no-env-pull --no-config
neon env pull --service postgres
```

Preserve your old local database connection privately before pulling variables. Check that `.env.local` contains the intended URLs. `neon config plan` previews configuration changes; `neon deploy` applies Neon service configuration, not SQL migrations, data imports, or website deployment. CLI, MCP and agent skills are optional for application connectivity.

## Run the application

Start the development server:

```bash
npm run dev
```

`npm run dev` first runs `scripts/connect-db.mjs` through npm's `predev` hook. It checks the Neon URL and `AUTH_SECRET`, opens a fresh connection, and verifies the three app tables before logging `[database] Connected successfully: <host>`. On failure it exits with an error and Next.js does not start. No password or full URL is logged. `npm run start` runs the same check using production environment files. Use `npm run db:check` for table counts.

After editing `.env.local`, stop the running server with Ctrl+C and run `npm run dev` again to repeat the check. Existing terminal logs describe an earlier check. An inherited `DATABASE_URL` environment variable takes precedence over `.env.local`; update or remove it if it overrides your test URL. The application also replaces its connection pool if the loaded URL changes.

Open [http://localhost:3000](http://localhost:3000). Useful routes are:

- `/` for the platform home page.
- `/signup` and `/login` for authentication.
- `/dashboard` for creating and viewing restaurants.
- `/demo` for the theme gallery.

After creating a restaurant with the slug `pizza-house`, open `http://pizza-house.localhost:3000`. Modern browsers resolve `*.localhost` to the local machine. If this does not work in your environment, use the request host override supported by the development setup or add the hostname to `/etc/hosts`.

## Commands

```bash
npm run dev       # Start the development server
npm run lint      # Run ESLint
npm run build     # Create a production build
npm run start     # Serve the production build
npm run db:migrate # Apply existing schema explicitly
npm run db:check   # Verify database connection and table counts
npm run test:db    # Database/auth regression tests (no live database writes)
```

Pull requests also receive a SonarCloud quality-gate check. Review its annotations for issues in changed code alongside the local test, lint and build results. CodeRabbit can report a successful status while its review is skipped; that status does not represent a completed code review.

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

Tenant URLs then use `https://<slug>.plato.example.com`. Configure the matching wildcard DNS record and wildcard domain in your hosting provider so `*.plato.example.com` routes to this application. Use a strong production `AUTH_SECRET` and a managed PostgreSQL connection string in the deployment environment.

## AI agent initialization prompt

The code block below is intentionally self-contained. Use the code block's **Copy** button in GitHub or VS Code, then give the prompt to your coding agent to initialize a fresh local checkout:

```text
You are initializing the PLATO repository, the official multi-tenant restaurant platform.

Work in the repository root and follow the existing codebase conventions. Do not replace working application code or create duplicate database abstractions.

1. Inspect package.json, README.md, lib/db/index.ts, lib/schema.sql, and the app routes before making changes.
2. Confirm Node.js 20.9+ and npm are available, then run npm install.
3. Create .env.local if it is missing with:
   DATABASE_URL=<Neon pooled URL supplied privately by the project owner>
   DATABASE_URL_UNPOOLED=<Neon direct URL for the assigned development branch>
   AUTH_SECRET=<generate a long random local secret>
   PLATFORM_DOMAIN=localhost:3000
   Do not commit .env.local or print secrets in the final response.
4. Confirm the assigned Neon development branch and whether local records need importing. Do not overwrite an existing database or initialize tables before a full dump restore. For an empty database, run npm run db:migrate; then run npm run db:check. These scripts load environment files without printing credentials.
5. Run npm run lint and fix only errors caused by initialization. Do not make unrelated refactors.
6. Start the app with npm run dev and verify that the platform home page, /signup, /login, /dashboard, and /demo respond correctly.
7. Report the exact initialization steps completed, any prerequisite that needs manual action, and the local URL. Never claim the database was initialized unless the schema command succeeded.
```

## Contributing

Keep tenant-aware behavior behind the repository and resolver boundaries. Prefer existing theme, catalog, database, and renderer abstractions before adding new ones. Run `npm run lint` and `npm run build` before opening a pull request.
