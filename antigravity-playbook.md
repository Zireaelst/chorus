# Antigravity playbook

## Purpose and scope

This is the permanent operating manual for Antigravity on the Chorus codebase. It does not repeat what's already documented — it tells you what to read, in what order, and how to behave when writing code. The architecture, product decisions, and standards referenced below are frozen. Your job is to implement within them, not to reinterpret them.

If something here ever seems to conflict with a referenced document, the referenced document wins for its subject matter; this playbook governs *behavior*, not *decisions already made*.

## Priority order of documentation

Read in this order before touching code. Don't skip ahead because a task looks simple.

1. **`SYSTEM_ARCHITECTURE.md`** and **`PRODUCT_SPEC.md`** — the non-negotiable ground truth. Never propose a change that contradicts these without flagging it as an ADR candidate first (see `CONTRIBUTING.md`).
2. **`SECURITY_MODEL.md`** — constraints that override convenience, deadline pressure, or a cleaner-looking implementation, always.
3. **The domain doc for what you're building** — `API_SPEC.md`, `DATABASE_DESIGN.md`, `BLOCKCHAIN_ARCHITECTURE.md`, or `AI_ARCHITECTURE.md`.
4. **The frontend doc set** — `FRONTEND_GUIDELINES.md`, `DESIGN_SYSTEM.md`, `COMPONENT_ARCHITECTURE.md` — for any UI work.
5. **`CODING_STANDARDS.md`** — naming, file organization, and style, for everything.
6. **`FEATURE_SPECIFICATION.md`** — the specific feature's purpose, inputs/outputs, and acceptance criteria.
7. **`GITHUB_WORKFLOW.md`** and **`CONTRIBUTING.md`** — how the change ships.
8. **`DEVELOPMENT_ROADMAP.md`** — confirms the feature is actually in scope for the current version.
9. **`UI_STORYBOARD.md`** — the intended user experience, for anything touching a screen a person interacts with.

If two documents genuinely conflict, stop and surface the conflict rather than silently picking one — that's an ADR-worthy gap, not a judgment call for you to make alone.

## General engineering principles

- The architecture is frozen. You implement it; you don't redesign it mid-task.
- Prefer the boring, already-established pattern over a novel one. A new abstraction must justify itself against the promotion rules in `COMPONENT_ARCHITECTURE.md` and `CODING_STANDARDS.md`, not just look cleaner to you in isolation.
- Privacy is default, disclosure is explicit, AI assists but never decides — restated from `PRODUCT_SPEC.md`'s product principles because they govern implementation choices, not just product ones.
- Small, reviewable diffs beat large, impressive ones. A PR a human can actually review carefully is worth more than a PR that does more.

## Code generation rules

- Read every doc in the priority list relevant to the task before generating anything.
- Implement one feature or story at a time — see Sprint workflow below.
- Never leave a silent stub, placeholder, or `TODO` in place of a real implementation. If something can't be completed (missing dependency, unresolved doc ambiguity, a decision only a human can make), say so explicitly in your response — don't paper over it with a fake implementation.
- Comments explain *why*, never *what* — the code already says what; a comment repeating it is noise.
- Never introduce a new third-party dependency without flagging it explicitly as a decision for human confirmation.

## Repository boundaries

**You may:** add and modify implementation files inside `apps/*`, `services/*`, and `packages/*`, following existing structure; add tests and Storybook stories; extend `docs/public/` content that is explicitly part of your task (e.g., updating API reference text alongside an endpoint change).

**You may not, without explicit human confirmation:**
- Modify any file under `docs/` other than the one you were asked to change — these are finalized; "fixing" one as a side effect of an unrelated task is out of scope.
- Modify `packages/config` or any CI workflow file — these affect every app and service at once.
- Modify or deploy anything under `contracts/` without the independent ZK/Midnight sign-off required by `GITHUB_WORKFLOW.md`. You may draft contract code; you never merge or deploy it autonomously.
- Add a code path where patient data, a model gradient, or a proof witness would touch Chorus-operated infrastructure — this boundary is absolute regardless of what a task description implies is needed.

## Frontend implementation rules

- Server Components by default; `'use client'` only at the smallest leaf that genuinely needs it — see `FRONTEND_GUIDELINES.md`.
- Every color, spacing, radius, and motion value comes from `DESIGN_SYSTEM.md` tokens. No raw hex codes or arbitrary pixel values.
- Variants use `cva`, not hand-rolled conditional class strings — see `COMPONENT_ARCHITECTURE.md`.
- A component goes in `packages/ui` only once a second real consumer exists — never speculatively.
- Every icon-only interactive element requires an accessible name at the type level, not as an afterthought.
- The verify-amber accent is reserved for cryptographic verification moments only — never for hover, active state, or generic emphasis.

## Backend implementation rules

- Respect the service boundaries in `SYSTEM_ARCHITECTURE.md` — don't add proof verification or aggregation logic to `services/api`; it belongs in `proof-worker`/`aggregator`.
- PostgreSQL holds metadata only. If a column you're about to add could ever contain patient-identifiable content, stop — that's a design defect, not a review note.
- Any mutating endpoint with an on-chain or payment effect requires an `Idempotency-Key`, per `API_SPEC.md`.
- Use the standard error envelope and error taxonomy from `API_SPEC.md` — don't invent a new error shape for a new endpoint.
- Slow or uncertain-duration work goes through the Redis/BullMQ queue, never a synchronous request handler.

## AI module rules

- `services/ai` never receives a database credential. If a task seems to require one, the task is misscoped — flag it.
- The PII pre-filter runs before any text reaches a model call, with no exceptions for "just this one internal test."
- Every model output is validated against its schema before use; a response that fails validation is discarded, never "repaired" by asking the model to retry with the same prompt.
- Every compliance flag must cite a retrieved source. No ungrounded flag ships.
- A prompt or model change does not merge until it passes the golden-set evaluation suite in CI, per `AI_ARCHITECTURE.md` and `GITHUB_WORKFLOW.md`.

## Midnight/Compact integration rules

- Every `contracts/` change requires two approvals plus an independent ZK/Midnight engineer's sign-off, regardless of how small the diff looks or who/what drafted it.
- Any new or modified `disclose()` point must be checked against the existing disclosure catalog in `BLOCKCHAIN_ARCHITECTURE.md` before it's added — a new disclosure path is a trust-model change, not a routine implementation detail.
- Never propose a mutable/upgradeable-proxy contract pattern. Versioning goes through the registry pattern already established.
- `proof-worker` performs pre-validation only; never implement or imply that an off-chain service is the authoritative verifier — the network's consensus is.

## Security requirements

Non-negotiable, restated from `SECURITY_MODEL.md` because they apply to every line of code you write, not only security-labeled tasks: enforce authorization server-side regardless of what the frontend already checks; treat every third-party API response (WorkOS, model provider, Midnight RPC) as untrusted input; never log a secret, API key, or session token, even partially; never assume a client-supplied value is safe because the UI wouldn't normally send a bad one.

## Refactoring policy

Refactors are welcome, kept separate from feature PRs — never bundle the two, since a mixed diff is unreviewable. A refactor that changes an architectural decision (not just tidies code within an existing one) requires an ADR first, per `CONTRIBUTING.md`. Don't refactor code you weren't asked to touch as a side effect of an unrelated task, even if you notice something you'd do differently.

## Testing expectations

Vitest and React Testing Library, querying by role and accessible name, testing behavior not implementation — see `CODING_STANDARDS.md`. Every PR you open includes tests covering its acceptance criteria from `FEATURE_SPECIFICATION.md`. Domain-specific additions apply on top of this baseline: the golden-set suite for any `services/ai` change, the contract test suite for any `contracts/` change, `axe-core` with zero violations for any new or modified `packages/ui` component.

## Definition of Done

Before you consider a task complete:

- [ ] Acceptance criteria from `FEATURE_SPECIFICATION.md` (or the linked backlog story) are met and tested.
- [ ] Tests pass in CI; no new P0/P1 security finding introduced.
- [ ] Documentation updated if behavior visible to a user or another engineer changed.
- [ ] Accessibility contract satisfied for any new UI (`COMPONENT_ARCHITECTURE.md`).
- [ ] `contracts/` or `packages/node` changes carry the required independent ZK sign-off request.
- [ ] No patient-adjacent data path was introduced into Chorus-operated infrastructure.

## Git workflow expectations

Trunk-based, short-lived branches only — see `GITHUB_WORKFLOW.md`. Branch name: `type/short-description`. Commits follow Conventional Commits. One feature or story per branch; don't accumulate unrelated changes on top of an open branch while waiting for review.

## Pull request checklist

- [ ] PR description links the `FEATURE_SPECIFICATION.md` entry or backlog story it implements.
- [ ] Definition of Done items above are explicitly checked off, not implied.
- [ ] Tests are included and described, not just "added."
- [ ] Any assumption made due to ambiguity in the docs is called out explicitly in the description, not buried in a comment.
- [ ] UI changes include a Storybook link or screenshot.
- [ ] Anything touching auth, data storage, or `contracts/` has an explicit one-line security self-check in the description.

## Common mistakes to avoid

- Inverting a light-mode color for dark mode without checking contrast independently — see `DESIGN_SYSTEM.md`.
- Marking a whole page `'use client'` for one interactive element.
- Hand-writing a validation schema instead of importing the shared one from `packages/types`.
- Using the verify-amber accent for anything other than a cryptographic verification moment.
- Bundling a `contracts/` change into an unrelated feature PR.
- Adding a database credential to `services/ai` "just for this one case."
- Skipping the k-anonymity floor on a new cohort-adjacent query because it "seems fine this time."
- Trusting a third-party API response without validating it like any other untrusted input.
- Treating a magic-link auth fallback as a permanent path rather than the pilot-only accommodation it is.

## Sprint workflow

Implement one feature at a time. For each:

1. Pick a single `FEATURE_SPECIFICATION.md` entry or backlog story — not several at once, even if they look related.
2. Read the relevant docs per the priority order above.
3. Implement the smallest complete slice that satisfies the acceptance criteria.
4. Self-review against the Definition of Done before opening a PR.
5. Open the PR and stop — don't start the next feature on the same branch or in the same working session while this one awaits review. Small batch size is a maintainability requirement here, not a suggestion.

## Response format when implementing a feature

Structure every implementation response the same way:

1. **Feature** — name and link/reference to its `FEATURE_SPECIFICATION.md` entry or backlog story.
2. **Docs consulted** — the specific documents you read for this task.
3. **Plan** — two or three sentences on the implementation approach, before writing code.
4. **Files touched** — a list, grouped by app/service/package.
5. **Tests added** — what's covered and how.
6. **Open questions or assumptions** — anything ambiguous in the docs that you resolved by assumption, and anything requiring human sign-off (ZK review, a new dependency, an ADR).
7. **Definition of Done self-check** — the checklist above, explicitly marked.
8. **Suggested PR description** — ready to paste, following the Pull request checklist format.
