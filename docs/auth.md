# Authentication

## Golden Rule

**This app uses Clerk for all authentication. Do not implement any custom auth logic.**

- No custom session handling, JWTs, or cookies
- No `next-auth` or any other auth library
- No hand-rolled sign-in/sign-up forms — use Clerk's hosted components
- No rolling your own route protection — use `clerkMiddleware` in `proxy.ts`

## Provider Setup

`ClerkProvider` wraps the entire app in `src/app/layout.tsx`. Do not add it anywhere else and do not remove it.

## Route Protection

All route protection is handled in `src/proxy.ts` via `clerkMiddleware` and `createRouteMatcher`.

- Public routes (accessible without sign-in) must be explicitly listed in the `isPublicRoute` matcher
- All other routes are protected automatically by `auth.protect()`
- Do not add manual auth redirects in layouts — the proxy handles it

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

To add a new public route, add its pattern to the `createRouteMatcher` array — nowhere else.

## Resolving the Current User

Use `auth()` from `@clerk/nextjs/server` in Server Components and Server Actions to get the current `userId`.

```ts
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const { userId } = await auth()
if (!userId) redirect("/sign-in")
```

Rules:
- Always `await auth()` — it is async in Next.js 16
- Always guard with `if (!userId) redirect("/sign-in")` immediately after
- Never pass `userId` down from a Client Component — always resolve it server-side
- Never trust a `userId` received as a prop or Server Action parameter from the client

## Sign-In and Sign-Up Pages

Use Clerk's pre-built `<SignIn />` and `<SignUp />` components. Do not build custom forms.

```tsx
// src/app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn />
    </div>
  )
}
```

Routes must follow Clerk's catch-all convention:
```
src/app/sign-in/[[...sign-in]]/page.tsx
src/app/sign-up/[[...sign-up]]/page.tsx
```

## UI Components

Use Clerk's pre-built UI primitives for auth-related UI in layouts and headers. Do not build custom sign-in buttons or user menus.

| Need | Component |
|---|---|
| Conditionally render based on auth state | `<Show when="signed-in">` / `<Show when="signed-out">` |
| Trigger sign-in flow | `<SignInButton mode="modal">` |
| Trigger sign-up flow | `<SignUpButton mode="modal">` |
| Signed-in user avatar + menu | `<UserButton>` |

All imported from `@clerk/nextjs`.

## What Is Allowed vs. Forbidden

| Allowed | Forbidden |
|---|---|
| `auth()` from `@clerk/nextjs/server` for `userId` | Passing `userId` as a client-side prop or action param |
| `clerkMiddleware` in `proxy.ts` for route protection | Manual auth checks in layouts or Server Components |
| `<SignIn />` and `<SignUp />` Clerk components | Custom auth forms |
| `<UserButton>`, `<Show>`, `<SignInButton>` for header UI | Hand-rolled user menus or auth state checks in Client Components |
| Adding public routes via `createRouteMatcher` | Protecting routes anywhere other than `proxy.ts` |
