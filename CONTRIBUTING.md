# Contributing to Chorus

## Purpose

This document governs how changes get proposed, reviewed, and merged — today, while Chorus is closed-source and worked on by a small internal team, and after `contracts/` and `packages/sdk` move to an open-source license following the v0.8 zero-knowledge engine's external audit, per `README.md`.

## Current status: closed-source, internal team

Right now, this document is written for the founding engineering team and any contractor explicitly onboarded to the private repository. There is no external contribution path yet — see "After open source" below for what changes once there is.

## Before your first PR

Read `SYSTEM_ARCHITECTURE.md`, `FRONTEND_GUIDELINES.md` or the relevant backend documentation for the area you're working in, and `CODING_STANDARDS.md`. This document doesn't repeat their content; it assumes you've read them. Local environment setup is documented in `docs/public/developer-guide/quickstart.md` — if that document is out of date, fixing it is itself a welcome first contribution.

## Proposing a change

A small, well-scoped change (a bug fix, a UI adjustment, a new endpoint following an established pattern) goes straight to a PR referencing its GitHub Project story, per `GITHUB_WORKFLOW.md`. A change that alters an architectural decision recorded in `SYSTEM_ARCHITECTURE.md` — a new service, a new data flow across the hospital trust boundary, a new external dependency in `contracts/` — starts as an Architecture Decision Record proposal in `docs/public/architecture/adr/` before any code is written, so the team can debate the decision on its own terms rather than as a side effect of reviewing a diff. If you're unsure which category your change falls into, default to writing the ADR first — reverting an unwritten decision is much harder than skipping an ADR that turned out to be unnecessary.

## What reviewers check

Beyond correctness: does the change meet the Definition of Done in the engineering backlog (tests, documentation updates, no new P0/P1 security findings); does it respect the accessibility contract in `COMPONENT_ARCHITECTURE.md` where relevant; does it hold to the security non-negotiables in `SECURITY_MODEL.md`, in particular the boundary that patient data never touches Chorus-operated infrastructure — a reviewer who sees a code path that could carry patient-adjacent data into a Chorus-operated log, database, or model call blocks the PR regardless of how urgent the underlying feature is.

## Reporting a security vulnerability

Do not open a public issue. Follow the responsible disclosure process in `SECURITY.md` at the repository root.

## After open source (v0.8+)

Once `contracts/` and `packages/sdk` move to an open-source license following external audit, this document expands to cover: a Contributor License Agreement required before an external PR is reviewed; a public issue triage process distinct from the internal backlog; adoption of the Contributor Covenant as Chorus's code of conduct; and a public bug bounty program, noted as a future item in `SECURITY_MODEL.md`. None of this exists yet because none of it is useful before there's a public codebase for it to govern — writing a detailed external-contributor process today would be documentation with no audience.

## Do & Don't

| Do | Don't |
|---|---|
| Write an ADR before an architectural change | Let an architectural decision get made implicitly inside a large PR |
| Default to writing an ADR when unsure if one's needed | Skip the ADR to save time and hope the decision doesn't need revisiting |
| Block a PR that risks the patient-data boundary, regardless of urgency | Treat that boundary as negotiable under deadline pressure |

## Future considerations

The exact CLA text and the public triage tooling (likely GitHub's own issue templates plus a labeling scheme mirroring the internal backlog's) will be finalized ahead of the v0.8 open-source transition, not before — drafting legal text for a contribution model that doesn't exist yet risks producing terms that don't fit the community that actually shows up.
