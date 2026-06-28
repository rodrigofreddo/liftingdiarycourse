import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import NewWorkoutForm from "./NewWorkoutForm"

export default function NewWorkoutPage() {
  return (
    <main className="flex flex-col gap-6 p-6 max-w-2xl mx-auto w-full">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          New Workout
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Log a new workout session.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Workout details</CardTitle>
          <CardDescription>Choose a date and add an optional note to identify this session.</CardDescription>
        </CardHeader>
        <CardContent>
          <NewWorkoutForm />
        </CardContent>
      </Card>
    </main>
  )
}
