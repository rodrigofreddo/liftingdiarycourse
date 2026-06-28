import { notFound, redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getWorkoutById } from "@/data/workouts"
import EditWorkoutForm from "./EditWorkoutForm"

type Props = {
  params: Promise<{ workoutId: string }>
}

export default async function EditWorkoutPage({ params }: Props) {
  const { workoutId } = await params
  const id = Number(workoutId)
  if (!Number.isInteger(id) || id <= 0) notFound()

  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const workout = await getWorkoutById(id, userId)
  if (!workout) notFound()

  return (
    <main className="flex flex-col gap-6 p-6 max-w-2xl mx-auto w-full">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Edit Workout
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Update the date or notes for this workout session.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Workout details</CardTitle>
          <CardDescription>Make your changes and save.</CardDescription>
        </CardHeader>
        <CardContent>
          <EditWorkoutForm
            workoutId={workout.id}
            defaultDate={workout.date}
            defaultNotes={workout.notes}
          />
        </CardContent>
      </Card>
    </main>
  )
}
