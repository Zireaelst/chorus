# Chorus — UI storyboard

## Purpose

This document describes what a person actually experiences moving through Chorus — the marketing site scene by scene, and the core journeys through the product apps step by step. It is the reference for anyone implementing an interaction who needs to know not just what a screen contains but what it feels like to move through it, and why.

## Context

Every interaction described here answers to one thesis, established in the brand design work: privacy is communicated through interaction and restraint, never through iconography or metaphor. A recurring three-state motif — **hidden → revealed with a redaction-line reveal → verified with an amber pulse** — appears throughout, in the marketing experience and in the product, because the same visual language should mean the same thing everywhere a person encounters it.

## Part 1 — The landing page experience

**Hero.** The screen opens on a single centered sentence: "Prove your hospital's data is eligible. Without showing anyone what it says." It appears in full about 1.5 seconds after load, then sharp, shadowless black blocks land over select words ("what it says") like a redaction stamp. Hovering or tapping a block briefly clears it with an amber flash, revealing the word beneath before it closes again. In the first three seconds, a visitor experiences the product's core promise rather than reading a claim about it: something is being withheld, but its existence isn't denied — only its content is controlled.

**Problem.** A single oversized editorial line, deliberately motion-free after the hero's animation: "The rarest diagnoses need the most data. The most data lives in the fewest hands." A near-invisible field of small rectangles textures the background — never legible as an icon, just density.

**Mechanism.** The site's technical centerpiece, told through scroll-driven motion rather than words. A dense, unreadable block of text on the left (representing raw data) shrinks and thins as the visitor scrolls, and a single amber line emerges from it — the proof — flowing rightward along a scroll-linked path (reversible if the visitor scrolls back up, reinforcing that the process is deterministic, not a one-way animation trick). The line reaches a node, pulses once in amber, and a small monospace line appears beneath it: a timestamp and a hash-like string, signaling "this represents a real transaction," not decoration.

**Trust list.** A numbered list of exactly what Chorus will never ask for — raw records, direct identifiers, a database copy, access beyond a defined boundary. Each line gets a redaction-style strikethrough as it scrolls into view, but the text stays legible beneath the line: the point is an explicit, readable refusal, not a vague promise.

**Audience triage.** Three columns — hospitals & biobanks, research sponsors, regulators & auditors — plain typography, no icons. Hovering one column dims the other two to 40% opacity, a small, direct signal that the site speaks to three distinct audiences without blending their concerns.

**Honest status.** A single plain sentence stating Chorus is building with a small group of design-partner institutions under NDA, with no invented metrics. A small "Built on Midnight" mark sits quietly in the corner.

**Disclosure demo.** The one genuinely interactive, functional section: a single cohort-record card with three view buttons — Hospital, Sponsor, Regulator. Switching views doesn't re-render the whole card; each field updates individually with the same redaction-reveal animation used in the hero. The hospital view shows everything; the sponsor view shows a diagnosis code but a size range instead of an exact count; the regulator view shows only that a record was verified against a criterion, on a date, with nothing clinical attached. This is the same disclosure model documented as the `disclose()` catalog in `BLOCKCHAIN_ARCHITECTURE.md`, made tangible rather than explained.

**Closing.** A mirror of the hero: "Ready to prove something?" and a single-word button, Apply. Hovering the button surfaces a small echo of the hero's redaction blocks at its edge, closing the visual loop the page opened with.

## Part 2 — Core product journeys

### Journey: hospital onboarding and first verified proof (Dr. Amara Osei, Raj Patel)

1. Dr. Osei's institution signs an agreement; Raj receives SSO setup instructions and configures WorkOS SAML against the hospital's existing IdP.
2. Raj logs into `apps/dashboard` for the first time, lands on org setup, and invites Dr. Osei as `compliance_officer`.
3. Dr. Osei drafts a cohort criterion using the AI copilot — describing it in plain language — reviews the structured suggestion the copilot returns, edits one ambiguous field it flagged, and approves the draft. Nothing was persisted before her approval.
4. Raj generates an API key for the hospital's Chorus Node and deploys it inside the hospital's own infrastructure, following the developer quickstart.
5. Chorus Node produces its first proof against the approved cohort criterion. Raj watches the proof's status move from "queued" to "verified" in the dashboard's contribution view — no patient data was ever visible to him in this flow, because none of it left the hospital's own systems.
6. A payout notification arrives once settlement completes. Dr. Osei can now show her risk-review committee a verified transaction, not a promise.

### Journey: sponsor cohort discovery to access (Elena Vasquez)

1. Elena logs into `apps/research-portal` and searches by clinical and demographic criteria.
2. Results return as size ranges, never exact counts — a query too narrow to meet the k-anonymity floor simply returns no match for that cohort rather than a suspiciously precise small number.
3. She requests access to a promising cohort, providing a short justification the owning hospital will see.
4. Dr. Osei receives the request in `apps/dashboard`, reviews the justification, and approves it.
5. Elena's view of that cohort updates immediately — she now sees the fields her approved access scopes her to, and nothing more.

### Journey: regulator disclosure audit (Marcus Lindqvist)

1. Marcus logs into `apps/compliance`, the only app his `regulator` role can reach.
2. He runs a pre-scoped query against a specific cohort and date range — the interface only offers query shapes that were reviewed and approved in advance; there is no free-text query surface here.
3. Results show verification events and their timestamps, with a scoped summary answering exactly what his query asked and nothing else.
4. His query itself is logged, visible later to Chorus's own compliance review — the audit trail includes the auditor.

### Journey: AI-assisted compliance review (Dr. Amara Osei)

1. While drafting a cohort criterion, Dr. Osei runs the compliance flagging check.
2. A flag appears: "advisory — GDPR Article 9 special category data" with a citation to the specific provision it's grounded in.
3. She reads the explanation, adjusts the criterion to remove an unnecessary special-category field, and re-runs the check — the flag clears.
4. She proceeds to submit the cohort, which is only possible once no `blocking` flags remain unresolved, per `API_SPEC.md`.

## Cross-cutting interaction patterns

The three-state motif — hidden, revealed, verified — recurs deliberately across both parts of this document: the hero's redaction blocks, the disclosure demo's field-level reveals, and the dashboard's proof-status transition from "queued" to "verified" are the same interaction language applied to marketing copy, a live product demo, and real production state respectively. A person who understood the hero in the first three seconds of visiting the site should recognize the same visual grammar the first time they watch a real proof verify inside the product — consistency here isn't a style guideline, it's what makes the brand's claim of restraint and control feel true rather than performed.

## Future considerations

A mobile companion app (v2.0+) will need its own storyboard for the notification-and-approval-only flows described in `PRODUCT_SPEC.md`'s future expansion section — deferred until that app's scope is actually being built, not speculated on here.
