"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createWorkoutAction } from "./actions"

export default function NewWorkoutForm() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new globalThis.FormData(e.currentTarget)
    const date = data.get("date") as string
    const notes = (data.get("notes") as string) || undefined

    startTransition(async () => {
      await createWorkoutAction({ date, notes })
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          name="date"
          type="date"
          defaultValue={format(new Date(), "yyyy-MM-dd")}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="notes">Notes <span className="text-zinc-400 font-normal">(optional)</span></Label>
        <Input
          id="notes"
          name="notes"
          type="text"
          placeholder="e.g. Upper body, Push day…"
          maxLength={500}
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating…" : "Create workout"}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
