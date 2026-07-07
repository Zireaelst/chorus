import express from 'express';
import cors from 'cors';
import { TrainingCorrectnessCircuit } from './circuits/training-correctness-circuit';
import { ProofSubmitter } from './submit';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/trigger-training', async (req, res) => {
    console.log("=== Chorus Node Demo ===");
    console.log("Received request to trigger training from dashboard...");

    const cohortId = req.body.cohortId || "88888888-8888-8888-8888-888888888888";
    const orgId = req.body.orgId || "11111111-1111-1111-1111-111111111111";
    // Generate a random round number for each run so it doesn't fail with DUPLICATE_CONTRIBUTION
    // (except if the dashboard intentionally sends the same roundNumber to test rejection)
    const roundNumber = req.body.roundNumber || Math.floor(Math.random() * 10000);

    console.log(`Targeting Cohort: ${cohortId}`);
    console.log(`Acting as Org: ${orgId}`);
    console.log(`Training Round: ${roundNumber}`);

    // Generate the proof (using synthetic trace logic)
    console.log("\n1. Generating VPFL/TrustDFL proof against synthetic data...");
    const proof = TrainingCorrectnessCircuit.generateProof(
        cohortId,
        orgId,
        roundNumber,
        { checkpointHash: "0xMockCheckpoint", updateHash: "0xMockUpdate", weights: "0xMockWeights" } as any,
        { dataHash: "0xSyntheticData" } as any
    );

    // Package the payload
    console.log("2. Packaging proof for submission...");
    const payload = ProofSubmitter.packageAndSubmit(proof);

    // Submit to the API
    console.log(`3. Submitting POST /v1/proofs...`);
    try {
        const response = await axios.post('http://localhost:3001/v1/proofs', payload, {
            headers: {
                'Authorization': 'Bearer local-demo-key',
                'x-user-role': 'hospital_admin',
                'x-org-id': orgId,
                'Idempotency-Key': `demo-proof-${roundNumber}-${Date.now()}`
            }
        });

        console.log(`API Response:`, response.data);
        console.log(`\nDemo step complete! Proof is queued for proof-worker.`);
        
        res.status(200).json({ success: true, roundNumber, ...response.data });
    } catch (err: any) {
        console.error("API Error:", err.response?.data || err.message);
        res.status(err.response?.status || 500).json({ success: false, error: err.response?.data || err.message });
    }
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
    console.log(`Chorus Node Demo listening on port ${PORT}`);
});
