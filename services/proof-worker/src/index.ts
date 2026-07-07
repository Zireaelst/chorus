import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { prevalidateProof } from './prevalidate';
import { submitToTestChain } from './submit-transaction';
import { prisma, auditService } from './db';

// Match the API's redis client configuration logic if needed, simple for test
const redisClient = new IORedis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  maxRetriesPerRequest: null, // Required by BullMQ
});

console.log("[proof-worker] Starting BullMQ Worker on 'proof-verification' queue...");

const worker = new Worker(
  'proof-verification',
  async (job) => {
    const { contributionId, cohortId, orgId, roundNumber, proof } = job.data;
    console.log(`\n[proof-worker] Received job for contribution ${contributionId} (Round ${roundNumber})`);

    try {
      // 1. Off-chain well-formedness checks
      prevalidateProof(job.data);

      // 2. Test-chain transaction submission
      const result = submitToTestChain(job.data);

      if (result.success && result.transactionHash) {
        // 3. Status transition to verified
        await prisma.contribution.upsert({
          where: { id: contributionId },
          update: {
            status: 'verified',
            verifiedAt: new Date(),
            onChainTxRef: result.transactionHash,
          },
          create: {
            id: contributionId,
            cohortId,
            orgId,
            roundNumber,
            status: 'verified',
            verifiedAt: new Date(),
            onChainTxRef: result.transactionHash,
          }
        });

        console.log(`[proof-worker] DB: Contribution ${contributionId} status updated to verified.`);

        // 4. Implement payout-trigger logic
        const payout = await prisma.payout.create({
          data: {
            contributionId,
            orgId,
            amount: 100.00, // Placeholder
            currency: 'USD',
            onChainTxRef: result.transactionHash,
            settledAt: new Date(),
          }
        });

        console.log(`[proof-worker] DB: Payout ${payout.id} automatically triggered.`);

        // 5. Audit logs for status transition and payout
        await auditService.logEvent({
          actorUserId: '22222222-2222-2222-2222-222222222222',
          orgId,
          eventType: 'proof_verified',
          metadata: { contributionId, transactionHash: result.transactionHash }
        });

        await auditService.logEvent({
          actorUserId: '22222222-2222-2222-2222-222222222222',
          orgId,
          eventType: 'payout_issued',
          metadata: { payoutId: payout.id, amount: 100.00, currency: 'USD' }
        });
      }
    } catch (err: any) {
      console.error(`[proof-worker] Processing failed: ${err.message}`);
      
      // Update contribution to rejected
      await prisma.contribution.upsert({
        where: { id: contributionId },
        update: {
          status: 'rejected',
        },
        create: {
          id: contributionId,
          cohortId,
          orgId,
          roundNumber,
          status: 'rejected',
        }
      });

      await auditService.logEvent({
        actorUserId: '22222222-2222-2222-2222-222222222222',
        orgId,
        eventType: 'proof_rejected',
        metadata: { contributionId, reason: err.message }
      });

      throw err; // Re-throw for BullMQ retry logic if applicable
    }
  },
  { connection: redisClient as any }
);

worker.on('completed', (job) => {
  console.log(`[proof-worker] Job ${job.id} has completed successfully.`);
});

worker.on('failed', (job, err) => {
  console.log(`[proof-worker] Job ${job?.id} has failed with ${err.message}`);
});

process.on('SIGINT', async () => {
  await worker.close();
  await redisClient.quit();
  await prisma.$disconnect();
  process.exit(0);
});
