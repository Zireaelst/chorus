# Demo Script: End-to-End Proof Verification and Payout

**Narrator:** 
Welcome to the Chorus Node end-to-end demonstration. Today we will walk through the full lifecycle of a federated learning contribution, from proof generation at the hospital to automated payout settlement on the ledger.

### Step 1: Cohort Submission & Proof Generation
**Action:** The hospital's local Chorus Node runs the training on their private, synthetic data and generates a VPFL/TrustDFL proof of correctness.
**Narrator:** The hospital's Chorus Node has just completed a training round against local synthetic data. It generates a zero-knowledge proof of correctness, ensuring that the claimed model update is mathematically valid without ever exposing the raw data itself.

### Step 2: API Submission
**Action:** The Node submits the packaged proof to the `POST /v1/proofs` endpoint.
**Narrator:** This proof is signed non-custodially using the hospital's local key and dispatched to the Chorus API, where it enters the `proof-verification` queue.

### Step 3: Off-Chain Pre-Validation
**Action:** The `proof-worker` consumes the job.
**Narrator:** Our orchestration worker picks up the job and performs a fast, off-chain well-formedness check to protect the network from malformed or duplicate replay attacks. 

### Step 4: Network Verification & Ledger Update
**Action:** The `proof-worker` submits the transaction.
**Narrator:** The transaction is now submitted to the network. Verification here runs against a local test-chain instance with synthetic data. Deployment to Midnight's real testnet is a near-term next step, pending real testnet credentials and the standard two-approval-plus-ZK-signoff process this team has deliberately not skipped.

### Step 5: Automated Payout Trigger
**Action:** The `Payout` row is automatically generated.
**Narrator:** With the contribution securely verified on the ledger, the payout trigger fires automatically. A deterministic Payout row is recorded using our placeholder settlement asset. This guarantees that hospital compensation is an inescapable consequence of verification—no manual invoicing, no discretionary approval step, and no possibility of front-running.

**Conclusion:** 
Both the verified contribution and the settled payout are now fully visible in the hospital's Dashboard, anchored by undeniable on-chain truth.
