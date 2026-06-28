"use server"

import { z } from "zod"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { updateWorkout } from "@/data/workouts"

const UpdateWorkoutSchema = z.object({
  workoutId: z.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  notes: z.string().max(500).optional(),
})

export async function updateWorkoutAction(params: {
  workoutId: number
  date: string
  notes?: string
}) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const parsed = UpdateWorkoutSchema.safeParse(params)
  if (!parsed.success) {
    throw new Error("Invalid input")
  }

  const workout = await updateWorkout(
    parsed.data.workoutId,
    userId,
    parsed.data.date,
    parsed.data.notes
  )

  if (!workout) throw new Error("Workout not found")

  redirect(`/dashboard?date=${parsed.data.date}`)
}
