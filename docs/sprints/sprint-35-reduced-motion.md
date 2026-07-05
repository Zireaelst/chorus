# Sprint 35 — prefers-reduced-motion Support

## Objective

Add `prefers-reduced-motion` handling to all animated components in `packages/ui` and ensure motion tokens include a reduced-motion variant.

## Documentation to Read

1. `COMPONENT_ARCHITECTURE.md` L115 — "Respects `prefers-reduced-motion` for any animation the component owns."
2. `FRONTEND_GUIDELINES.md` L94 — "Every animation respects `prefers-reduced-motion: reduce`."
3. `DESIGN_SYSTEM.md` — motion token architecture.
4. `docs/ai/antigravity-playbook.md`

## Scope

**In scope:**
- Add a `useReducedMotion()` hook to `packages/ui`.
- Update `packages/ui/src/tokens/motion-tokens.ts` to export reduced-motion variants.
- Apply `prefers-reduced-motion` to every component in `packages/ui` that has animation.
- Apply reduced-motion CSS media queries to global stylesheets in each app where applicable.
- Tests verifying that animations are disabled under `prefers-reduced-motion: reduce`.

**Out of scope:**
- Redesigning animations.
- Marketing site scroll-driven animations in `apps/web` (separate from `packages/ui`).

## Files

- `packages/ui/src/hooks/useReducedMotion.ts` — [NEW]
- `packages/ui/src/tokens/motion-tokens.ts` — update with reduced variants
- Every component in `packages/ui` with animation — update
- `packages/ui/src/hooks/useReducedMotion.test.ts` — [NEW]

## Acceptance Criteria

- [ ] `useReducedMotion()` hook exists and returns `true` when `prefers-reduced-motion: reduce` is active.
- [ ] Motion tokens include reduced-motion variants (e.g., `duration: 0ms`).
- [ ] All animated components in `packages/ui` disable animation when reduced motion is preferred.
- [ ] Tests verify the reduced-motion behavior.

## Definition of Done

- [ ] All animated `packages/ui` components respect `prefers-reduced-motion`.
- [ ] Tests pass.

## Stop Condition

Stop once all `packages/ui` animations respect reduced motion. Do not modify marketing site animations. do not begin the next numbered sprint in this same branch or session.
