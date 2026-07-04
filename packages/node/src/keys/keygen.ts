/**
 * LOCAL SIGNING KEY GENERATION
 * 
 * Generates and locally stores the Chorus Node Midnight signing key.
 * 
 * SECURITY GUARANTEE:
 * This key material NEVER leaves the `packages/node` local storage boundary.
 * It is completely non-custodial. No network call transmits the private key.
 */
import { generateKeyPairSync } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

const KEYS_DIR = path.resolve(__dirname, '../../.keys');
const KEY_FILE = path.resolve(KEYS_DIR, 'node_private.pem');
const PUB_FILE = path.resolve(KEYS_DIR, 'node_public.pem');

export interface LocalKeyPair {
    publicKey: string;
    privateKey: string;
}

export function generateLocalKey(): LocalKeyPair {
    // Generate a fresh Ed25519 key pair for the local node identity
    const { publicKey, privateKey } = generateKeyPairSync('ed25519');

    const pubString = publicKey.export({ type: 'spki', format: 'pem' }).toString();
    const privString = privateKey.export({ type: 'pkcs8', format: 'pem' }).toString();

    // Persist securely in local storage ONLY
    if (!fs.existsSync(KEYS_DIR)) {
        fs.mkdirSync(KEYS_DIR, { recursive: true, mode: 0o700 }); // Restrictive permissions
    }

    fs.writeFileSync(KEY_FILE, privString, { mode: 0o600 });
    fs.writeFileSync(PUB_FILE, pubString, { mode: 0o644 });

    return {
        publicKey: pubString,
        privateKey: privString
    };
}

export function getLocalKey(): LocalKeyPair | null {
    if (fs.existsSync(KEY_FILE) && fs.existsSync(PUB_FILE)) {
        return {
            privateKey: fs.readFileSync(KEY_FILE, 'utf8'),
            publicKey: fs.readFileSync(PUB_FILE, 'utf8')
        };
    }
    return null;
}

export function signPayload(payload: string): string {
    const keyPair = getLocalKey();
    if (!keyPair) {
        throw new Error("No local key found. Generate one first.");
    }
    
    // In a real environment, we'd sign the payload using `crypto.sign`
    // For the mock ZK pipeline, we return a mock signature representation
    return `mock_signature_of_${payload}_using_local_key`;
}
