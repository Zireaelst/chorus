# Sprint 32 — Error and Loading Boundaries

## Objective

Add per-route `error.tsx` and `loading.tsx` files to all Next.js apps as required by `FRONTEND_GUIDELINES.md`.

> **Note:** Sentry reporting within error boundaries is covered in Sprint 26. This sprint focuses on the boundary files themselves and their UI.

## Documentation to Read

1. `FRONTEND_GUIDELINES.md` L65 — per-route `error.tsx`/`loading.tsx` requirements.
2. `DESIGN_SYSTEM.md` — design tokens for loading states.
3. `CODING_STANDARDS.md` — error handling.
4. `docs/ai/antigravity-playbook.md`

## Scope

**In scope:**
- Create `error.tsx` for every route segment in `apps/dashboard`, `apps/compliance`, `apps/research-portal`, `apps/admin`, `apps/docs`.
- Create `loading.tsx` for route segments that fetch data (authenticated routes).
- Use design system tokens for loading skeleton and error UI.
- `error.tsx` must be a client component (`'use client'`) as required by Next.js.

**Out of scope:**
- `apps/web` error boundaries (covered in Sprint 26 alongside Sentry).
- Sentry reporting (Sprint 26).

## Files

Per app, at minimum:
- `app/error.tsx` — root error boundary
- `app/(authenticated)/error.tsx` — authenticated route error boundary
- `app/(authenticated)/loading.tsx` — authenticated route loading state
- Additional per-page boundaries for heavy data-fetching routes

## Acceptance Criteria

- [ ] Every app has at least a root `error.tsx`.
- [ ] Authenticated route groups have `loading.tsx`.
- [ ] Error boundaries render a user-friendly fallback using design system tokens.
- [ ] Loading states use skeleton components or spinners styled with design system tokens.
- [ ] `error.tsx` includes a retry button calling `reset()`.

## Definition of Done

- [ ] All apps have error/loading boundaries.
- [ ] UI uses design system tokens, no raw hex or arbitrary values.

## Stop Condition

Stop once boundaries exist in all apps. Do not implement Sentry reporting (Sprint 26). do not begin the next numbered sprint in this same branch or session.
