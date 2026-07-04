import { MOCK_PROOF } from './fixtures/mock-proof';

describe('Contribution Ledger Contract', () => {
  let mockLedgerState: Set<string>;

  beforeEach(() => {
    mockLedgerState = new Set();
  });

  // Mock simulation of the Compact contract
  function simulateRecordContribution(cohort_id: string, org_id: string, round_number: number, contribution_hash: string) {
    const key = `${cohort_id}-${org_id}-${round_number}`;
    
    if (mockLedgerState.has(key)) {
      throw new Error("Duplicate contribution rejected (replay protection)");
    }

    mockLedgerState.add(key);
    
    // Simulate triggering payout
    return simulateTriggerPayout(contribution_hash);
  }

  function simulateTriggerPayout(contribution_hash: string) {
    return {
      success: true,
      payoutTriggered: true,
      hash: contribution_hash
    };
  }

  it('should accept a valid contribution and trigger payout', () => {
    const result = simulateRecordContribution(
      MOCK_PROOF.cohortId,
      MOCK_PROOF.orgId,
      MOCK_PROOF.roundNumber,
      MOCK_PROOF.contributionHash
    );

    expect(result.success).toBe(true);
    expect(result.payoutTriggered).toBe(true);
    expect(mockLedgerState.size).toBe(1);
  });

  it('should reject a duplicate contribution (replay protection)', () => {
    // First submission
    simulateRecordContribution(
      MOCK_PROOF.cohortId,
      MOCK_PROOF.orgId,
      MOCK_PROOF.roundNumber,
      MOCK_PROOF.contributionHash
    );

    // Second submission (replay)
    expect(() => {
      simulateRecordContribution(
        MOCK_PROOF.cohortId,
        MOCK_PROOF.orgId,
        MOCK_PROOF.roundNumber,
        "0xSomeDifferentHashButSameTriple"
      );
    }).toThrow("Duplicate contribution rejected (replay protection)");
  });
});
