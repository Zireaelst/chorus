// commitlint.config.js
// Enforces Conventional Commits: feat: | fix: | chore: | docs: | refactor: | test:
// Source: CODING_STANDARDS.md — "Commits follow Conventional Commits … drives packages/* versioning via changesets"
// Source: GITHUB_WORKFLOW.md — "feat: or fix: for behavior changes, never buried in chore:"

/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Enforce the exact types documented in CODING_STANDARDS.md and GITHUB_WORKFLOW.md
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'chore', 'docs', 'refactor', 'test', 'ci', 'perf', 'revert'],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
    'body-max-line-length': [2, 'always', 100],
  },
}
