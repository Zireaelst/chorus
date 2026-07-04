# Chorus — Feature specification

## Purpose

This document defines every major feature in the product from v0.1 through v1.5, each to the same standard: purpose, user stories, inputs, outputs, dependencies, acceptance criteria, and future improvements. It is the bridge between `PRODUCT_SPEC.md`'s personas and principles and the concrete, testable behavior `SYSTEM_ARCHITECTURE.md`, `API_SPEC.md`, and `DATABASE_DESIGN.md` implement.

## Context

Twelve features are documented here — the major, roadmap-defining capabilities, not an exhaustive inventory of every button and settings toggle. Each entry's acceptance criteria are written to be directly testable, matching the Definition of Done pattern established in the engineering backlog.

---

## 1. Cohort criteria builder

**Purpose:** Let a hospital or sponsor define a structured, reviewable cohort criterion that later becomes the input to the eligibility circuit.

**User stories:**
- As Dr. Amara Osei, I want to define a cohort by clinical and demographic fields so my institution can start a federated training round without exposing patient data.
- As Elena Vasquez, I want to browse cohort criteria in a structured form so I can evaluate fit before requesting access.

**Inputs:** Field/operator/value rows (clinical code, age range, treatment history, etc.); an optional AI-copilot-generated starting draft.

**Outputs:** A `cohort` record in `draft` status, matching the schema `services/ai` and the eligibility circuit both consume.

**Dependencies:** Authentication (v0.3), shared cohort-criteria schema in `packages/types`.

**Acceptance criteria:**
- A cohort cannot be saved with fewer than one clinical field and one demographic field.
- A saved draft's shape validates against the schema the v0.8 circuit generator consumes, with no transformation step required between the two.
- Only `hospital_admin` and `compliance_officer` roles can create a draft for their own org.

**Future improvements:** Template library of common rare-disease cohort shapes (post-v1.0, once real usage data shows which shapes recur).

---

## 2. AI copilot — natural language to criteria

**Purpose:** Let a user describe a cohort in plain language and receive a structured, human-reviewable draft.

**User stories:**
- As Dr. Amara Osei, I want to describe a cohort in my own words and get a structured starting point, so I don't have to learn the criteria schema by hand.

**Inputs:** Free-text description (max 2,000 characters); optional existing criteria object for editing.

**Outputs:** A suggested structured criteria object, a list of ambiguous fields requiring clarification, and a `requiresReview: true` flag that is never `false`.

**Dependencies:** `services/ai` (v0.5); the PII pre-filter guardrail; the cohort criteria schema.

**Acceptance criteria:**
- Input containing a detectable direct identifier is rejected before reaching the model, returning `422 PII_DETECTED`.
- No suggestion is ever persisted without an explicit human approval action.
- A field the extraction agent cannot confidently resolve appears in `ambiguousFields`, never silently defaulted.

**Future improvements:** Multi-turn clarification within a single session (currently one-shot per description; iterative refinement is a v0.6+ candidate once usage data shows it's needed).

---

## 3. AI compliance flagging

**Purpose:** Surface likely HIPAA/GDPR/EHDS issues in a draft cohort before submission.

**User stories:**
- As Dr. Amara Osei, I want the system to flag a compliance risk in my draft criterion, with a citation, so I can fix it before it blocks submission.

**Inputs:** A draft cohort's criteria object; the institution's declared jurisdiction.

**Outputs:** A list of flags, each with a severity (`blocking`/`advisory`), a cited regulation, and an explanation.

**Dependencies:** The RAG pipeline over the regulatory corpus (`AI_ARCHITECTURE.md`); jurisdiction data on the org record.

**Acceptance criteria:**
- Every returned flag cites a specific, retrievable source; a compliance concern the retrieval step can't ground in a citation is never shown.
- A cohort with an unresolved `blocking` flag cannot be submitted (`API_SPEC.md`, `409 UNRESOLVED_COMPLIANCE_FLAGS`).
- The golden-set evaluation suite's recall metric for known-risky criteria passes before any prompt change ships.

**Future improvements:** Jurisdiction-aware flag prioritization once the v2.0 multi-jurisdiction corpus expands beyond HIPAA/GDPR/EHDS.

---

## 4. Chorus Node — local training and proof generation

**Purpose:** Let a hospital train locally against an approved cohort criterion and produce a zero-knowledge proof of correct, eligible training, without patient data ever leaving its infrastructure.

**User stories:**
- As Raj Patel, I want to deploy an agent inside our own infrastructure that produces a proof I can submit, so our patient data never has to leave our network.

**Inputs:** A submitted cohort criterion; the hospital's local patient data (never transmitted); the current shared model checkpoint.

**Outputs:** A zero-knowledge proof artifact and submission metadata, sent to `services/api`.

**Dependencies:** The eligibility and training-correctness circuits (`BLOCKCHAIN_ARCHITECTURE.md`); a hospital-held Midnight signing key.

**Acceptance criteria:**
- No patient-level data appears in any network call Chorus Node makes outward.
- A proof generated against synthetic test data verifies successfully within the agreed time budget defined in the v0.8 milestone.
- The node's signing key never leaves the hospital's infrastructure at any point in the flow.

**Future improvements:** Support for additional model families beyond the v0.8 MVP's single tabular-data model type, as disease verticals expand.

---

## 5. Proof verification pipeline

**Purpose:** Validate submitted proofs and route verified contributions into model aggregation.

**User stories:**
- As Raj Patel, I want to see my submission move from "queued" to "verified" so I know our contribution counted.

**Inputs:** A submitted proof and its metadata.

**Outputs:** A verification result (`verified`/`rejected` with reason); on success, a forwarded update to the aggregator.

**Dependencies:** `services/proof-worker`; the Midnight network's own consensus-level verification, which is authoritative — see `BLOCKCHAIN_ARCHITECTURE.md`.

**Acceptance criteria:**
- An invalid or tampered proof is rejected with a logged, retrievable reason.
- A duplicate submission for an already-verified `(cohort, org, round)` triple is rejected, not silently accepted.
- `proof-worker`'s pre-check result and the network's own verification never disagree in a way that isn't logged and alerted on.

**Future improvements:** Horizontal sharding of `proof-worker` by disease vertical once verification volume requires it (`SYSTEM_ARCHITECTURE.md` future scalability).

---

## 6. Contribution ledger and automatic payout

**Purpose:** Record verified contributions on-chain and settle payment automatically and proportionally.

**User stories:**
- As Dr. Amara Osei, I want my institution to be paid automatically for a verified contribution, without invoicing anyone.

**Inputs:** A verified contribution from the proof-worker/aggregator flow.

**Outputs:** An on-chain contribution record; a triggered, settled payout in the platform's stablecoin.

**Dependencies:** The contribution ledger and payout Compact contracts; a hospital's registered payout destination.

**Acceptance criteria:**
- A payout triggers automatically on a valid contribution ledger write, with no manual or discretionary step in between.
- The off-chain `payouts` mirror in Postgres matches the on-chain settlement record exactly, reconciled on write.
- Payout amount calculation is deterministic and reproducible from the contribution record alone.

**Future improvements:** Split-payout support for multi-party royalty distribution, needed for the v1.5 marketplace (`DATABASE_DESIGN.md` future migrations).

---

## 7. Sponsor cohort search

**Purpose:** Let a sponsor discover cohorts matching trial criteria without accessing patient-level data.

**User stories:**
- As Elena Vasquez, I want to search for cohorts by clinical criteria and see a real, actionable size estimate.

**Inputs:** Structured search criteria.

**Outputs:** A list of matching cohorts with k-anonymized size ranges.

**Dependencies:** Submitted, active cohorts with at least the k-anonymity floor of contributing institutions.

**Acceptance criteria:**
- No result ever returns an exact patient count.
- A cohort matching fewer institutions than the k-anonymity floor doesn't appear in results at all, rather than appearing with a small, revealing number.
- Search results only include cohorts in `active` status.

**Future improvements:** Saved searches and match alerts for sponsors tracking a specific rare-disease profile over time (post-v1.0).

---

## 8. Access request workflow

**Purpose:** Let a sponsor formally request, and a hospital formally grant or deny, access to a discovered cohort.

**User stories:**
- As Elena Vasquez, I want to request access with a short justification and track its status.
- As Dr. Amara Osei, I want to review and decide on access requests for cohorts my institution owns.

**Inputs:** A justification string from the requesting sponsor; a decision from the owning hospital.

**Outputs:** An access request record moving through `pending` → `approved`/`denied`; on approval, expanded field visibility for the requester.

**Dependencies:** Cohort search; org roles (`sponsor`, `hospital_admin`, `compliance_officer`).

**Acceptance criteria:**
- A sponsor cannot submit a second pending request for a cohort it already has one pending against.
- Field-level visibility expands for the requester only after an explicit `approved` decision, never provisionally during `pending`.
- Every decision is recorded in the audit log with the deciding user's identity.

**Future improvements:** Time-bounded access grants that auto-expire, relevant once trial durations vary widely enough to need it.

---

## 9. Regulator disclosure query

**Purpose:** Let a regulator retrieve exactly the audit evidence a specific, pre-scoped query requires.

**User stories:**
- As Marcus Lindqvist, I want to verify a cross-border training effort's compliance without needing standing access to any patient's record.

**Inputs:** A selection from a bounded set of pre-approved query shapes, plus cohort/date scoping parameters.

**Outputs:** A scoped summary of verification and disclosure events.

**Dependencies:** The `disclose()` boundary defined per contract in `BLOCKCHAIN_ARCHITECTURE.md`; the `regulator` role, scoped to `apps/compliance` only.

**Acceptance criteria:**
- Every query, including one returning zero results, is logged in `disclosure_queries`.
- A `regulator` account can never authenticate into any app other than `apps/compliance`, enforced at the routing layer independent of API-level checks.
- No query response includes clinical detail beyond what the specific query asked for.

**Future improvements:** Per-jurisdiction query templates once the v2.0 multi-jurisdiction compliance engine ships.

---

## 10. Developer portal (API keys and webhooks)

**Purpose:** Let a hospital's technical administrator manage machine-to-machine credentials and event delivery.

**User stories:**
- As Raj Patel, I want to issue an API key for our Chorus Node deployment and configure a webhook so our internal systems learn about settlement events automatically.

**Inputs:** A key name; a webhook URL and event type selection.

**Outputs:** A one-time-visible API key; a verified, active webhook subscription.

**Dependencies:** Org membership with `hospital_admin` role.

**Acceptance criteria:**
- A raw API key is retrievable exactly once, at creation, and never again — only its hash persists thereafter.
- A webhook URL resolving to a private or internal IP range is rejected at registration.
- A revoked API key fails authentication immediately, with no propagation delay.

**Future improvements:** Scoped API keys (read-only vs. submission-capable) once integration patterns diversify beyond the current single-purpose Chorus Node use case.

---

## 11. Reputation scoring (v0.9)

**Purpose:** Give institutions a transparent, contribution-based quality signal.

**User stories:**
- As a Chorus admin, I want a defensible, automatically-updating score per institution to inform trust and prioritization decisions.

**Inputs:** An institution's history of verified vs. rejected contributions.

**Outputs:** A `reputation_scores` record, updated after each verified contribution.

**Dependencies:** The contribution ledger; a settled scoring formula (an open mechanism-design question tracked in `DEVELOPMENT_ROADMAP.md`, not yet finalized).

**Acceptance criteria:**
- Score updates automatically after every verified contribution, with no manual recomputation step.
- The formula version used to compute a given score is recorded alongside it, so a future formula change doesn't retroactively reinterpret historical scores silently.
- Score is visible to `apps/admin` and to the scored institution itself, never to other institutions in v0.9 — cross-institution visibility is an explicit non-goal until trust in the mechanism itself is established.

**Future improvements:** Weighting refinements once the v1.5 marketplace's royalty distribution depends on the same underlying signal.

---

## 12. AI model marketplace and licensing (v1.5)

**Purpose:** Let AI teams license a Chorus-certified model with verifiable training provenance, and automatically distribute royalties to contributing institutions.

**User stories:**
- As an AI team, I want to license a model whose training provenance I can independently verify, for use in a regulatory submission.
- As Dr. Amara Osei, I want my institution's past contributions to keep generating revenue as the resulting model gets licensed.

**Inputs:** A trained, certified model checkpoint with its full contribution provenance; a licensee's usage terms.

**Outputs:** A `model_licenses` record; recurring `royalty_distributions` to contributing institutions, proportional to verified contribution.

**Dependencies:** v1.0 production infrastructure; the reputation-scoring formula; split-payout support on the payout contract (`DATABASE_DESIGN.md` future migrations).

**Acceptance criteria:**
- A licensed model's "model passport" traces to the exact set of verified contributions used in training, independently checkable against the contribution ledger.
- Royalty distribution on a usage event is automatic and matches the contribution-proportional formula with no manual calculation step.
- A model cannot be listed for licensing without having passed the same compliance flagging applied to the cohorts it was trained on.

**Future improvements:** Secondary licensing terms (exclusivity tiers, geographic restrictions) once initial marketplace usage shows what licensees actually need.

## Future considerations

Features specific to the v2.0 multi-jurisdiction compliance engine and the genomic research vertical are deliberately not specified here at this level of detail — both depend on decisions (contract-level jurisdiction configuration, EHDS's phased genomic-data timeline) that are still open, per `BLOCKCHAIN_ARCHITECTURE.md` and `PRODUCT_SPEC.md`. They'll receive full feature specifications once those dependencies resolve, following the exact template established above.
