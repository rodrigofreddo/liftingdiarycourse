"use server"

import { z } from "zod"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { createWorkout } from "@/data/workouts"

const CreateWorkoutSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  notes: z.string().max(500).optional(),
})

export async function createWorkoutAction(params: {
  date: string
  notes?: string
}) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const parsed = CreateWorkoutSchema.safeParse(params)
  if (!parsed.success) {
    throw new Error("Invalid input")
  }

  const workout = await createWorkout(userId, parsed.data.date, parsed.data.notes)
  redirect(`/dashboard?date=${parsed.data.date}`)
}
