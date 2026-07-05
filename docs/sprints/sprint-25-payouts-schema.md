# Sprint 25 — Payouts Schema and Endpoint

## Objective

Implement the `payouts` table specified in `DATABASE_DESIGN.md` and the `GET /v1/orgs/:orgId/payouts` endpoint specified in `API_SPEC.md`. The off-chain payouts mirror is a core component of the contribution-to-settlement audit trail.

## Documentation to Read

1. `DATABASE_DESIGN.md` — Payouts entity, ER diagram (`CONTRIBUTIONS ||--|| PAYOUTS : settles`), constraints (ON DELETE RESTRICT), and the future migration note about split-payout support at v1.5.
2. `API_SPEC.md` — `GET /v1/orgs/:orgId/payouts` endpoint specification (L166–L171).
3. `SYSTEM_ARCHITECTURE.md` — event flow diagram showing payout settlement after contribution verification.
4. `BLOCKCHAIN_ARCHITECTURE.md` — payout contract and disclosure catalog.
5. `SECURITY_MODEL.md` — audit logging requirements for financial settlement events.
6. `CODING_STANDARDS.md` — TypeScript conventions, error handling.
7. `docs/ai/antigravity-playbook.md`

## Scope

**In scope:**
- Add the `Payout` model to `services/api/prisma/schema.prisma` matching the `DATABASE_DESIGN.md` specification exactly.
- Create a Prisma migration for the new table.
- Implement `GET /v1/orgs/:orgId/payouts` with proper RBAC (`hospital_admin` on `:orgId`, or `chorus_admin`), cursor-based pagination, and the standard error envelope.
- Add the `Payout` relation to the existing `Contribution` model (one-to-one for MVP).
- Add unit tests for the payouts service.

**Out of scope:**
- Automatic payout triggering from contribution verification (depends on Midnight contract integration, v0.8+).
- Split-payout support (v1.5).
- The payout contract itself (contracts/ layer).

## Files

- `services/api/prisma/schema.prisma` — add `Payout` model
- `services/api/prisma/migrations/…` — generated migration
- `services/api/src/payouts/payouts.controller.ts` — [NEW]
- `services/api/src/payouts/payouts.service.ts` — [NEW]
- `services/api/src/payouts/payouts.module.ts` — [NEW]
- `services/api/src/payouts/__tests__/payouts.service.spec.ts` — [NEW]
- `services/api/src/app.module.ts` — import PayoutsModule
- `packages/types/src/schemas/payout.ts` — [NEW] shared Zod schema

## Architecture Constraints

- `payouts` table must have `ON DELETE RESTRICT` on all foreign keys, per `DATABASE_DESIGN.md` constraints.
- `contribution_id` is a unique foreign key (one-to-one for MVP).
- Every payout write must be recorded in the `audit_log`.
- Response shape must match `API_SPEC.md` exactly: `{ items: [{ id, contributionId, amount, currency, onChainTxRef, settledAt }], nextCursor }`.
- Any write to `audit_log` must go exclusively through `services/api/src/audit/audit.service.ts` (Sprint 3's single-write-path rule) — no controller or service writes to that table directly.
- Any field whose real-world value depends on a decision listed in `docs/internal/pending-decisions-ledger.md` (e.g., payouts.currency) must be flagged as provisional, not silently implemented as if final.

## UI/UX Constraints

Not applicable to this sprint (backend only).

## Implementation Steps

1. Add the `Payout` model to the Prisma schema with all specified columns.
2. Add the relation from `Contribution` to `Payout`.
3. Run `prisma migrate dev` to generate the migration.
4. Create the payouts module, service, and controller.
5. Implement the `GET /v1/orgs/:orgId/payouts` endpoint with cursor-based pagination.
6. Apply RBAC guard (`hospital_admin` on the target org, or `chorus_admin`).
7. Create a shared Zod schema in `packages/types`.
8. Write unit tests.

## Acceptance Criteria

- [ ] `Payout` model exists in `schema.prisma` matching `DATABASE_DESIGN.md` exactly.
- [ ] Migration runs cleanly against a fresh database.
- [ ] `GET /v1/orgs/:orgId/payouts` returns the specified response shape.
- [ ] Endpoint is protected by RBAC: `hospital_admin` on `:orgId` or `chorus_admin`.
- [ ] Unauthorized callers receive `403 FORBIDDEN`.
- [ ] Cursor-based pagination works correctly.
- [ ] Unit tests cover the happy path and authorization checks.

## Definition of Done

- [ ] Acceptance criteria above are met and tested.
- [ ] Tests pass in CI; no new P0/P1 security finding introduced.
- [ ] No patient-adjacent data path introduced.
- [ ] Schema matches `DATABASE_DESIGN.md` specification.

## Validation Checklist

- [ ] Payout model columns match `DATABASE_DESIGN.md` ER diagram
- [ ] Foreign keys use `ON DELETE RESTRICT`
- [ ] `contribution_id` uniqueness enforced
- [ ] Response shape matches `API_SPEC.md`
- [ ] RBAC roles match `API_SPEC.md`
- [ ] Standard error envelope used

## Stop Condition

Stop once the Payout model, migration, endpoint, and tests are complete. Do not implement automatic payout triggering or contract integration. do not begin the next numbered sprint in this same branch or session.
