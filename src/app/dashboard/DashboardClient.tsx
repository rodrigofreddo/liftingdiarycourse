"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon, Dumbbell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { WorkoutWithDetails } from "@/data/workouts";

type Props = {
  workouts: WorkoutWithDetails[];
  selectedDate: Date;
};

export default function DashboardClient({ workouts, selectedDate }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  function handleDateSelect(d: Date | undefined) {
    if (!d) return;
    const params = new URLSearchParams({ date: format(d, "yyyy-MM-dd") });
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <main className="flex flex-col gap-6 p-6 max-w-2xl mx-auto w-full">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Dashboard
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          View and manage your workouts by date.
        </p>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-fit justify-start gap-2 font-normal"
          >
            <CalendarIcon className="h-4 w-4 text-zinc-500" />
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
          />
        </PopoverContent>
      </Popover>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Workouts on {format(selectedDate, "MMM d")}
          </h2>
          <Badge variant="secondary">{workouts.length} logged</Badge>
        </div>

        {workouts.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 gap-2 text-center">
              <Dumbbell className="h-8 w-8 text-zinc-300" />
              <p className="text-sm text-zinc-500">
                No workouts logged for this day.
              </p>
            </CardContent>
          </Card>
        ) : (
          workouts.map((workout) => (
            <Link
              key={workout.id}
              href={`/dashboard/workout/${workout.id}`}
              className="block"
            >
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">
                      {workout.notes ?? "Untitled workout"}
                    </CardTitle>
                    <Badge variant="outline">
                      {workout.setCount} {workout.setCount === 1 ? "set" : "sets"}
                    </Badge>
                  </div>
                  {workout.exercises.length > 0 && (
                    <CardDescription>
                      {workout.exercises.join(", ")}
                    </CardDescription>
                  )}
                </CardHeader>
              </Card>
            </Link>
          ))
        )}
      </section>
    </main>
  );
}
