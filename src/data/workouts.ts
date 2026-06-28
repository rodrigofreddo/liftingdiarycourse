import { db } from "@/db"
import { workouts, workoutExercises, exercises, sets } from "@/db/schema"
import { eq, and, count } from "drizzle-orm"

export async function createWorkout(userId: string, date: string, notes?: string) {
  const [workout] = await db
    .insert(workouts)
    .values({ userId, date, notes })
    .returning()
  return workout
}

export type WorkoutWithDetails = {
  id: number
  date: string
  notes: string | null
  exercises: string[]
  setCount: number
}

export async function getWorkoutsForDate(
  userId: string,
  date: string
): Promise<WorkoutWithDetails[]> {
  const userWorkouts = await db
    .select()
    .from(workouts)
    .where(and(eq(workouts.userId, userId), eq(workouts.date, date)))

  if (userWorkouts.length === 0) return []

  return Promise.all(
    userWorkouts.map(async (workout) => {
      const exerciseRows = await db
        .select({ name: exercises.name })
        .from(workoutExercises)
        .innerJoin(exercises, eq(exercises.id, workoutExercises.exerciseId))
        .where(eq(workoutExercises.workoutId, workout.id))
        .orderBy(workoutExercises.order)

      const [setCountRow] = await db
        .select({ count: count() })
        .from(sets)
        .innerJoin(
          workoutExercises,
          eq(workoutExercises.id, sets.workoutExerciseId)
        )
        .where(eq(workoutExercises.workoutId, workout.id))

      return {
        id: workout.id,
        date: workout.date,
        notes: workout.notes,
        exercises: exerciseRows.map((r) => r.name),
        setCount: setCountRow?.count ?? 0,
      }
    })
  )
}
