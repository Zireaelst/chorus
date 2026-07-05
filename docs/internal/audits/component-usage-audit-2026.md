# Chorus — Component Usage Audit (2026)

## Purpose
This audit was performed as part of Sprint 18 to verify adherence to `CODING_STANDARDS.md` regarding component promotion boundaries. Specifically, a component is only permitted to reside in the shared `packages/ui` directory once it has **two or more real consumers** (i.e. used across multiple independent applications in `apps/*`).

## Audit Methodology
An exhaustive codebase search across all `apps/*` files mapped the number of independent applications consuming each `packages/ui/src/components` export.

## Findings

| Component | Consumer Apps Count | Real Consumers | Status |
|---|---|---|---|
| `Button` | 5 | Dashboard, Compliance, Admin, Research Portal, Web | ✅ Compliant |
| `Badge` | 4 | Dashboard, Compliance, Admin, Research Portal | ✅ Compliant |
| `Input` | 5 | Dashboard, Compliance, Admin, Research Portal, Web | ✅ Compliant |
| `IconButton` | 1 | Dashboard | ⚠️ **Flagged** (Premature Promotion) |
| `Dialog` | 1 | Web | ⚠️ **Flagged** (Premature Promotion) |
| `Tooltip` | 0 | None | ⚠️ **Flagged** (Premature Promotion) |

## Action Items
As per the strict bounds of Sprint 18, no components were moved or demoted. However, a human decision is required to either:
1. Demote `IconButton`, `Dialog`, and `Tooltip` back into the respective application-level `/components` folders until a second real consumer requires them.
2. Formally amend the standard if these primitives are universally expected to see adoption shortly.
