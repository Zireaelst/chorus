# Sprint 26 — Sentry Integration and Error Boundaries

## Objective

Integrate Sentry error tracking across all apps and services, and add per-route `error.tsx` and `loading.tsx` boundary files to every app as specified in `CODING_STANDARDS.md` and `FRONTEND_GUIDELINES.md`.

## Documentation to Read

1. `SYSTEM_ARCHITECTURE.md` L192 — "Error tracking uses Sentry from v0.3 onward."
2. `CODING_STANDARDS.md` L59–L70 — error handling contract, Sentry reporting with context.
3. `FRONTEND_GUIDELINES.md` L65 — per-route `error.tsx` and `loading.tsx` requirements.
4. `SECURITY_MODEL.md` — never log raw request payloads.
5. `docs/ai/antigravity-playbook.md`

## Scope

**In scope:**
- Install `@sentry/nextjs` in all `apps/*` packages.
- Install `@sentry/node` in `services/api`.
- Configure Sentry DSN via environment variable.
- Create `error.tsx` files for every route segment in every app.
- Create `loading.tsx` files for every route segment that fetches data.
- Ensure error boundaries report to Sentry with org ID and route context, never with raw request payloads.

**Out of scope:**
- Sentry for `services/ai` (Python service — separate sprint).
- Performance monitoring / tracing configuration.

## Files

- `apps/web/sentry.client.config.ts` — [NEW]
- `apps/web/sentry.server.config.ts` — [NEW]
- `apps/web/app/error.tsx` — [NEW] (root error boundary)
- `apps/dashboard/app/error.tsx` — [NEW]
- `apps/dashboard/app/(authenticated)/cohorts/error.tsx` — [NEW]
- `apps/dashboard/app/(authenticated)/cohorts/loading.tsx` — [NEW]
- (similar for every route segment in every app)
- `services/api/src/main.ts` — add Sentry initialization
- Each app's `package.json` — add Sentry dependency

## Architecture Constraints

- Never log raw request payloads to Sentry (per `CODING_STANDARDS.md`).
- Error context must include route and org ID, never user-submitted content.
- Sentry DSN must be an environment variable, not hardcoded.

## UI/UX Constraints

- Error boundaries must show a user-friendly fallback, not a stack trace.
- Loading states must use design system tokens.

## Implementation Steps

1. Install `@sentry/nextjs` in each app package.
2. Create Sentry client and server config files per app.
3. Add root `error.tsx` to each app with Sentry reporting.
4. Add per-route `error.tsx` files for every route segment.
5. Add `loading.tsx` files for data-fetching route segments.
6. Install `@sentry/node` in `services/api` and initialize in `main.ts`.
7. Add a global exception filter in NestJS that reports to Sentry.
8. Test that errors are captured without sensitive data.

## Acceptance Criteria

- [ ] Sentry SDK installed and configured in all `apps/*` and `services/api`.
- [ ] Every route segment has an `error.tsx` boundary.
- [ ] Data-fetching routes have `loading.tsx` boundaries.
- [ ] Error reports include route and org context.
- [ ] Error reports never include raw request payloads.
- [ ] A deliberately thrown test error appears in Sentry dashboard.

## Definition of Done

- [ ] Acceptance criteria met and tested.
- [ ] No raw payload logging introduced.
- [ ] All apps have at minimum a root error boundary.

## Validation Checklist

- [ ] Sentry DSN is environment-variable-configured
- [ ] Error boundaries render user-friendly fallbacks
- [ ] Loading states use design system tokens
- [ ] No patient-adjacent data in error reports

## Stop Condition

Stop once Sentry is integrated in all apps and services/api, and error/loading boundaries exist. Do not configure performance monitoring or Python service integration. do not begin the next numbered sprint in this same branch or session.
