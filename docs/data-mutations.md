# Data Mutations

## Golden Rule

**All data mutations must go through Server Actions. No exceptions.**

- No `fetch`/`axios` POST/PUT/DELETE calls from Client Components
- No Route Handlers (`app/api/`) for writing data
- No direct Drizzle calls inside Server Actions — always delegate to a `/data` helper
- No `FormData` parameters on any Server Action

Mutations flow one way: **Server Action → `/data` helper → Drizzle ORM → database**.

## `/data` Directory

All database write operations live in `src/data/`, colocated with their read counterparts. Each file groups mutations by domain (e.g., `src/data/workouts.ts`).

Rules for mutation helper functions:

- **Always use Drizzle ORM** — never raw SQL
- **Always scope mutations to the authenticated user** — every write must include a `userId` check so a user can never modify another user's data
- Export plain async functions, not classes

```ts
// src/data/workouts.ts
import { db } from "@/db"
import { workouts } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function createWorkout(userId: string, name: string, date: Date) {
  const [workout] = await db
    .insert(workouts)
    .values({ userId, name, date })
    .returning()
  return workout
}

export async function deleteWorkout(workoutId: string, userId: string) {
  await db
    .delete(workouts)
    .where(eq(workouts.id, workoutId), eq(workouts.userId, userId))
}
```

## Server Actions

All Server Actions must live in a colocated `actions.ts` file next to the route that uses them.

```
src/app/dashboard/
  page.tsx
  actions.ts      ← Server Actions for this route
  DashboardClient.tsx
```

### Required Structure

Every Server Action must:

1. Be declared with `"use server"` at the top of the file
2. Accept typed parameters — **never `FormData`**
3. Validate all arguments with Zod before touching the database
4. Resolve the authenticated user inside the action — never trust a `userId` passed from the client
5. Delegate the actual DB write to a `/data` helper

```ts
// src/app/dashboard/actions.ts
"use server"

import { z } from "zod"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { createWorkout } from "@/data/workouts"

const CreateWorkoutSchema = z.object({
  name: z.string().min(1).max(100),
  date: z.coerce.date(),
})

export async function createWorkoutAction(params: {
  name: string
  date: Date
}) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const parsed = CreateWorkoutSchema.safeParse(params)
  if (!parsed.success) {
    throw new Error("Invalid input")
  }

  return createWorkout(userId, parsed.data.name, parsed.data.date)
}
```

## User Scoping — Non-Negotiable

The same rule from data fetching applies to mutations: a user must never be able to modify another user's data. Enforce this inside the `/data` helper by always filtering on `userId`.

Never accept a `userId` as a Server Action parameter. Always derive it from `auth()` inside the action itself.

```ts
// WRONG — caller controls which user's data gets mutated
export async function deleteWorkoutAction(workoutId: string, userId: string) { ... }

// CORRECT — userId comes from the session, not the caller
export async function deleteWorkoutAction(workoutId: string) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")
  ...
}
```

## Zod Validation Rules

- Define a Zod schema for every action's parameters, colocated in the same `actions.ts` file
- Use `safeParse` so you can handle errors explicitly rather than letting Zod throw
- Use `z.coerce.date()` for date fields (serialisation over the network converts `Date` to string)
- Throw a plain `Error` on validation failure — do not leak Zod's error details to the client

## What Is Allowed vs. Forbidden

| Allowed | Forbidden |
|---|---|
| Typed object params on Server Actions | `FormData` params |
| Zod validation inside every action | Skipping validation for "trusted" callers |
| `/data` helpers for all DB writes | Direct Drizzle calls inside actions |
| `userId` from `auth()` inside the action | `userId` passed as a param from the client |
| `actions.ts` colocated with the route | Centralised `app/actions.ts` catch-all file |
