import { generateLocalKey, getLocalKey } from '../src/keys/keygen';
import { LocalTrainingHarness } from '../src/training/harness';
import { TrainingCorrectnessCircuit } from '../src/circuits/training-correctness-circuit';
import { ProofSubmitter } from '../src/submit';
import { prevalidateProof } from '../../../services/proof-worker/src/prevalidate';
import { submitToTestChain } from '../../../services/proof-worker/src/submit-transaction';

describe('Sprint 8: Zero-Knowledge Engine E2E Pipeline', () => {

    it('should generate a local key without throwing', () => {
        const key = generateLocalKey();
        expect(key).toBeDefined();
        expect(key.privateKey).toContain('PRIVATE KEY');
        expect(key.publicKey).toContain('PUBLIC KEY');

        const savedKey = getLocalKey();
        expect(savedKey).toEqual(key);
    });

    it('should run the full pipeline successfully using synthetic data', () => {
        // NOTE: This pipeline operates on synthetic data strictly bounded inside harness.ts
        
        const cohortId = "synth_cohort_001";
        const orgId = "synth_org_001";
        const roundNumber = 1;
        const previousCheckpoint = "0xGenesis";

        // 1. Local Training
        const { update, trace } = LocalTrainingHarness.runTrainingRound(previousCheckpoint);
        expect(update.weights.length).toBeGreaterThan(0);

        // 2. Circuit Execution & Timing
        const startTime = Date.now();
        const proof = TrainingCorrectnessCircuit.generateProof(cohortId, orgId, roundNumber, update, trace);
        const endTime = Date.now();
        
        const durationMs = endTime - startTime;
        console.log(`[Metrics] VPFL/TrustDFL Mock Proof Generation Time: ${durationMs}ms`);
        // We report this metric instead of defining a pass/fail threshold, as directed by the prompt.

        expect(proof.proofPayload).toBeDefined();

        // 3. Packaging and Signing
        const payload = ProofSubmitter.packageAndSubmit(proof);
        expect(payload.signature).toContain("mock_signature");

        // 4. Proof-Worker Pre-Validation (Off-chain)
        expect(() => prevalidateProof(payload)).not.toThrow();

        // 5. Test Chain Submission
        const result = submitToTestChain(payload);
        expect(result.success).toBe(true);
        expect(result.transactionHash).toBeDefined();
    });

    it('should explicitly reject a replayed payload at the pre-validation step', () => {
        const cohortId = "synth_cohort_001";
        const orgId = "synth_org_001";
        const roundNumber = 1;
        const previousCheckpoint = "0xGenesis";

        // Generate the identical payload
        const { update, trace } = LocalTrainingHarness.runTrainingRound(previousCheckpoint);
        const proof = TrainingCorrectnessCircuit.generateProof(cohortId, orgId, roundNumber, update, trace);
        const payload = ProofSubmitter.packageAndSubmit(proof);

        // Expect pre-validation to throw replay error
        expect(() => prevalidateProof(payload)).toThrow("Pre-validation failed: Duplicate contribution rejected (replay protection).");
    });
});
