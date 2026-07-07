import { Queue } from 'bullmq';
import { redisClient } from '../common/redis.client';
import { SubmitProofRequest } from '@chorus/types';

export const proofsQueue = new Queue('proof-verification', {
  connection: redisClient as any,
});

export async function enqueueProofForVerification(
  contributionId: string, 
  payload: SubmitProofRequest
) {
  // Matches the shape expected by proof-worker prevalidate.ts
  await proofsQueue.add('verify-proof', {
    contributionId,
    cohortId: payload.cohortId,
    orgId: payload.orgId,
    roundNumber: payload.roundNumber,
    proof: payload.proof
  });
}
