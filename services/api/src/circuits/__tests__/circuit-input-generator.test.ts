import { generateCircuitInput } from '../circuit-input-generator';

describe('Circuit Input Generator', () => {
    it('generates identical circuit shapes regardless of hospital or sponsor origin', () => {
        const hospitalCriteria = {
            schemaVersion: '1.0' as const,
            clinical: [{ field: 'ICD10', operator: 'eq' as const, value: 'E11.9' }],
            demographic: [{ field: 'age' as const, operator: 'gte' as const, value: 18 }],
            logicalOperator: 'AND' as const
        };

        const sponsorCriteria = {
            schemaVersion: '1.0' as const,
            clinical: [{ field: 'ICD10', operator: 'eq' as const, value: 'E11.9' }],
            demographic: [{ field: 'age' as const, operator: 'gte' as const, value: 18 }],
            logicalOperator: 'AND' as const
        };

        const hospitalResult = generateCircuitInput(hospitalCriteria);
        const sponsorResult = generateCircuitInput(sponsorCriteria);

        expect(hospitalResult).toEqual(sponsorResult);
        expect(hospitalResult.clinical_rules).toHaveLength(1);
        expect(hospitalResult.demographic_rules).toHaveLength(1);
    });
});
