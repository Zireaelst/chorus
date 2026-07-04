/**
 * REPUTATION SCORING FORMULA v1.0
 * 
 * PROVISIONAL / PLACEHOLDER: 
 * As specified in FEATURE_SPECIFICATION.md, the final reputation mechanism
 * is an open design question. This v1 formula serves as the versioned placeholder
 * establishing the schema contract until the final weights are settled.
 * 
 * Formula (v1): 
 *  Base = 100
 *  +10 points per verified contribution
 *  -50 points per rejected contribution (e.g., poisoned/malformed data caught by pre-check or chain)
 *  Floor = 0
 */

export const FORMULA_VERSION = "1.0";

export function calculateReputationV1(verifiedContributionsCount: number, rejectedContributionsCount: number): number {
    const base = 100;
    const verifiedValue = verifiedContributionsCount * 10;
    const rejectedValue = rejectedContributionsCount * 50;

    const rawScore = base + verifiedValue - rejectedValue;
    return Math.max(0, rawScore);
}
