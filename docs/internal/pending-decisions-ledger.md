# Chorus — Pending decisions ledger

## Purpose

This document consolidates every human decision flagged, but not made, across 24 engineering sprints. Each item below was surfaced by an Antigravity implementation prompt as "out of scope" or "flagged, not decided here" — this ledger exists so those decisions live in one place instead of scattered across 24 separate PR descriptions, and so producing more sprints stops being a substitute for making them.

**Nothing in this document is a recommendation on which way to decide. It states what's open, why it matters, what it blocks, and who should own the call.**

---

## How to read this

Each item lists: **what's open**, **first flagged in**, **what it blocks**, **suggested owner**. Items are grouped by category, not by urgency — the Blocking-radius column within each table is the fastest way to see which ones are actually load-bearing right now versus safely deferrable.

---

## 1. Gating decisions (block the most downstream work)

| Decision | First flagged | Blocks | Suggested owner |
|---|---|---|---|
| **v0.8 external ZK audit — has it cleared?** | Sprint 8 | The entire real-data cutover: magic-link retirement, real cohort search, mainnet deployment, any real hospital pilot. Every sprint since Sprint 8 has treated this as a hard, unconfirmed gate. | Security/engineering leadership, in coordination with the external auditor |
| **Mainnet deployment execution** | Sprint 7 (testnet script), Sprint 10 (mainnet script + diff summary) | v1.0's actual production launch. Scripts are written and reviewed; nothing has been executed. | CTO/founding engineer, with the two-approval-plus-ZK-signoff gate from `GITHUB_WORKFLOW.md` |
| **Payout settlement asset (stablecoin/bridge choice)** | `BLOCKCHAIN_ARCHITECTURE.md` (pre-Sprint-1), reaffirmed Sprint 7 | The Payout contract's real implementation; all real payout testing beyond placeholder-asset logic | Whoever owns the Midnight ecosystem relationship + finance |
| **Real Midnight testnet access** (RPC endpoint, credentials, funded test wallet) | Testnet demo attempt, 2026-07-07 | Any real on-chain demo; contracts remain undeployed to any real network | Whoever owns the Midnight ecosystem relationship — needs to be obtained, not engineered around |

---

## 2. Vendor / build-vs-buy decisions

| Decision | First flagged | Blocks | Suggested owner |
|---|---|---|---|
| **Payment processor** (for `billing.service.ts`'s injected interface) | Sprint 10 | Actually collecting subscription/transaction fees — the ledger computes amounts but nothing executes a charge | Finance + engineering |
| **Email provider** (for `email-transport.interface.ts`) | Sprint 13 | Any real email ever being sent — verification challenges, notifications, invites all currently no-op | Engineering, low-stakes/fast decision |
| **Storage vendor for SOC 2 evidence exports** | Sprint 22 | Evidence collection currently defaults to local dry-run only | Security/compliance lead |
| **GRC automation platform** (Vanta, Drata, or none) | Sprint 22 | Whether SOC 2 evidence flows into a platform or stays raw exports for a direct auditor relationship | Whoever owns the SOC 2 audit engagement |
| **Style Dictionary as the token-pipeline tool** | Sprint 20 | Whether the generated design-token pipeline is merged as currently built or reconsidered | Design/frontend lead |
| **Chromatic as the visual-regression tool** | Sprint 18 | Whether visual regression CI checks become a required merge gate | Frontend lead |

---

## 3. Legal / compliance decisions

| Decision | First flagged | Blocks | Suggested owner |
|---|---|---|---|
| **Open-source license: MIT vs. Apache 2.0** (ADR-011) | `README.md` (pre-Sprint-1), reaffirmed Sprint 15 | `contracts/` and `packages/sdk` cannot legally be made public without this — the mirror script exists but is deliberately inert | Legal + leadership |
| **CLA final legal text** | Sprint 15 | Any external contributor's first PR being reviewable in good faith | Legal counsel |
| **Font licensing: GT Sectra / Suisse Int'l** | `DESIGN_SYSTEM.md` (pre-Sprint-1), reaffirmed Sprints 1, 12, 20 | Nothing functionally — interim fallbacks (Inter, system serif, JetBrains Mono) work fine. Purely a brand-fidelity decision with a real invoice attached. | Design lead + finance |
| **Auditor engagement for SOC 2** | Sprint 22 | The actual audit, once evidence collection has run for a real period | Leadership |

---

## 4. Product / mechanism-design decisions

| Decision | First flagged | Blocks | Suggested owner |
|---|---|---|---|
| **K-anonymity floor value** | Sprint 6 | Whether cohort search's privacy guarantee is calibrated correctly — currently a placeholder constant, not a reviewed number | Compliance officer / privacy counsel |
| **Reputation scoring formula** (beyond v1's provisional version) | Sprint 9 | v1.5's royalty distribution, which depends on this signal being trustworthy | Mechanism-design consultant (already named as the intended owner in `DEVELOPMENT_ROADMAP.md`) |
| **Royalty distribution mechanism** | Sprint 11 | Split-payout contract work, any real marketplace licensing revenue | Mechanism-design consultant + finance |
| **Marketplace-facing application architecture** | Sprint 11 | Any external AI team ever self-serving a license — currently `apps/admin`-only, human-mediated | Product + engineering leadership (this is a `SYSTEM_ARCHITECTURE.md`-level decision, needs an ADR) |
| **Proof-generation time budget** (the "agreed time budget" `FEATURE_SPECIFICATION.md` refers to but never numbers) | Sprint 8 | A concrete pass/fail line for whether Chorus Node performance is acceptable — currently only measured and reported, not judged | ZK engineering lead |
| **Dispute resolution — full feature specification** | Sprint 21 | `apps/admin`'s dispute workflow is a generic open/review/resolved scaffold with no real business logic behind it, because no feature spec exists for it at all | Product lead — this needs a `FEATURE_SPECIFICATION.md` entry written properly, not another engineering sprint |
| **Dispute intake mechanism** (self-service vs. admin-transcribed) | Sprint 21 | Whether hospitals/sponsors/regulators can file a dispute themselves, or must go through Chorus support | Product lead, downstream of the item above |
| **Automated actions on dispute resolution** (e.g., voiding a payout) | Sprint 21 | Whether resolving a dispute can ever actually reverse a financial/on-chain effect, or stays a record-only workflow forever | Legal + engineering leadership — real financial/cryptographic-record implications |

---

## 5. Documentation corrections needed (not decisions, but require a human editing pass)

| Item | First flagged | What's wrong |
|---|---|---|
| `DATABASE_DESIGN.md`'s `contributions` write-timing language | Sprint 24 | States the row is written "only after `proof-worker` confirms verification" — actual implementation (required for `GET /v1/proofs/:proofId` to return `"queued"`) writes it at submission with a `pending` status. Doc text is now slightly imprecise. |
| `cohort_rounds` — undocumented "round" concept | Sprint 24 | No document formally models a training round as an entity. Sprint 24 used the narrowest possible interpretation (round is open iff cohort is `active`) as a stopgap — flagged as provisional, not as a proposal to formalize. |
| Five undocumented schema additions | Sprints 2, 10, 11, 21 | `waitlist` (Sprint 2), `billing_subscriptions`/`fee_ledger_entries` (Sprint 10), `model_checkpoints`/`model_licenses` (Sprint 11), `disputes` (Sprint 21) — each was the smallest reasonable addition for its sprint's scope, each was explicitly flagged in its PR, and none has been reviewed for inclusion in `DATABASE_DESIGN.md` itself. |

---

## 6. Approvals pending (work is done, waiting on sign-off, not a decision to make from scratch)

| Item | First flagged | Status |
|---|---|---|
| `packages/config/eslint-generated-override.js` (contracts-client scope) | Sprint 17 | Proposed diff, not merged |
| Same override, extended scope (design-tokens build output) | Sprint 20 | Proposed diff, not merged |
| Production Terraform module | Sprint 19 | Deliberately not started — staging only exists; needs an explicit go-ahead before it's even begun, given import/drift risk |
| `mirror-public-repo.sh` first real execution | Sprint 15 | Built, tested locally only, defaults to dry-run; blocked on the OSS license decision above regardless of technical readiness |

---

## 7. Technical debt flagged during remediation (non-blocking for local demo, must fix before any real multi-service deployment)

| Item | First flagged | Why it matters |
|---|---|---|
| `services/proof-worker` imports `AuditService`/`PrismaService` directly from `services/api/src/` via a relative path, with an unsafe `as unknown as PrismaService` cast | Proof-worker fix task, 2026-07-07 | Works only because both services currently share a single local checkout. Will fail to resolve in any real deployment where proof-worker and api are packaged/deployed as separate services with separate Docker images. Before any real deployment attempt, this needs a proper shared package (e.g., extracting the audit-write client into its own `packages/` module both services install as a normal workspace dependency) rather than a cross-service source import. |

## What this ledger is not

This is not a prioritized roadmap and not a sprint backlog — several of these items (font licensing, Chromatic/Style Dictionary sign-off) are low-stakes and fast; others (the ZK audit, the OSS license, the mechanism-design work) are genuinely hard and slow, and no amount of engineering throughput changes that. Treat the grouping above as "who needs to look at this," not "do these in order."

## Maintenance

This ledger should be updated whenever a future sprint flags a new open item, and an entry should be struck through (not deleted) once its decision is actually made, with a one-line note on what was decided and where that decision now lives (an ADR, a config value, a vendor contract). A ledger that only grows and never resolves is a sign these decisions aren't reaching the people who own them, not a sign more engineering work is needed.
