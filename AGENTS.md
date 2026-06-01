# AGENTS.md

This repository is a Vite + React + TypeScript frontend app with Tailwind CSS, shadcn/ui-style components, React Router, TanStack Query, and Supabase integration.

## Key facts

- `package.json` scripts:
  - `npm run dev` → Vite development server
  - `npm run build` → production build
  - `npm run lint` → ESLint across the repo
  - `npm run preview` → preview built app
  - `npm run test` → Vitest run
  - `npm run test:watch` → Vitest watch mode
- The repository includes both `package-lock.json` and `bun.lockb`.
- The app uses the `@` alias for `src` paths.
- `src/App.tsx` is the main router definition.
- UI components are in `src/components`, with reusable shadcn-style components under `src/components/ui`.
- Supabase integration lives under `src/integrations/supabase` and `supabase/`.

## Architecture

- `src/App.tsx` defines top-level routes and nested admin routes.
- `src/pages` contains page views.
- `src/components` contains reusable UI and admin layout components.
- `src/hooks` contains custom hooks for theme, auth, user role, mobile detection, and toasts.
- `src/lib/utils.ts` exports the `cn` helper that uses `clsx` + `tailwind-merge`.
- `src/integrations/supabase/client.ts` exports the Supabase client, while `src/integrations/supabase/types.ts` contains generated database types.

## Supabase notes

- `supabase/config.toml` and `supabase/migrations` define backend configuration and schema.
- `supabase/functions/chat/index.ts` is a Supabase function.
- The frontend uses environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.

## Conventions for agents

- Prefer adding new pages under `src/pages` and new shared UI under `src/components`.
- For admin screens, use `src/pages/admin` and the nested route structure in `src/App.tsx`.
- Keep the comment in `src/App.tsx` that limits custom routes above the catch-all route.
- Use existing UI primitives from `src/components/ui` when possible.
- Follow TypeScript and ESLint conventions from `eslint.config.js`.

## Useful places for edits

- Routing: `src/App.tsx`
- Main layout and pages: `src/pages/*`
- Admin area: `src/components/admin/*` and `src/pages/admin/*`
- Supabase client: `src/integrations/supabase/client.ts`
- Theme/toggle state: `src/hooks/useTheme.tsx`

## What agents should avoid

- Do not assume there is a backend API beyond Supabase and the Supabase functions directory.
- Do not create a different routing system; use React Router v6.
- Do not change the `@` alias without also updating `vite.config.ts`.

## Setup hints

- Install dependencies with `npm install` or `bun install` if Bun is available.
- Start development with `npm run dev`.
- Use `npm run lint` before submitting code changes.
- Use `npm run test` to validate tests.
