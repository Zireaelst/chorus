# Sprint 28 — Member Invite Endpoint

## Objective

Implement `POST /v1/orgs/:orgId/members/invite` as specified in `API_SPEC.md`.

## Documentation to Read

1. `API_SPEC.md` L66–L77 — endpoint specification, role validation per org type.
2. `SECURITY_MODEL.md` — RBAC enforcement, audit logging.
3. `DATABASE_DESIGN.md` — memberships table, `CHECK` constraint on role.
4. `FEATURE_SPECIFICATION.md` §1 — org setup and team management acceptance criteria.
5. `docs/ai/antigravity-playbook.md`

## Scope

**In scope:**
- Implement `POST /v1/orgs/:orgId/members/invite` in `services/api/src/orgs/`.
- Validate role against org type (e.g., `hospital` orgs can only invite `hospital_admin`, `compliance_officer`).
- Log the invite event in `audit_log`.
- Return proper error envelope on validation failures.
- Unit tests.

**Out of scope:**
- Email delivery of invitations (handled by `services/notifications`).
- WorkOS SCIM provisioning.

## Files

- `services/api/src/orgs/orgs.controller.ts` — add invite route
- `services/api/src/orgs/orgs.service.ts` — add invite logic
- `services/api/src/orgs/__tests__/orgs.service.spec.ts` — add invite tests
- `packages/types/src/schemas/invite.ts` — [NEW] shared Zod schema

## Architecture Constraints

- Any write to `audit_log` must go exclusively through `services/api/src/audit/audit.service.ts` (Sprint 3's single-write-path rule) — no controller or service writes to that table directly.

## Acceptance Criteria

- [ ] `POST /v1/orgs/:orgId/members/invite` accepts `{ email, role }`.
- [ ] Role validated against org type.
- [ ] `audit_log` entry created for every invite.
- [ ] Unauthorized callers receive `403 FORBIDDEN`.
- [ ] Invalid role returns `422 VALIDATION_ERROR`.
- [ ] Unit tests pass.

## Definition of Done

- [ ] Acceptance criteria met and tested.
- [ ] RBAC enforced server-side.
- [ ] Standard error envelope used.

## Stop Condition

Stop once the invite endpoint is implemented and tested. Do not implement email delivery. do not begin the next numbered sprint in this same branch or session.
