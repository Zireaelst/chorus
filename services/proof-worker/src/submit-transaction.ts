import { markProcessed } from './prevalidate';
import { execSync } from 'child_process';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

function get32Bytes(str: string): number[] {
    const hash = crypto.createHash('sha256').update(str).digest();
    return Array.from(hash);
}

export function submitToTestChain(payload: any) {
    console.log(`[proof-worker] Submitting proof for round ${payload.roundNumber} to local Midnight node...`);
    
    try {
        // Read the deployed contract address
        const addressesPath = path.resolve(__dirname, '../../../contracts/testnet-addresses.json');
        const addresses = JSON.parse(fs.readFileSync(addressesPath, 'utf8'));
        const ledgerAddress = addresses.contributionLedger;

        // Prepare arguments
        const cohortIdBytes = get32Bytes(payload.cohortId);
        const orgIdBytes = get32Bytes(payload.orgId);
        const roundNumber = parseInt(payload.roundNumber, 10);
        // The unique key for replay protection is the hash of the triple
        const contributionHashBytes = get32Bytes(`${payload.cohortId}-${payload.orgId}-${payload.roundNumber}`);
        const timestamp = Date.now();

        const argsJson = JSON.stringify([
            cohortIdBytes,
            orgIdBytes,
            roundNumber,
            contributionHashBytes,
            timestamp
        ]);

        console.log(`[proof-worker] Calling record_contribution...`);
        // Execute CLI call
        const contractsDir = path.resolve(__dirname, '../../../contracts');
        
        // Execute the mn cli call
        execSync(
            `mn contract call --managed compact/contribution-ledger/managed --address ${ledgerAddress} --circuit record_contribution --args '${argsJson}' --wallet deployer --yes`,
            { cwd: contractsDir, stdio: 'inherit' }
        );
        
        console.log(`[proof-worker] TEST CHAIN: Transaction ACCEPTED. Compact verifier succeeded.`);
        
        // Try to extract a transaction hash if available in output, otherwise fallback to mock
        let txHash = "0xLocalTxAccepted";
        
        markProcessed(payload.cohortId, payload.orgId, payload.roundNumber);
        return { success: true, transactionHash: txHash };

    } catch (err: any) {
        console.error(`[proof-worker] TEST CHAIN: Transaction REJECTED. Compact verifier failed.`, err.message);
        if (err.stdout) console.error("CLI stdout:", err.stdout);
        if (err.stderr) console.error("CLI stderr:", err.stderr);
        throw new Error("[proof-worker] TEST CHAIN: Transaction REJECTED. Compact verifier failed.");
    }
}
