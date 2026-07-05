# Sprint 36 — apps/web Dashboard and Account Route Separation

## Objective

Remove dashboard and account routes from `apps/web` that belong in `apps/dashboard` per `SYSTEM_ARCHITECTURE.md`'s app responsibility matrix. Remove the duplicate `prisma/` configuration from `apps/web`.

## Documentation to Read

1. `SYSTEM_ARCHITECTURE.md` L59–L66 — app responsibility matrix.
2. `FRONTEND_GUIDELINES.md` — per-app rendering strategy.
3. `docs/ai/antigravity-playbook.md`

## Scope

**In scope:**
- Remove `apps/web/app/dashboard/` directory (billing, cohorts, layout, page).
- Remove `apps/web/app/account/` directory (api-keys, security, team, layout, page).
- Remove `apps/web/prisma/schema.prisma` and `apps/web/lib/db.ts` and `apps/web/prisma.config.ts`.
- Verify that `apps/dashboard` already has equivalent routes or flag any missing.
- Update any internal navigation links in `apps/web` that pointed to removed routes.

**Out of scope:**
- Building new features in `apps/dashboard`.
- Modifying `apps/dashboard` beyond verifying route parity.

## Files

- `apps/web/app/dashboard/` — [DELETE entire directory]
- `apps/web/app/account/` — [DELETE entire directory]
- `apps/web/prisma/schema.prisma` — [DELETE]
- `apps/web/lib/db.ts` — [DELETE]
- `apps/web/prisma.config.ts` — [DELETE]
- `apps/web/app/components/Navbar.tsx` — update if links to removed routes exist

## Acceptance Criteria

- [ ] No dashboard or account routes remain in `apps/web`.
- [ ] No Prisma configuration remains in `apps/web`.
- [ ] `apps/web` builds successfully after removal.
- [ ] `apps/dashboard` has equivalent routes for the removed functionality.
- [ ] No broken internal navigation links.

## Definition of Done

- [ ] Architecture matches `SYSTEM_ARCHITECTURE.md`'s app responsibility matrix.
- [ ] Both apps build cleanly.

## Stop Condition

Stop once the route separation is complete. Do not add new features to either app. do not begin the next numbered sprint in this same branch or session.
