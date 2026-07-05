/** @type {import('eslint').Linter.Config} */
module.exports = {
  overrides: [
    {
      // Target only the exact generated code output path
      files: ['packages/contracts-client/src/generated/**/*.ts'],
      rules: {
        // Exempted because generated schemas define their own casing constraints
        '@typescript-eslint/naming-convention': 'off',
        
        // Exempted because generated AST output frequently includes extraneous variables
        '@typescript-eslint/no-unused-vars': 'off',
        
        // Exempted because generated bindings interact with unchecked types during deserialization
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
      },
    },
  ],
};
