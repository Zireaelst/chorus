import { CohortCriteria, ClinicalCriterion, DemographicCriterion } from '@chorus/types';

/**
 * Circuit Input Generator
 * 
 * Takes the unified CohortCriteria schema (originating from either Hospital drafts 
 * or Sponsor trial searches) and formats it into the exact layout expected by the 
 * Sprint 8 Eligibility Circuit scaffold.
 */

export interface CircuitInputPayload {
    criteria_hash: string;
    clinical_rules: any[];
    demographic_rules: any[];
    exclusions: any[];
    logical_operator: string;
}

export function generateCircuitInput(criteria: CohortCriteria): CircuitInputPayload {
    // A simplistic criteria hashing mechanism for the MVP test path
    const criteriaHash = "0x" + Buffer.from(JSON.stringify(criteria)).toString('hex').substring(0, 32);

    return {
        criteria_hash: criteriaHash,
        clinical_rules: criteria.clinical.map((c: ClinicalCriterion) => ({
            f: c.field,
            op: c.operator,
            val: c.value
        })),
        demographic_rules: criteria.demographic.map((d: DemographicCriterion) => ({
            f: d.field,
            op: d.operator,
            val: d.value
        })),
        exclusions: criteria.exclusions?.map((e: ClinicalCriterion) => ({
            f: e.field,
            op: e.operator,
            val: e.value
        })) || [],
        logical_operator: criteria.logicalOperator
    };
}
