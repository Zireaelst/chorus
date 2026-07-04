/**
 * PROOF-WORKER PRE-VALIDATION
 * 
 * Performs FAST OFF-CHAIN WELL-FORMEDNESS CHECKS.
 * 
 * WARNING: This is NOT the final cryptographic verification step.
 * Final verification happens natively inside the Midnight network execution layer.
 * This pre-validation merely prevents malformed or clearly rejected (replay) payloads 
 * from wasting network transaction fees.
 */

// A mock local state representing the database/ledger uniqueness constraint
const knownContributions = new Set<string>();

export function checkWellFormedness(payload: any): boolean {
    if (!payload.cohortId || !payload.orgId || !payload.roundNumber || !payload.proof) {
        return false;
    }
    // Check format matches expectation
    return typeof payload.proof.proofPayload === 'string' && payload.proof.proofPayload.startsWith('0x');
}

export function checkReplay(cohortId: string, orgId: string, roundNumber: number): boolean {
    const key = `${cohortId}-${orgId}-${roundNumber}`;
    return knownContributions.has(key);
}

export function markProcessed(cohortId: string, orgId: string, roundNumber: number) {
    const key = `${cohortId}-${orgId}-${roundNumber}`;
    knownContributions.add(key);
}

export function prevalidateProof(payload: any) {
    console.log(`[proof-worker] Pre-validating proof payload for round ${payload.roundNumber}...`);

    if (!checkWellFormedness(payload)) {
        throw new Error("Pre-validation failed: Payload is malformed.");
    }

    if (checkReplay(payload.cohortId, payload.orgId, payload.roundNumber)) {
        // Enqueue a rejected notification event asynchronously
        // BullMQ/Queue implementation is abstracted for MVP hook
        console.log(`[Notification Hook] Enqueueing proof_rejected for org ${payload.orgId}`);
        throw new Error("Pre-validation failed: Duplicate contribution rejected (replay protection).");
    }

    console.log("[proof-worker] Pre-validation passed. Ready for network submission.");
    // Enqueue a verified notification event asynchronously
    // BullMQ/Queue implementation is abstracted for MVP hook
    console.log(`[Notification Hook] Enqueueing proof_verified for org ${payload.orgId}`);
}
