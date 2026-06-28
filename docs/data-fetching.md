# Data Fetching

## Golden Rule

**All data fetching must happen in Server Components. No exceptions.**

- No `fetch` or database calls in Client Components (`"use client"`)
- No Route Handlers (`app/api/`) for reading data
- No SWR, React Query, or any client-side fetching library for application data
- No `useEffect` data fetching

Data flows one way: **database → `/data` helper → Server Component → props to Client Components**.

## `/data` Directory

All database queries live in `src/data/`. Each file groups queries by domain (e.g., `src/data/workouts.ts`, `src/data/exercises.ts`).

Rules for helper functions:

- **Always use Drizzle ORM** — never raw SQL (`db.execute`, template literals, or `sql` tagged queries that bypass the ORM's type safety)
- **Always scope queries to the authenticated user** — every function that returns user data must accept a `userId` parameter and filter by it
- Export plain async functions, not classes

```ts
// src/data/workouts.ts
import { db } from "@/db"
import { workouts } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function getWorkoutsForUser(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId))
}

export async function getWorkoutById(workoutId: string, userId: string) {
  const [workout] = await db
    .select()
    .from(workouts)
    .where(eq(workouts.id, workoutId), eq(workouts.userId, userId))

  return workout ?? null
}
```

## User Scoping — Non-Negotiable

A logged-in user must never be able to read or mutate another user's data. Enforce this at the query level, not the UI level.

**Always filter by `userId` in every query.** Never trust a resource ID alone:

```ts
// WRONG — fetches the workout regardless of who owns it
export async function getWorkout(workoutId: string) {
  const [workout] = await db
    .select()
    .from(workouts)
    .where(eq(workouts.id, workoutId))
  return workout ?? null
}

// CORRECT — can only return data the caller owns
export async function getWorkout(workoutId: string, userId: string) {
  const [workout] = await db
    .select()
    .from(workouts)
    .where(eq(workouts.id, workoutId), eq(workouts.userId, userId))
  return workout ?? null
}
```

If the query returns `null` (record doesn't exist or belongs to someone else), treat it the same way — call `notFound()` or return a 404. Never leak the distinction between "not found" and "not yours."

## Calling Helpers from Server Components

Resolve the authenticated user in the Server Component, then pass `userId` into every data helper:

```tsx
// src/app/dashboard/page.tsx
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getWorkoutsForUser } from "@/data/workouts"

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const workouts = await getWorkoutsForUser(userId)

  return <WorkoutList workouts={workouts} />
}
```

Never pass `userId` from a Client Component. The authentication check must happen server-side.

## What to Pass to Client Components

Server Components fetch the data; Client Components only render it or handle interactions. Pass serialisable props — plain objects and arrays, not Drizzle result proxies.

```tsx
// Server Component fetches, Client Component renders
<WorkoutCard workout={workout} /> // workout is a plain object
```

If a Client Component needs to trigger a data change, use a **Server Action**, not a Route Handler.
