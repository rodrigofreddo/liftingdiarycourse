"use client";

import { useState } from "react";
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

const MOCK_WORKOUTS = [
  {
    id: "1",
    name: "Upper Body Push",
    duration: "45 min",
    exercises: ["Bench Press", "Overhead Press", "Tricep Dips"],
    sets: 12,
  },
  {
    id: "2",
    name: "Core Circuit",
    duration: "20 min",
    exercises: ["Plank", "Crunches", "Leg Raises"],
    sets: 6,
  },
];

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date());

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
            {format(date, "EEEE, MMMM d, yyyy")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => d && setDate(d)}
          />
        </PopoverContent>
      </Popover>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Workouts on {format(date, "MMM d")}
          </h2>
          <Badge variant="secondary">{MOCK_WORKOUTS.length} logged</Badge>
        </div>

        {MOCK_WORKOUTS.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 gap-2 text-center">
              <Dumbbell className="h-8 w-8 text-zinc-300" />
              <p className="text-sm text-zinc-500">No workouts logged for this day.</p>
            </CardContent>
          </Card>
        ) : (
          MOCK_WORKOUTS.map((workout) => (
            <Card key={workout.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{workout.name}</CardTitle>
                  <Badge variant="outline">{workout.duration}</Badge>
                </div>
                <CardDescription>
                  {workout.sets} sets &middot; {workout.exercises.join(", ")}
                </CardDescription>
              </CardHeader>
            </Card>
          ))
        )}
      </section>
    </main>
  );
}
