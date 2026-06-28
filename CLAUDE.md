# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## IMPORTANT: Docs-First Rule

**Before writing any code, always read the relevant documentation file in the `/docs` directory first.** This is mandatory — not optional. Find the doc that covers the feature, pattern, or API you are about to implement and read it before producing any output. Do not rely on training data or assumptions when a `/docs` file exists for the topic.

- /docs/ui.md

## Commands

```bash
npm run dev       # Start dev server (Turbopack, default in Next.js 16)
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint (uses eslint CLI directly, not next lint)
```

## Stack

- **Next.js 16** with App Router (`src/app/`)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS 4** (via `@tailwindcss/postcss`)

## Next.js 16 Breaking Changes

**Async Request APIs (breaking):** `cookies()`, `headers()`, `draftMode()`, and `params` in layouts/pages/routes are async-only. Always `await` them:

```ts
// Required in Next.js 16
const cookieStore = await cookies()
const { slug } = await params
```

**`middleware` → `proxy`:** The `middleware.ts` convention is deprecated. Use `proxy.ts` with `export function proxy(request: Request)`. The proxy runtime is Node.js only (not edge).

**`revalidateTag` requires second argument:** Single-argument form is deprecated. Pass a `cacheLife` profile as second arg.

**Stable cache APIs:** `cacheLife` and `cacheTag` no longer need the `unstable_` prefix.

**`next/image`:** The value `16` is removed from default `images.imageSizes`. `next/legacy/image` is deprecated — use `next/image`.

**Turbopack is default:** No flags needed for `next dev` or `next build`.

**Instant navigation:** For slow client-side navigations, `Suspense` alone is not enough — also export `unstable_instant` from the route. See `node_modules/next/dist/docs/01-app/02-guides/instant-navigation.mdx`.

## Project Structure

```
src/app/          # App Router root
  layout.tsx      # Root layout (Geist fonts, Tailwind base classes)
  page.tsx        # Home page
  globals.css     # Global styles (Tailwind v4 imports)
```
