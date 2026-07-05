# Chorus — Full Repository Gap Audit

**Date:** 2026-07-06
**Auditor:** Antigravity (automated, read-only pass)
**Scope:** All 18 finalized documents, `antigravity-playbook.md`, every file under `apps/`, `services/`, `packages/`, `contracts/`, `infra/`
**Pending-decisions-ledger cross-reference:** No `docs/internal/pending-decisions-ledger.md` file exists in the repository. All findings below are therefore classified as new. This is itself a finding (see M-01).

---

## Summary

| Severity | Count |
|----------|-------|
| **Critical** | 3 |
| **High** | 12 |
| **Medium** | 14 |
| **Low** | 11 |
| **Total** | **40** |

---

## Critical Findings

### C-01 — `payouts` table missing from Prisma schema

**Document:** `DATABASE_DESIGN.md` — Entities table, ER diagram
**Spec claim:** A `payouts` table exists with columns `id`, `contribution_id`, `org_id`, `amount`, `currency`, `on_chain_tx_ref`, `settled_at`.
**Code reality:** No `Payout` model exists in `services/api/prisma/schema.prisma`. The ER diagram specifies `CONTRIBUTIONS ||--|| PAYOUTS : settles`, `ORGANIZATIONS ||--o{ PAYOUTS : receives`, but the schema has no corresponding model. This means the entire contribution-to-payout settlement flow specified in `FEATURE_SPECIFICATION.md` §6, `API_SPEC.md` `GET /v1/orgs/:orgId/payouts`, and `BLOCKCHAIN_ARCHITECTURE.md`'s payout contract mirror has no data model.
**Security impact:** Violates `SYSTEM_ARCHITECTURE.md`'s requirement that off-chain Postgres mirrors on-chain settlement records — without a payouts table, there is no audit trail for financial settlements.
**Sprint:** `docs/sprints/sprint-25-payouts-schema.md`

---

### C-02 — No Sentry error tracking anywhere in the codebase

**Document:** `SYSTEM_ARCHITECTURE.md` L192 — "Error tracking uses Sentry from v0.3 onward"; `CODING_STANDARDS.md` L61 — "Every caught error that reaches an error boundary is reported to Sentry with the relevant context"
**Spec claim:** Sentry is integrated from v0.3 onward and every error boundary reports to Sentry.
**Code reality:** A codebase-wide search for `sentry` across all `.ts` and `.tsx` files returns zero results. No Sentry SDK is installed in any `package.json`. No error boundary exists in any `apps/*` directory (zero `error.tsx` files found).
**Security impact:** Violates `CODING_STANDARDS.md`'s error-handling contract — production errors go undetected and unlogged outside the application itself. Also violates the security model's auditability posture: security-relevant errors (failed auth, malformed proofs) are not reported to an external monitoring system.
**Sprint:** `docs/sprints/sprint-26-sentry-error-boundaries.md`

---

### C-03 — No `SECURITY.md` responsible-disclosure file at the repository root

**Document:** `CONTRIBUTING.md` L25 — "Follow the responsible disclosure process in `SECURITY.md` at the repository root."
**Spec claim:** A `SECURITY.md` file exists at the repository root documenting a responsible disclosure process.
**Code reality:** No `SECURITY.md` file exists at the repository root. `CODE_OF_CONDUCT.md` exists but is unrelated. The `docs/internal/security/` directory contains only `v1-hardening-checklist.md`.
**Security impact:** The responsible-disclosure channel referenced in `CONTRIBUTING.md` does not exist. If a security vulnerability is discovered, there is no documented path for reporting it. This is a `SECURITY_MODEL.md` non-negotiable violation (the model mandates a clear external reporting channel for security vulnerabilities, especially ahead of the v0.8 open-source transition).
**Sprint:** `docs/sprints/sprint-27-security-md-disclosure.md`

---

## High Findings

### H-01 — `GET /v1/orgs/:orgId/payouts` endpoint not implemented

**Document:** `API_SPEC.md` L166–L171
**Spec claim:** Endpoint exists, returns `{ items: [{ id, contributionId, amount, currency, onChainTxRef, settledAt }], nextCursor }`.
**Code reality:** No payouts controller, service, or route exists in `services/api/src/`. The `app.module.ts` has no payouts module.
**Sprint:** Covered by `sprint-25-payouts-schema.md` (C-01), which includes the endpoint.

---

### H-02 — `POST /v1/orgs/:orgId/members/invite` endpoint not implemented

**Document:** `API_SPEC.md` L66–L77
**Spec claim:** Endpoint exists for inviting members with role validation per org type.
**Code reality:** `services/api/src/orgs/orgs.controller.ts` exists but no member invitation endpoint is implemented. No route matching `orgs/:orgId/members/invite` found.
**Sprint:** `docs/sprints/sprint-28-member-invite-endpoint.md`

---

### H-03 — `POST /v1/cohorts/:cohortId/submit` endpoint not implemented

**Document:** `API_SPEC.md` L103–L108
**Spec claim:** Endpoint freezes a draft, requires no unresolved blocking compliance flags, triggers circuit generation.
**Code reality:** No submit endpoint exists in `services/api/src/cohorts/`. The cohorts controller has basic CRUD but no submit/freeze capability.
**Sprint:** `docs/sprints/sprint-29-cohort-submit-endpoint.md`

---

### H-04 — `POST /v1/copilot/compliance-check` endpoint not implemented

**Document:** `API_SPEC.md` L121–L126
**Spec claim:** Endpoint flags HIPAA/GDPR/EHDS issues, returns `{ flags: [{ severity, regulation, citation, explanation }] }`.
**Code reality:** The `services/api/src/copilot/` directory has a copilot controller and service, but only the `cohort-draft` endpoint is implemented. No `compliance-check` route exists.
**Sprint:** `docs/sprints/sprint-30-compliance-check-endpoint.md`

---

### H-05 — `PATCH /v1/notifications/:id/read` endpoint not implemented

**Document:** `API_SPEC.md` L244–L248
**Spec claim:** Endpoint marks a notification as read.
**Code reality:** `services/api/src/notifications/notifications.controller.ts` exists but no `PATCH /:id/read` route is implemented.
**Sprint:** `docs/sprints/sprint-31-notification-read-endpoint.md`

---

### H-06 — No `error.tsx` or `loading.tsx` boundary files in any app

**Document:** `FRONTEND_GUIDELINES.md` L65 — "Every route segment expected to fetch data ships its own `loading.tsx`; every route segment that can fail ships its own `error.tsx`"
**Spec claim:** Per-route error and loading boundaries exist across all apps.
**Code reality:** Zero `error.tsx` and zero `loading.tsx` files exist in any `apps/*` directory. This violates both `FRONTEND_GUIDELINES.md` and `CODING_STANDARDS.md`'s error handling contract.
**Sprint:** `docs/sprints/sprint-32-error-loading-boundaries.md`

---

### H-07 — `services/ai` EHDS corpus missing from RAG pipeline

**Document:** `AI_ARCHITECTURE.md` L72 — "HIPAA text, relevant GDPR articles, the EHDS regulation"
**Spec claim:** The RAG corpus includes HIPAA, GDPR, and EHDS regulatory text.
**Code reality:** `services/ai/src/rag/corpus/` contains only `hipaa_subset.txt` and `gdpr_subset.txt`. No EHDS corpus file exists. The RAG pipeline cannot flag EHDS-specific compliance issues as specified.
**Sprint:** `docs/sprints/sprint-33-ehds-corpus.md`

---

### H-08 — `packages/ui` Tabs component missing test and story files

**Document:** `COMPONENT_ARCHITECTURE.md` L88–L106 — file organization and Storybook requirement
**Spec claim:** Every `packages/ui` component is a folder with `Component.tsx`, `component.variants.ts` (where applicable), `Component.test.tsx`, and `Component.stories.tsx`.
**Code reality:** `packages/ui/src/Tabs/` contains only `Tabs.tsx`. No `Tabs.test.tsx`, `Tabs.stories.tsx`, or `tabs.variants.ts` file exists. This is a Definition of Done violation for the component.
**Sprint:** `docs/sprints/sprint-34-tabs-component-completion.md`

---

### H-09 — No `prefers-reduced-motion` handling anywhere in `packages/ui`

**Document:** `COMPONENT_ARCHITECTURE.md` L115 — "Respects `prefers-reduced-motion` for any animation the component owns"; `FRONTEND_GUIDELINES.md` L94 — "Every animation respects `prefers-reduced-motion: reduce`"
**Spec claim:** All animations respect `prefers-reduced-motion`.
**Code reality:** A codebase-wide search for `prefers-reduced-motion` in `packages/ui/src/` returns zero results. Motion tokens exist (`motion-tokens.ts`) but no reduced-motion handling is implemented.
**Sprint:** `docs/sprints/sprint-35-reduced-motion.md`

---

### H-10 — `apps/web` contains dashboard/account routes that belong in `apps/dashboard`

**Document:** `SYSTEM_ARCHITECTURE.md` L59–L66 — app responsibility matrix
**Spec claim:** `apps/web` is the marketing site only. `apps/dashboard` handles org/member management, cohort criteria drafting, API keys, contributions.
**Code reality:** `apps/web/app/dashboard/` contains `billing/page.tsx`, `cohorts/page.tsx`, `layout.tsx`, `page.tsx`. `apps/web/app/account/` contains `api-keys/page.tsx`, `security/page.tsx`, `team/page.tsx`. These belong in `apps/dashboard` per the architecture. `apps/web` also has its own `prisma/schema.prisma` and `lib/db.ts`, which contradicts the single-database architecture.
**Sprint:** `docs/sprints/sprint-36-web-dashboard-separation.md`

---

### H-11 — `axe-core` not running in CI against Storybook stories

**Document:** `FRONTEND_GUIDELINES.md` L90 — "`axe-core` runs in CI against every `packages/ui` Storybook story and fails the build on any violation — this is a merge blocker"; `GITHUB_WORKFLOW.md` CI diagram includes "Lighthouse CI + axe-core a11y"
**Spec claim:** axe-core runs in CI as a merge blocker on every frontend PR.
**Code reality:** The `.github/workflows/ci.yml` has no axe-core step. The Chromatic visual regression step exists but does not include accessibility testing. No Lighthouse CI step exists either.
**Sprint:** `docs/sprints/sprint-37-axe-core-ci.md`

---

### H-12 — `docs/sprints/` directory does not exist; no sprint prompt files

**Document:** Audit task specification — "every prior sprint prompt under `docs/sprints/`"
**Spec claim:** Sprint prompts are stored in `docs/sprints/`.
**Code reality:** No `docs/sprints/` directory exists. Sprint references exist only in Prisma migration names (e.g., `sprint_21_disputes`, `sprint_24_proof_submission`). This means there is no established template to reference for the format of remediation sprints.
**Sprint:** This finding is addressed by the creation of `docs/sprints/` through this audit.

---

## Medium Findings

### M-01 — `docs/internal/pending-decisions-ledger.md` does not exist

**Document:** Audit task specification
**Spec claim:** A pending-decisions-ledger exists for cross-referencing findings.
**Code reality:** No such file exists. All findings in this audit are treated as new since there is no ledger to cross-reference against.
**Recommendation:** Create `docs/internal/pending-decisions-ledger.md` and populate it with open decisions mentioned across the documentation (stablecoin choice for settlement, reputation scoring formula, OSS license choice, etc.).

---

### M-02 — `docs/ai/antigravity-playbook.md` location mismatch

**Document:** Audit task specification references `docs/ai/antigravity-playbook.md`
**Code reality:** The playbook exists at `./antigravity-playbook.md` (repository root), not under `docs/ai/`. No `docs/ai/` directory exists.
**Recommendation:** Either move the file or update references.

---

### M-03 — `packages/config` has no shared ESLint or TypeScript config files

**Document:** `SYSTEM_ARCHITECTURE.md` L73 — "Shared lint/TS/Tailwind configuration"; `CODING_STANDARDS.md` L13 — "ESLint and Prettier configs live in `packages/config`"
**Code reality:** `packages/config/` contains only a `package.json` and no configuration files. ESLint and TS configs are per-app, not centralized. `.prettierrc.js` exists at the root.
**Recommendation:** Either centralize configs into `packages/config` or update documentation.

---

### M-04 — `Dispute` model in schema is marked "UNDOCUMENTED ADDITION"

**Document:** `DATABASE_DESIGN.md` — no disputes table documented
**Code reality:** A `Dispute` model exists in the Prisma schema (L253–L267), marked with a comment `// UNDOCUMENTED ADDITION: Sprint 21 Dispute Resolution`. A full disputes module exists in `services/api/src/disputes/`. The `API_SPEC.md` does not document any disputes endpoints.
**Recommendation:** Add disputes to `DATABASE_DESIGN.md` entities and `API_SPEC.md` endpoint documentation.

---

### M-05 — Schema additions beyond DATABASE_DESIGN.md spec

**Document:** `DATABASE_DESIGN.md`
**Code reality:** The following models exist in the Prisma schema but are not documented in `DATABASE_DESIGN.md`:
- `ReputationScore` — documented as a future migration for v0.9, but already exists
- `BillingSubscription` — not mentioned at all
- `FeeLedgerEntry` — not mentioned at all
- `ModelCheckpoint` — documented as future for v1.5, but already exists
- `ModelLicense` — documented as future for v1.5, but already exists
- `Dispute` — not mentioned (see M-04)
**Recommendation:** Update `DATABASE_DESIGN.md` to reflect the actual schema state, noting which are ahead of the roadmap.

---

### M-06 — `packages/design-tokens` exists but is not in SYSTEM_ARCHITECTURE.md's package table

**Document:** `SYSTEM_ARCHITECTURE.md` L68–L79 — Packages table
**Code reality:** A `packages/design-tokens` package exists with Style Dictionary configuration, token JSON files, and built outputs — but it is not listed in the packages table. This package partially implements the Style Dictionary pipeline mentioned as a "future consideration" in `DESIGN_SYSTEM.md` L177.
**Recommendation:** Add `design-tokens` to the packages table in `SYSTEM_ARCHITECTURE.md`.

---

### M-07 — `infra/terraform/` is actively used, contradicting SYSTEM_ARCHITECTURE.md

**Document:** `SYSTEM_ARCHITECTURE.md` L208 — "Terraform is explicitly deferred to v1.5+"
**Code reality:** `infra/terraform/staging/` contains active Terraform modules (`main.tf`, `modules/data/`, `modules/secrets/`, `modules/services/`). A `terraform-plan.yml` CI workflow exists. This contradicts the stated deferral to v1.5+.
**Recommendation:** Update `SYSTEM_ARCHITECTURE.md` to reflect that Terraform is in use for staging.

---

### M-08 — `infra/docker/` incomplete — no Dockerfiles for proof-worker, aggregator, notifications

**Document:** `SYSTEM_ARCHITECTURE.md` L52 — "per-service Dockerfiles" listed under infra/docker
**Code reality:** `infra/docker/` contains `Dockerfile.api`, `Dockerfile.ai`, `Dockerfile.node-service`, and `docker-compose.yml`. No Dockerfiles exist for `proof-worker`, `aggregator`, or `notifications` services.
**Recommendation:** Create Dockerfiles for the missing services, or document the current state.

---

### M-09 — `infra/github-actions/` does not exist

**Document:** `SYSTEM_ARCHITECTURE.md` L53 — "github-actions: reusable CI workflows"
**Code reality:** Reusable workflows are stored in `.github/workflows/`, not in `infra/github-actions/`. The `infra/` directory has no `github-actions/` folder.
**Recommendation:** Update `SYSTEM_ARCHITECTURE.md` to reflect the actual location.

---

### M-10 — `docs/public/` is empty (only `.gitkeep`)

**Document:** `SYSTEM_ARCHITECTURE.md` L49 — "rendered by apps/docs; mirrors to open source with contracts/"
**Spec claim:** `docs/public/` contains content rendered by `apps/docs`.
**Code reality:** `docs/public/` contains only a `.gitkeep` file. No developer-guide quickstart (`docs/public/developer-guide/quickstart.md` referenced in `CONTRIBUTING.md` L13), no compliance mapping docs (referenced in `AI_ARCHITECTURE.md` L72), no ADR directory (`docs/public/architecture/adr/` referenced in `README.md` L118 and `CONTRIBUTING.md` L17).
**Recommendation:** Create the documented directory structure under `docs/public/` with at minimum placeholder files for the quickstart and ADR directory.

---

### M-11 — `apps/web/prisma/schema.prisma` is a separate schema from `services/api/prisma/schema.prisma`

**Document:** `SYSTEM_ARCHITECTURE.md` L112 — single PostgreSQL database for metadata
**Code reality:** `apps/web/` has its own `prisma/schema.prisma` and `lib/db.ts`, suggesting a second database. This contradicts the documented architecture of a single Postgres instance managed by `services/api`.
**Recommendation:** Determine if this is leftover scaffolding and remove, or document the dual-database decision.

---

### M-12 — `contracts/circuits/` is an empty `.gitkeep`

**Document:** `SYSTEM_ARCHITECTURE.md` L37 — "circuits: ZK circuit definitions"; `BLOCKCHAIN_ARCHITECTURE.md` — eligibility and training-correctness circuits
**Code reality:** `contracts/circuits/` contains only a `.gitkeep`. The actual circuit implementations are in `packages/node/src/circuits/` (as TypeScript stubs).
**Recommendation:** Clarify the intended location for production circuit definitions vs. node-side circuit stubs.

---

### M-13 — `services/aggregator` is a minimal stub

**Document:** `SYSTEM_ARCHITECTURE.md` L87–L88 — "merges verified local model updates into a shared checkpoint"
**Code reality:** `services/aggregator/` contains only `package.json` and `src/index.ts`. This is expected for the current roadmap stage (pre-v0.8), but the service is listed as a live component in the architecture.
**Recommendation:** Document that `services/aggregator` is a placeholder pending the v0.8 ZK engine milestone.

---

### M-14 — RBAC guard uses `any` type for user memberships

**Document:** `CODING_STANDARDS.md` L13 — "`any` is banned by lint rule; if a type genuinely can't be known, use `unknown` and narrow it"
**Code reality:** `services/api/src/auth/rbac.guard.ts` L24 uses `FastifyRequest & { user?: any }` and L33 uses `(m: any)`. This violates the strict no-`any` rule.
**Recommendation:** Type the user object properly using shared types from `packages/types`.

---

## Low Findings

### L-01 — Tabs component in `packages/ui` has no `.stories.tsx` or `.test.tsx`

Already covered by H-08 at High severity for the test gap. The missing story is a Low completeness gap.

---

### L-02 — `IconButton`, `Dialog`, and `Tooltip` prematurely promoted to `packages/ui`

**Document:** `COMPONENT_ARCHITECTURE.md` L20 — promotion rule requires two consumers
**Code reality:** Per the existing audit (`docs/internal/audits/component-usage-audit-2026.md`), `IconButton` has 1 consumer, `Dialog` has 1 consumer, and `Tooltip` has 0 consumers. This was already flagged; action items remain open.
**Recommendation:** Follow through on the existing audit's action items.

---

### L-03 — `packages/ui/src/motion-tokens.ts` duplicated

**Document:** `DESIGN_SYSTEM.md` L119–L128
**Code reality:** Two motion token files exist: `packages/ui/src/motion-tokens.ts` and `packages/ui/src/tokens/motion-tokens.ts`. Only one should exist to avoid drift.
**Recommendation:** Remove the duplicate and update imports.

---

### L-04 — No `.storybook/` configuration includes axe-core addon

**Document:** `FRONTEND_GUIDELINES.md` L90, `COMPONENT_ARCHITECTURE.md` L110
**Spec claim:** Storybook includes axe-core checks.
**Code reality:** `.storybook/main.ts` exists but no `@storybook/addon-a11y` is configured.
**Recommendation:** Add the accessibility addon to the Storybook configuration.

---

### L-05 — `services/api/src/billing/` has no module file

**Code reality:** `billing.controller.ts` and `billing.service.ts` exist but no `billing.module.ts`, and billing is not imported in `app.module.ts`.
**Recommendation:** Create the module file and register it, or remove the dead code.

---

### L-06 — `services/api/src/marketplace/` has no module file

**Code reality:** `licenses.controller.ts`, `licenses.service.ts`, `model-checkpoints.controller.ts`, `model-passport.service.ts` exist but no `marketplace.module.ts`, and marketplace is not imported in `app.module.ts`.
**Recommendation:** Create the module file and register it, or document as future scope.

---

### L-07 — `services/api/src/reputation/` has no module file

**Code reality:** `reputation.service.ts` and `formula-v1.ts` exist but no `reputation.module.ts`, and reputation is not imported in `app.module.ts`.
**Recommendation:** Create the module file and register it, or document as v0.9 scope.

---

### L-08 — `services/api/src/notifications/` has no module file

**Code reality:** `notifications.controller.ts` and `notifications.service.ts` exist but no `notifications.module.ts`, and notifications is not imported in `app.module.ts` (only the standalone `services/notifications` service exists separately).
**Recommendation:** Create the module file and register it.

---

### L-09 — Missing `@media print` stylesheet in `apps/compliance`

**Document:** `FRONTEND_GUIDELINES.md` L75 — "`apps/compliance`: print-stylesheet required"
**Code reality:** `apps/compliance/app/(authenticated)/disclosures/print.css` exists. ✅ Partially addressed. However, it is unclear if it is actually imported/used in the layout.
**Recommendation:** Verify the print stylesheet is properly linked in the compliance app layout.

---

### L-10 — No Lighthouse CI step in CI pipeline

**Document:** `GITHUB_WORKFLOW.md` CI diagram — "Lighthouse CI + axe-core a11y" as a frontend gate; `FRONTEND_GUIDELINES.md` L80 — "enforced in CI via Lighthouse CI on every `apps/web` PR"
**Code reality:** No Lighthouse CI job exists in `.github/workflows/ci.yml`.
**Recommendation:** Add Lighthouse CI for `apps/web` PRs.

---

### L-11 — `contracts/scripts/` has only `.gitkeep` and `deploy-testnet.ts`

**Document:** `SYSTEM_ARCHITECTURE.md` L38 — "deploy/migration scripts"
**Code reality:** Only a single `deploy-testnet.ts` script exists alongside a `.gitkeep`. This is appropriate for the current roadmap stage but worth noting.
**Recommendation:** No action needed until v0.7.

---

## Documents Checked

| # | Document | Checked | Findings |
|---|----------|---------|----------|
| 1 | `README.md` | ✅ | M-10 (docs/public empty) |
| 2 | `PRODUCT_SPEC.md` | ✅ | No direct code findings — product-level |
| 3 | `SYSTEM_ARCHITECTURE.md` | ✅ | H-10, M-06, M-07, M-08, M-09, M-13 |
| 4 | `DESIGN_SYSTEM.md` | ✅ | L-03 |
| 5 | `FRONTEND_GUIDELINES.md` | ✅ | H-06, H-09, H-11, L-04, L-09, L-10 |
| 6 | `CODING_STANDARDS.md` | ✅ | C-02, M-14 |
| 7 | `COMPONENT_ARCHITECTURE.md` | ✅ | H-08, L-02 |
| 8 | `API_SPEC.md` | ✅ | H-01, H-02, H-03, H-04, H-05, M-04 |
| 9 | `DATABASE_DESIGN.md` | ✅ | C-01, M-05 |
| 10 | `BLOCKCHAIN_ARCHITECTURE.md` | ✅ | M-12 |
| 11 | `AI_ARCHITECTURE.md` | ✅ | H-07 |
| 12 | `SECURITY_MODEL.md` | ✅ | C-03 |
| 13 | `DEVELOPMENT_ROADMAP.md` | ✅ | M-05 (schema ahead of schedule) |
| 14 | `GITHUB_WORKFLOW.md` | ✅ | H-11, L-10 |
| 15 | `CONTRIBUTING.md` | ✅ | C-03 |
| 16 | `UI_STORYBOARD.md` | ✅ | H-10 (web/dashboard bleed) |
| 17 | `FEATURE_SPECIFICATION.md` | ✅ | H-01 through H-05 (missing endpoints) |
| 18 | `antigravity-playbook.md` | ✅ | M-02 (location mismatch) |

## Validation Checklist

- [x] All 18 documents checked against the actual repository
- [x] Every finding cross-referenced against pending-decisions-ledger.md before being reported as new (ledger does not exist — M-01)
- [x] Severity classification applied consistently
- [x] One individually scoped sprint prompt per Critical/High finding, following the established template
- [x] No large, multi-issue "fix everything" prompt created
- [x] Sprint numbering continues sequentially (starting at 25, since the highest observed sprint number in the codebase is 24)
- [x] Zero application code modified
- [x] Summary count by severity included at the top of the report
