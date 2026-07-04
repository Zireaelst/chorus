// Prettier configuration — the single source of truth for all formatting in the monorepo.
// CODING_STANDARDS.md: "Prettier configs live in packages/config and are never overridden per-app."
// Apps import this via: require('@chorus/config/prettier')

/** @type {import('prettier').Config} */
module.exports = {
  // Strings
  singleQuote: true,
  jsxSingleQuote: false, // JSX uses double quotes by convention

  // Semicolons — none (TypeScript's ASI is reliable with modern tooling)
  semi: false,

  // Line length
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,

  // Trailing commas in all valid ES5+ positions
  trailingComma: 'all',

  // Brackets
  bracketSpacing: true,
  bracketSameLine: false,

  // Arrow functions
  arrowParens: 'always',

  // End of line
  endOfLine: 'lf',

  // Per-language overrides
  overrides: [
    {
      files: ['*.json', '*.jsonc'],
      options: { printWidth: 80 },
    },
    {
      files: ['*.md', '*.mdx'],
      options: { proseWrap: 'always' },
    },
    {
      files: ['*.yaml', '*.yml'],
      options: { singleQuote: false },
    },
  ],
}
