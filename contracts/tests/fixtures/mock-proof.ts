/**
 * NON-CRYPTOGRAPHIC MOCK PROOF
 * 
 * Used exclusively for Sprint 7 E2E tests before the real ZK circuits (v0.8) are built.
 * Do not use in production or attempt to submit to a real Midnight testnet node expecting actual zero-knowledge validation.
 */
export const MOCK_PROOF = {
  cohortId: "00000000000000000000000000000001",
  orgId: "00000000000000000000000000000002",
  roundNumber: 1,
  contributionHash: "0xMockHashValue1234567890abcdef",
  verificationTimestamp: 1682899200, // Example timestamp
  payload: "0xdeadbeef" // Dummy proof bytes
};
