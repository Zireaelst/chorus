// ESLint base configuration for all TypeScript packages and services
// Source: CODING_STANDARDS.md — "any is banned by lint rule", named exports rule, no silent catch

/** @type {import('eslint').Linter.Config} */
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:import/typescript',
  ],
  rules: {
    // ── CODING_STANDARDS.md: `any` is banned ─────────────────────────────────
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-unsafe-argument': 'error',
    '@typescript-eslint/no-unsafe-member-access': 'error',
    '@typescript-eslint/no-unsafe-return': 'error',
    '@typescript-eslint/no-unsafe-call': 'error',

    // ── CODING_STANDARDS.md: errors never silently swallowed ─────────────────
    'no-empty': ['error', { allowEmptyCatch: false }],

    // ── CODING_STANDARDS.md: named exports, no default exports in non-Next files
    // (Next.js special files are excluded in the nextjs.js config below)
    'import/no-default-export': 'warn',

    // ── Import ordering ───────────────────────────────────────────────────────
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],

    // ── Consistent type-only imports ─────────────────────────────────────────
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
    ],

    // ── No unused vars (use _ prefix to explicitly discard) ──────────────────
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],

    // ── Prefer unknown over any in catch blocks ───────────────────────────────
    '@typescript-eslint/use-unknown-in-catch-variables': 'error',
  },
  ignorePatterns: ['node_modules/', 'dist/', '.next/', 'build/', '*.config.js', '*.config.ts'],
}
