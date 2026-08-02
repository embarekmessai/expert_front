---
name: frontend-design
description: Design and build frontend UI for this app using Tailwind CSS v4 and shadcn/ui components. Use when creating pages, layouts, forms, tables, or any visual interface work in expert-front.
---

# Frontend Design — Tailwind CSS v4 + shadcn/ui

Guidance for building UI in this project (TanStack Start + React 19 + Tailwind CSS v4 + shadcn/ui `new-york` style, base color `zinc`).

## Project facts (do not guess)

- Tailwind v4 via `@tailwindcss/vite` — no `tailwind.config.js`; theme customization lives in CSS (`@theme` in the global stylesheet).
- shadcn components live in `src/components/ui/` and are added with:
  `pnpm dlx shadcn@latest add <component>`
  Never hand-write a component that exists in the shadcn registry — add it.
- Aliases: `#/components`, `#/lib/utils` (see `components.json`); `#/*` and `@/*` → `src/*`.
- Icons: `lucide-react` only.
- `cn()` from `#/lib/utils` for conditional classes.
- App shell already exists: `src/components/AppShell.tsx`, `app-sidebar.tsx`, `nav-*`. New app pages go under `src/routes/(app)/` and render inside that shell — don't rebuild chrome.
- Prettier: no semicolons, single quotes, trailing commas.

## Design rules

- **Compose, don't restyle**: use shadcn primitives (`Button`, `Card`, `Dialog`, `Table`, `Form`, `Badge`, …) and extend via `className` + `cn()`. Don't fork component internals.
- **Variants over classes**: when a shadcn component supports `variant`/`size`, use them before adding custom classes.
- **Semantic tokens**: use theme tokens (`bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`, …), not raw colors like `bg-gray-200`. The app supports dark/light via `use-appearance`.
- **Spacing**: consistent Tailwind spacing scale — `gap-4`/`p-4`/`p-6` rhythm; prefer `flex`/`grid` with `gap` over margins on children.
- **Responsiveness**: mobile-first (`sm:`/`md:`/`lg:`). Use `use-mobile` hook when JS needs the breakpoint.
- **Tables**: `@tanstack/react-table` + shadcn `Table`/`DataTable` pattern (see existing `PVTable.tsx`).
- **Forms**: `@tanstack/react-form` + shadcn `Form`/`Input`/`Select` + zod validation.
- **Feedback**: loading → `Skeleton`; empty states → short text + icon; errors → toast (`use-flash-toast`) or `Alert`.
- **i18n**: all user-facing strings via Paraglide messages (`m.*` from `src/paraglide`), add keys to `messages/en.json` (and `de.json`); never hardcode copy.

## Workflow

1. Check `src/components/ui/` for existing primitives; add missing ones via the shadcn CLI.
2. Look at a similar existing route/component (e.g. `PVTable.tsx`, `(app)` routes) and match its structure and density.
3. Build the UI with Tailwind classes on shadcn primitives; keep custom CSS out unless unavoidable.
4. Verify with `pnpm lint` and `pnpm check`; run `pnpm dev` for a visual pass.
