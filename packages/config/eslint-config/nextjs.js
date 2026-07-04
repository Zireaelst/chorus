// ESLint configuration for Next.js apps
// Extends the base config and adds Next.js-specific rules.
// CODING_STANDARDS.md: "Default exports are used ONLY where Next.js requires them
// (page.tsx, layout.tsx, loading.tsx, error.tsx)."

/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [require.resolve('./index.js'), 'plugin:@next/eslint-plugin-next/core-web-vitals'],
  rules: {
    // Allow default exports only in Next.js App Router special files
    'import/no-default-export': 'off',
    'import/prefer-default-export': 'off',
  },
  overrides: [
    {
      // Enforce named exports in everything that is NOT a Next.js special file
      files: ['**/*.ts', '**/*.tsx'],
      excludedFiles: [
        '**/page.tsx',
        '**/layout.tsx',
        '**/loading.tsx',
        '**/error.tsx',
        '**/not-found.tsx',
        '**/route.ts',
        '**/middleware.ts',
        '**/next.config.ts',
        '**/tailwind.config.ts',
      ],
      rules: {
        'import/no-default-export': 'error',
      },
    },
  ],
}
