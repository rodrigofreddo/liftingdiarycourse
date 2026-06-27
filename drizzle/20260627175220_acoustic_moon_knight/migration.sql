CREATE TABLE "exercises" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL UNIQUE,
	"muscle_group" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sets" (
	"id" serial PRIMARY KEY,
	"workout_exercise_id" integer NOT NULL,
	"set_number" integer NOT NULL,
	"reps" integer NOT NULL,
	"weight_kg" numeric(6,2)
);
--> statement-breakpoint
CREATE TABLE "workout_exercises" (
	"id" serial PRIMARY KEY,
	"workout_id" integer NOT NULL,
	"exercise_id" integer NOT NULL,
	"order" integer NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "workouts" (
	"id" serial PRIMARY KEY,
	"user_id" text NOT NULL,
	"date" date NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sets" ADD CONSTRAINT "sets_workout_exercise_id_workout_exercises_id_fkey" FOREIGN KEY ("workout_exercise_id") REFERENCES "workout_exercises"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "workout_exercises" ADD CONSTRAINT "workout_exercises_workout_id_workouts_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "workouts"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "workout_exercises" ADD CONSTRAINT "workout_exercises_exercise_id_exercises_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id");