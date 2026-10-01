# PLATO

PLATO is the official repository for a multi-tenant restaurant platform. It gives restaurant owners a platform account, creates a dedicated tenant for each restaurant, and serves each restaurant site from its own subdomain.

The application is built with Next.js, React, TypeScript, and PostgreSQL. Themes and page sections are data-driven so the presentation layer can evolve independently from tenant data.

## Requirements

- Node.js 20.9 or newer
- npm
- PostgreSQL 14 or newer, running locally or hosted

## Initialize locally

Clone the repository and install dependencies:

```bash
git clone https://github.com/ahmaadsaim/plato-fyp.git
cd fyp-plato
npm install
```

Create `.env.local` in the project root:

```env
# PostgreSQL connection string used by the pg client
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/plato

# Use a long random value in every shared or production environment
AUTH_SECRET=replace-with-a-long-random-secret

# Local tenant URLs are http://<slug>.localhost:3000
# In production, set this to the platform domain without https://
PLATFORM_DOMAIN=localhost:3000
```

`.env.local` is ignored by Git. Never commit database credentials or production secrets.

## Initialize the database

Create a PostgreSQL database named `plato` if it does not already exist:

```bash
createdb plato
```

Apply the schema:

```bash
psql "$DATABASE_URL" -f lib/schema.sql
```

If your shell does not load `.env.local` automatically, provide the connection string directly:

```bash
psql "postgresql://postgres:postgres@localhost:5432/plato" -f lib/schema.sql
```

The schema creates the `users` and `tenants` tables and the indexes required for tenant lookup. The application creates user and tenant records through its server actions; no seed script is required for a fresh install.

## Run the application

Start the development server:

```bash
npm run dev
```

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
```

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
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/plato
   AUTH_SECRET=<generate a long random local secret>
   PLATFORM_DOMAIN=localhost:3000
   Do not commit .env.local or print secrets in the final response.
4. Confirm PostgreSQL is available. Create the plato database if needed, then apply the schema with:
   psql "$DATABASE_URL" -f lib/schema.sql
   If DATABASE_URL is not exported by the shell, read the value from .env.local without exposing it and run the equivalent psql command.
5. Run npm run lint and fix only errors caused by initialization. Do not make unrelated refactors.
6. Start the app with npm run dev and verify that the platform home page, /signup, /login, /dashboard, and /demo respond correctly.
7. Report the exact initialization steps completed, any prerequisite that needs manual action, and the local URL. Never claim the database was initialized unless the schema command succeeded.
```

## Contributing

Keep tenant-aware behavior behind the repository and resolver boundaries. Prefer existing theme, catalog, database, and renderer abstractions before adding new ones. Run `npm run lint` and `npm run build` before opening a pull request.
