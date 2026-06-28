# UI Coding Standards

## Component Library — shadcn/ui Only

**All UI in this project must be built exclusively with [shadcn/ui](https://ui.shadcn.com/) components.**

- Do **not** create custom UI components (no hand-rolled buttons, inputs, modals, cards, tables, etc.).
- Do **not** use any other component library (no Radix UI primitives directly, no MUI, no Chakra, no Headless UI, etc.).
- If a shadcn/ui component exists for the UI element you need, use it — no exceptions.
- If shadcn/ui does not offer a component for a specific need, open a discussion before building anything custom.

## Adding Components

Install shadcn/ui components via the CLI:

```bash
npx shadcn@latest add <component-name>
```

Components are added to `src/components/ui/` and are owned by the project — they can be edited, but only to adjust **theme tokens or variants**, never to introduce net-new component abstractions.

## Styling

- Use Tailwind CSS utility classes for layout and spacing.
- Do **not** write custom CSS classes or CSS modules for component styling.
- Color, radius, and typography must reference the CSS variables defined by shadcn/ui (`--primary`, `--muted`, `--border`, etc.) so theming stays consistent.

## What Is Allowed vs. Forbidden

| Allowed | Forbidden |
|---|---|
| `<Button>` from shadcn/ui | `<button>` with hand-rolled classes |
| `<Input>` from shadcn/ui | `<input>` styled manually |
| `<Card>`, `<CardHeader>`, etc. | Custom `<div>` card wrappers |
| `<Table>`, `<TableRow>`, etc. | Plain `<table>` elements |
| `<Dialog>`, `<Sheet>`, etc. | Custom modal/overlay implementations |
| Tailwind utilities for layout | Custom CSS classes |

## File Location

All shadcn/ui component files live in:

```
src/components/ui/
```

Do not move them or create parallel component directories.
