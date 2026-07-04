import { calculateReputationV1, FORMULA_VERSION } from '../formula-v1';

describe('Reputation Formula v1', () => {
    it('has the correct version string', () => {
        expect(FORMULA_VERSION).toBe('1.0');
    });

    it('calculates score correctly with no rejections', () => {
        // Base(100) + (5 * 10) = 150
        expect(calculateReputationV1(5, 0)).toBe(150);
    });

    it('calculates score correctly with rejections', () => {
        // Base(100) + (10 * 10) - (1 * 50) = 100 + 100 - 50 = 150
        expect(calculateReputationV1(10, 1)).toBe(150);
    });

    it('implements a floor of zero', () => {
        // Base(100) + (0 * 10) - (5 * 50) = -150 -> 0
        expect(calculateReputationV1(0, 5)).toBe(0);
    });
});
