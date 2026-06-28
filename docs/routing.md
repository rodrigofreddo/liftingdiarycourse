# Routing

## Golden Rule

All routes except the home page (`/`) live under `/dashboard`. Every `/dashboard` route is a protected route — unauthenticated users are redirected to sign-in automatically by `proxy.ts`.

## Route Structure

```
/                        # Home page — public
/sign-in/[[...sign-in]]  # Clerk sign-in — public
/sign-up/[[...sign-up]]  # Clerk sign-up — public
/dashboard               # Dashboard root — protected
/dashboard/[feature]     # All feature pages — protected
```

Do not create top-level routes for app features. If it belongs to the authenticated app, it belongs under `/dashboard`.

## File System Conventions

```
src/app/
  page.tsx                          # Home page (public)
  sign-in/[[...sign-in]]/page.tsx   # Clerk catch-all (public)
  sign-up/[[...sign-up]]/page.tsx   # Clerk catch-all (public)
  dashboard/
    layout.tsx                      # Shared dashboard shell
    page.tsx                        # /dashboard index
    [feature]/
      page.tsx                      # /dashboard/[feature]
```

## Route Protection

Route protection is handled exclusively in `src/proxy.ts` via `clerkMiddleware`. Do not add auth checks in layouts or individual pages — the proxy covers the entire `/dashboard` subtree automatically.

Public routes must be explicitly listed in the `isPublicRoute` matcher:

```ts
// src/proxy.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})
```

To add a new public route, add its pattern to `createRouteMatcher` — nowhere else. See [auth.md](./auth.md) for the full auth guide.

## Dashboard Layout

`src/app/dashboard/layout.tsx` is the shared shell for all dashboard pages (navigation, sidebar, header). Add shared UI here; do not duplicate it across individual pages.

```tsx
// src/app/dashboard/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* shared nav / sidebar */}
      <main>{children}</main>
    </div>
  )
}
```

## What Is Allowed vs. Forbidden

| Allowed | Forbidden |
|---|---|
| `/dashboard/[feature]` for all app routes | Top-level routes for authenticated features |
| Route protection via `clerkMiddleware` in `proxy.ts` | `auth()` guards inside layouts or pages as the sole protection mechanism |
| Public routes listed in `createRouteMatcher` | Hardcoded redirects in layouts for unauthenticated users |
| Shared shell in `dashboard/layout.tsx` | Duplicating nav/header in each page |
