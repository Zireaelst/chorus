# Chorus — Generated Code Lint Exemption Policy

> [!WARNING]  
> **Pending Human Confirmation**  
> This document is drafted but not yet confirmed. It documents the lint exemption scope for generated code outputs (e.g., `packages/contracts-client`) and requires explicit team approval.

## Purpose
While the Chorus repository strictly adheres to `CODING_STANDARDS.md`, a pragmatic exemption applies to code output by generators (such as the Zero-Knowledge circuits or Midnight contracts generating the `packages/contracts-client` bindings).

This policy outlines what rules generated code is exempted from, and why, avoiding friction in CI without compromising safety.

## Scope of Exemption
The exemption block (`eslint-generated-override.js`) targets exclusively the paths matching generated code globs, strictly limiting the scope to:
`packages/contracts-client/src/generated/**`

## Exempted Rules
Generators output code conforming to their internal schema structures or intermediate language (IL) targets. Therefore, the following stylistic rules are exempted:

1. **Naming Conventions** (`@typescript-eslint/naming-convention`)
   - **Rationale**: Contract schemas and their fields dictate the naming of generated structures. We cannot mandate `camelCase` or `PascalCase` constraints natively inside a generated API binding if the contract source does not natively adhere to TS rules.
2. **Unused Variables** (`@typescript-eslint/no-unused-vars`)
   - **Rationale**: Boilerplate output by the generator might safely discard standard parameters or type imports that the AST produces globally, even if a specific instance does not utilize them. 
3. **Explicit Any / Unsafe Rules** (`@typescript-eslint/no-explicit-any`, `@typescript-eslint/no-unsafe-assignment`, etc.)
   - **Rationale**: Interacting with low-level auto-generated binding code often entails dynamic typing or parsing blocks emitted blindly by the codegen script, which we cannot wrap in manually written generic narrowing operations without modifying the codegen tool itself.

## Security & Core Rules
These files remain subject to core formatting (via Prettier) and critical path validation.
The linter will still catch fatal syntactical errors, but it steps aside for purely stylistic constraints dictated by external inputs.
