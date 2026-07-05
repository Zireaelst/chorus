# Sprint 34 — Tabs Component Completion

## Objective

Complete the `packages/ui/src/Tabs/` component by adding the missing test, story, and variants files required by `COMPONENT_ARCHITECTURE.md`'s file organization.

## Documentation to Read

1. `COMPONENT_ARCHITECTURE.md` L88–L106 — file organization requirements: `Component.tsx`, `component.variants.ts`, `Component.test.tsx`, `Component.stories.tsx`.
2. `CODING_STANDARDS.md` — testing conventions (Vitest, React Testing Library, query by role/accessible name).
3. `DESIGN_SYSTEM.md` — token usage for component styling.
4. `docs/ai/antigravity-playbook.md`

## Scope

**In scope:**
- Create `packages/ui/src/Tabs/Tabs.test.tsx` with accessibility and behavior tests.
- Create `packages/ui/src/Tabs/Tabs.stories.tsx` with representative stories.
- Create `packages/ui/src/Tabs/tabs.variants.ts` if variants are applicable (size, visual style).
- Ensure `axe-core` compatibility (zero violations).

**Out of scope:**
- Redesigning the Tabs component.
- Creating new tab variants not needed by current consumers.

## Files

- `packages/ui/src/Tabs/Tabs.test.tsx` — [NEW]
- `packages/ui/src/Tabs/Tabs.stories.tsx` — [NEW]
- `packages/ui/src/Tabs/tabs.variants.ts` — [NEW] if applicable

## Acceptance Criteria

- [ ] `Tabs.test.tsx` exists and tests render, tab switching, and keyboard navigation.
- [ ] Tests query by role and accessible name (not by class or test ID).
- [ ] `Tabs.stories.tsx` exists with at least a default and a multi-tab story.
- [ ] Zero `axe-core` violations in the stories.
- [ ] All tests pass.

## Definition of Done

- [ ] File organization matches `COMPONENT_ARCHITECTURE.md`.
- [ ] Tests pass.
- [ ] Stories render in Storybook.

## Stop Condition

Stop once the test, story, and optional variants files are created and passing. do not begin the next numbered sprint in this same branch or session.
