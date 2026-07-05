# Sprint 37 — axe-core and Lighthouse CI Integration

## Objective

Add `axe-core` accessibility testing and Lighthouse CI to the GitHub Actions CI pipeline as specified in `GITHUB_WORKFLOW.md` and `FRONTEND_GUIDELINES.md`.

## Documentation to Read

1. `GITHUB_WORKFLOW.md` CI diagram — "Lighthouse CI + axe-core a11y" as a frontend gate.
2. `FRONTEND_GUIDELINES.md` L80, L90 — Lighthouse CI on `apps/web` PRs, axe-core on Storybook stories.
3. `COMPONENT_ARCHITECTURE.md` L110 — Storybook axe-core addon.
4. `docs/ai/antigravity-playbook.md`

## Scope

**In scope:**
- Add `@storybook/addon-a11y` to `packages/ui`'s Storybook configuration.
- Add a CI job that runs axe-core against all Storybook stories as a merge blocker.
- Add a Lighthouse CI job for `apps/web` that runs on PRs touching `apps/web/**`.
- Create a `lighthouserc.js` configuration file.

**Out of scope:**
- Fixing any current accessibility violations found (separate sprint).
- Performance optimization.

## Files

- `.github/workflows/ci.yml` — add axe-core and Lighthouse CI jobs
- `packages/ui/.storybook/main.ts` — add `@storybook/addon-a11y`
- `apps/web/lighthouserc.js` — [NEW]
- `packages/ui/package.json` — add `@storybook/addon-a11y` dependency

## Acceptance Criteria

- [ ] CI pipeline includes an axe-core job that runs against Storybook stories.
- [ ] CI pipeline includes a Lighthouse CI job for `apps/web` PRs.
- [ ] Both jobs are merge blockers (failures prevent merge).
- [ ] `@storybook/addon-a11y` is configured in Storybook.
- [ ] Lighthouse CI configuration exists.

## Definition of Done

- [ ] CI pipeline matches `GITHUB_WORKFLOW.md` diagram.
- [ ] Both new jobs pass on current code (or violations are documented for a follow-up sprint).

## Stop Condition

Stop once the CI jobs are added and configured. Do not fix accessibility violations in this sprint. do not begin the next numbered sprint in this same branch or session.
