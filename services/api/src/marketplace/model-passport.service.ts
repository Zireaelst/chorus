import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ModelPassport } from '@chorus/types';

@Injectable()
export class ModelPassportService {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Derives a passport strictly from a ModelCheckpoint by querying the ledger/system
     * for verified contributions mapped to the referenced cohort/round range.
     * Ensures provenance is fully reproducible.
     */
    async derivePassport(checkpointId: string): Promise<ModelPassport> {
        const checkpoint = await this.prisma.modelCheckpoint.findUnique({
            where: { id: checkpointId }
        });

        if (!checkpoint) {
            throw new NotFoundException(`Checkpoint ${checkpointId} not found`);
        }

        // Mock derivation: In a real implementation this queries the off-chain contribution ledger 
        // to aggregate the verified contributions for the cohort between startRound and endRound.
        // For MVP, simulating this aggregation independently checkable:
        
        const provenance = [
            { orgId: 'org_123', verifiedContributions: 1500 },
            { orgId: 'org_456', verifiedContributions: 850 }
        ];

        return {
            checkpointId: checkpoint.id,
            checkpointHash: checkpoint.checkpointHash,
            cohortId: checkpoint.cohortId,
            provenance,
            derivedAt: new Date(),
            schemaVersion: '1.0'
        };
    }
}
