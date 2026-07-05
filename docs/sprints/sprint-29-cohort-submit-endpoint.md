# Sprint 29 — Cohort Submit Endpoint

## Objective

Implement `POST /v1/cohorts/:cohortId/submit` as specified in `API_SPEC.md`, which freezes a draft cohort and transitions it to submitted status.

## Documentation to Read

1. `API_SPEC.md` L103–L108 — endpoint specification, blocking-flag prerequisite.
2. `FEATURE_SPECIFICATION.md` §3 — cohort criteria builder, submit gate.
3. `AI_ARCHITECTURE.md` — compliance flagging relationship to submit gate.
4. `DATABASE_DESIGN.md` — cohort status transitions.
5. `docs/ai/antigravity-playbook.md`

## Scope

**In scope:**
- Implement `POST /v1/cohorts/:cohortId/submit` in `services/api/src/cohorts/`.
- Validate no unresolved `blocking` compliance flags remain.
- Transition cohort status from `draft` to `submitted`.
- Log the submit event in `audit_log`.
- Unit tests.

**Out of scope:**
- Circuit generation trigger (v0.8 dependency).
- Compliance flagging itself (separate endpoint).

## Files

- `services/api/src/cohorts/cohorts.controller.ts` — add submit route
- `services/api/src/cohorts/cohorts.service.ts` — add submit logic
- `services/api/src/cohorts/__tests__/cohorts.service.spec.ts` — add submit tests

## Architecture Constraints

- Any write to `audit_log` must go exclusively through `services/api/src/audit/audit.service.ts` (Sprint 3's single-write-path rule) — no controller or service writes to that table directly.

## Acceptance Criteria

- [ ] `POST /v1/cohorts/:cohortId/submit` transitions status from `draft` to `submitted`.
- [ ] Rejects submission if blocking compliance flags exist (`409 UNRESOLVED_FLAGS`).
- [ ] Rejects submission if cohort is already submitted or active (`409 INVALID_STATE`).
- [ ] `audit_log` entry created.
- [ ] Only `hospital_admin` or `compliance_officer` on the owning org can submit.
- [ ] Unit tests pass.

## Definition of Done

- [ ] Acceptance criteria met and tested.
- [ ] Standard error envelope used.
- [ ] No patient data handling introduced.

## Stop Condition

Stop once the submit endpoint is implemented and tested. Do not implement circuit generation. do not begin the next numbered sprint in this same branch or session.
