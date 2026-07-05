# Sprint 30 — Compliance Check Endpoint

## Objective

Implement `POST /v1/copilot/compliance-check` as specified in `API_SPEC.md`, which proxies a structured cohort criteria draft to `services/ai` for HIPAA/GDPR/EHDS compliance flagging.

## Documentation to Read

1. `API_SPEC.md` L121–L126 — endpoint specification, response shape `{ flags: [...] }`.
2. `AI_ARCHITECTURE.md` — Compliance Flagging Agent, grounded citations, RAG strategy.
3. `FEATURE_SPECIFICATION.md` §4 — AI copilot acceptance criteria.
4. `SECURITY_MODEL.md` — PII pre-filter requirement.
5. `docs/ai/antigravity-playbook.md`

## Scope

**In scope:**
- Implement `POST /v1/copilot/compliance-check` in `services/api/src/copilot/`.
- Proxy the request to `services/ai`'s compliance-flagging endpoint.
- Validate the response against the shared schema before returning.
- Return `{ flags: [{ severity, regulation, citation, explanation }] }`.
- Unit tests.

**Out of scope:**
- Implementing the actual compliance flagging logic in `services/ai` (already exists).
- Modifying the PII pre-filter.

## Files

- `services/api/src/copilot/copilot.controller.ts` — add compliance-check route
- `services/api/src/copilot/copilot.service.ts` — add proxy logic
- `services/api/src/copilot/__tests__/copilot.service.spec.ts` — tests
- `packages/types/src/schemas/compliance-flag.ts` — [NEW] shared Zod schema

## Architecture Constraints

- Any field whose real-world value depends on a decision listed in `docs/internal/pending-decisions-ledger.md` must be flagged as provisional, not silently implemented as if final.

## Acceptance Criteria

- [ ] `POST /v1/copilot/compliance-check` returns `{ flags: [...] }`.
- [ ] Each flag has `severity`, `regulation`, `citation`, `explanation`.
- [ ] Flags without a grounded citation are suppressed.
- [ ] Only `hospital_admin` or `compliance_officer` can call this endpoint.
- [ ] Response validated against shared schema.
- [ ] Unit tests pass.

## Definition of Done

- [ ] Acceptance criteria met and tested.
- [ ] Standard error envelope used.
- [ ] PII check happens before the request reaches `services/ai`.

## Stop Condition

Stop once the compliance-check endpoint is implemented and tested. Do not modify `services/ai` internals. do not begin the next numbered sprint in this same branch or session.
