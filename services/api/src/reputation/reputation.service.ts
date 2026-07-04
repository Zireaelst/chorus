import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { calculateReputationV1, FORMULA_VERSION } from './formula-v1';

@Injectable()
export class ReputationService {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Triggered by `proof-worker` or ledger events upon a verified contribution.
     * This is the SOLE write path to `reputation_scores`.
     */
    async updateScoreForOrganization(orgId: string): Promise<void> {
        // In a fully integrated environment, we'd query the ledger or a materialized view of 
        // past contributions for this organization to get exact counts. 
        // For MVP structure, we mock the retrieval of contribution history to feed the formula.
        
        // Mock retrieval:
        const verifiedCount = 5; // e.g., await this.prisma.contributions.count(...)
        const rejectedCount = 0;

        const newScore = calculateReputationV1(verifiedCount, rejectedCount);

        // Upsert or write the new score row
        // Normally, we'd append a new row for temporal history, or update the active one.
        // Prisma `create` works for append-only log, but for now we just create a snapshot record.
        await this.prisma.reputationScore.create({
            data: {
                orgId,
                score: newScore,
                formulaVersion: FORMULA_VERSION,
                // computedAt is default(now())
            }
        });
    }

    async getLatestScore(orgId: string) {
        return this.prisma.reputationScore.findFirst({
            where: { orgId },
            orderBy: { computedAt: 'desc' }
        });
    }
}
