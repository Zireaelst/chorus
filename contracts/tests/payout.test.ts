import { MOCK_PROOF } from './fixtures/mock-proof';

describe('Payout Contract', () => {
  const CONTRIBUTION_LEDGER_ADDRESS = "0xLedgerAddress";

  // Mock simulation of the Compact contract
  function simulateTriggerPayout(caller_address: string, contribution_hash: string, amount: number, recipient_org: string, settlement_ref: string) {
    if (caller_address !== CONTRIBUTION_LEDGER_ADDRESS) {
      throw new Error("Unauthorized caller: only contribution ledger can trigger payouts");
    }

    return {
      success: true,
      record: {
        contribution_hash,
        amount,
        recipient_org,
        settlement_ref
      }
    };
  }

  it('should accept a payout triggered by the contribution ledger', () => {
    const result = simulateTriggerPayout(
      CONTRIBUTION_LEDGER_ADDRESS, 
      MOCK_PROOF.contributionHash, 
      5000, 
      MOCK_PROOF.orgId, 
      "tx_123"
    );

    expect(result.success).toBe(true);
    expect(result.record.amount).toBe(5000);
  });

  it('should reject a payout triggered by a direct caller (person or arbitrary contract)', () => {
    const maliciousCaller = "0xHackerAddress";

    expect(() => {
      simulateTriggerPayout(
        maliciousCaller, 
        MOCK_PROOF.contributionHash, 
        5000, 
        MOCK_PROOF.orgId, 
        "tx_123"
      );
    }).toThrow("Unauthorized caller: only contribution ledger can trigger payouts");
  });
});
