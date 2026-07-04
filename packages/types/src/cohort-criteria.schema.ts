// Cohort criteria Zod schema — the shared contract between:
//   - services/ai (Criteria Extraction Agent output)
//   - services/api (request body validation for POST /v1/cohorts)
//   - apps/dashboard (cohort criteria builder form validation)
//   - The v0.8 eligibility circuit generator (which consumes this exact schema)
//
// Source: FEATURE_SPECIFICATION.md — "A saved draft's shape validates against the schema
// the v0.8 circuit generator consumes, with no transformation step required between the two."
// Source: FRONTEND_GUIDELINES.md — "the zod schema is imported from packages/types — the
// same schema the API validates against server-side, so client and server validation can
// never drift out of sync."
//
// IMPORTANT: Changes to this schema require review with a ZK engineer (see
// chorus-github-project-backlog.md: needs-zk-signoff label), because the schema determines
// the shape of the eligibility circuit.

import { z } from 'zod'

// ── Primitive building blocks ─────────────────────────────────────────────────

// Clinical field operators — the set of comparisons valid against a clinical value
const ClinicalOperatorSchema = z.enum(['eq', 'neq', 'in', 'nin', 'gte', 'lte', 'between'])

// Demographic field operators — more limited set than clinical
const DemographicOperatorSchema = z.enum(['eq', 'neq', 'gte', 'lte', 'between'])

// A single clinical criterion row: field / operator / value(s)
const ClinicalCriterionSchema = z.object({
  // ICD-10, SNOMED, LOINC, or a Chorus-defined field name
  field: z.string().min(1).max(128),
  operator: ClinicalOperatorSchema,
  // Single value for eq/neq/gte/lte; array of exactly 2 for between; array for in/nin
  value: z.union([z.string(), z.number(), z.array(z.union([z.string(), z.number()]))]),
  // Optional display label for the UI — never reaches the circuit
  label: z.string().max(256).optional(),
})

// A single demographic criterion row
const DemographicCriterionSchema = z.object({
  field: z.enum(['age', 'sex', 'biological_sex', 'country_of_birth']),
  operator: DemographicOperatorSchema,
  value: z.union([z.string(), z.number(), z.array(z.union([z.string(), z.number()]))]),
  label: z.string().max(256).optional(),
})

// ── Main schema ──────────────────────────────────────────────────────────────

export const cohortCriteriaSchema = z
  .object({
    // Schema version — allows the v0.8 circuit generator to version-gate cleanly
    schemaVersion: z.literal('1.0'),

    // Clinical criteria — at least one required
    // API_SPEC.md: "at minimum one clinical field and one demographic field are required"
    clinical: z.array(ClinicalCriterionSchema).min(1, {
      message: 'At least one clinical criterion is required.',
    }),

    // Demographic criteria — at least one required
    demographic: z.array(DemographicCriterionSchema).min(1, {
      message: 'At least one demographic criterion is required.',
    }),

    // Optional exclusion criteria (same shape as clinical, negated in the circuit)
    exclusions: z.array(ClinicalCriterionSchema).optional(),

    // Operator combining all top-level criteria rows — AND is the only valid value for v0.1
    // Future: OR support requires circuit-level work tracked as a v0.7+ item
    logicalOperator: z.literal('AND').default('AND'),
  })
  .strict() // Reject unknown keys — protects against accidental PHI fields being added

// ── Derived types ─────────────────────────────────────────────────────────────

export type CohortCriteria = z.infer<typeof cohortCriteriaSchema>
export type ClinicalCriterion = z.infer<typeof ClinicalCriterionSchema>
export type DemographicCriterion = z.infer<typeof DemographicCriterionSchema>
export type ClinicalOperator = z.infer<typeof ClinicalOperatorSchema>
export type DemographicOperator = z.infer<typeof DemographicOperatorSchema>
