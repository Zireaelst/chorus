import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LicensesService {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Checks compliance flags for a cohort.
     * In MVP this simulates the check against the compliance engine.
     */
    private async hasBlockingComplianceFlags(cohortId: string): Promise<boolean> {
        // Simulating the compliance engine response (Feature 12 acceptance criteria)
        // A model trained on a cohort with an unresolved blocking flag cannot be licensed.
        return false;
    }

    async createLicense(checkpointId: string, licenseeName: string, termsText: string) {
        const checkpoint = await this.prisma.modelCheckpoint.findUnique({
            where: { id: checkpointId },
            include: { cohort: true }
        });

        if (!checkpoint) {
            throw new NotFoundException('Model Checkpoint not found');
        }

        const isBlocked = await this.hasBlockingComplianceFlags(checkpoint.cohortId);

        if (isBlocked) {
            throw new ConflictException({
                error: {
                    code: 'UNRESOLVED_COMPLIANCE_FLAGS',
                    message: 'Cannot license a model whose cohort has unresolved blocking compliance flags'
                }
            });
        }

        const license = await this.prisma.modelLicense.create({
            data: {
                checkpointId,
                licenseeName,
                termsText
            }
        });

        return license;
    }

    async getLicenses(checkpointId: string) {
        return this.prisma.modelLicense.findMany({
            where: { checkpointId },
            orderBy: { createdAt: 'desc' }
        });
    }
}
