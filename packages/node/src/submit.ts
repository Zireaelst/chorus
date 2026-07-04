/**
 * PROOF SUBMISSION CLIENT
 * 
 * Packages the generated ZK proofs along with local training metadata,
 * signs it using the NON-CUSTODIAL local key, and submits to `proof-worker`.
 */
import { signPayload } from './keys/keygen';
import { TrainingCorrectnessProof } from './circuits/training-correctness-circuit';

export interface ProofSubmissionPayload {
    cohortId: string;
    orgId: string;
    roundNumber: number;
    proof: TrainingCorrectnessProof;
    signature: string;
    timestamp: number;
}

export class ProofSubmitter {
    public static packageAndSubmit(proof: TrainingCorrectnessProof): ProofSubmissionPayload {
        console.log("Packaging proof for submission...");
        
        const timestamp = Date.now();
        const rawPayload = JSON.stringify({
            cohortId: proof.cohortId,
            orgId: proof.orgId,
            roundNumber: proof.roundNumber,
            timestamp
        });

        // Sign the payload locally (non-custodial)
        const signature = signPayload(rawPayload);

        const payload: ProofSubmissionPayload = {
            cohortId: proof.cohortId,
            orgId: proof.orgId,
            roundNumber: proof.roundNumber,
            proof,
            signature,
            timestamp
        };

        console.log("Payload signed locally. Simulating dispatch to POST /v1/proofs...");
        return payload;
    }
}
