This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Platform hostname configuration

Copy `.env.example` to `.env.local` for local development. Set `PLATFORM_DOMAIN`
to the hostname attached to the deployment, without a protocol:

```env
PLATFORM_DOMAIN=myapp.com
```

Tenant URLs then use `http://<slug>.localhost:3000` locally and
`https://<slug>.myapp.com` in production. Configure the corresponding wildcard
domain (`*.myapp.com`) in Vercel and DNS so those tenant requests reach this app.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Project Structure

The codebase keeps route entry points, domain logic, rendering, and editable configuration separate:

```text
app/                 Next.js routes and server actions
components/           Reusable UI and section components
data/                 Local catalog JSON used by the catalog repository
lib/theme/            Theme contracts, theme JSON repository, and token helpers
lib/catalog/          Restaurant catalog repository and future tenant data access
renderer/             Theme and section rendering orchestration only
themes/<id>/          Editable theme JSON, page definitions, and theme notes
```

### Theme and demo workflow

1. Add or edit a theme under `themes/<theme-id>/theme.json`.
2. Define page section order and settings in `themes/<theme-id>/pages/<page>.json`.
3. Add reusable section implementations in `components/sections/` and register them in `renderer/sectionRegistry.ts`.
4. Use `/demo` to discover themes and `/demo/<theme-id>` to inspect a theme with live section and token controls.

Theme JSON is loaded by `lib/theme/repository.ts`, catalog JSON by `lib/catalog/repository.ts`, and both are passed into the rendering layer through the demo route. This keeps future database-backed tenant data changes isolated from the renderer and UI components.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
