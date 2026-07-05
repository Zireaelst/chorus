import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { enqueueProofForVerification } from './proofs.queue';
import { SubmitProofRequest } from '@chorus/types';

@Injectable()
export class ProofsService {
  constructor(private prisma: PrismaService) {}

  async submitProof(payload: SubmitProofRequest) {
    const { cohortId, orgId, roundNumber } = payload;

    // Check if the cohort is active (Provisional "open round" check)
    const cohort = await this.prisma.cohort.findUnique({
      where: { id: cohortId },
      select: { status: true },
    });

    if (!cohort) {
      throw new NotFoundException('Cohort not found');
    }

    if (cohort.status !== 'active') {
      throw new ConflictException({
        error: 'ROUND_CLOSED',
        message: 'Cannot submit proofs to a cohort that is not active',
      });
    }

    // Rely on database unique constraint [cohortId, orgId, roundNumber], but check manually first for nicer error
    const existing = await this.prisma.contribution.findUnique({
      where: {
        cohortId_orgId_roundNumber: {
          cohortId,
          orgId,
          roundNumber,
        }
      }
    });

    if (existing) {
      throw new ConflictException({
        error: 'DUPLICATE_CONTRIBUTION',
        message: 'A contribution for this round has already been submitted by this organization',
      });
    }

    let contribution;
    try {
      contribution = await this.prisma.contribution.create({
        data: {
          cohortId,
          orgId,
          roundNumber,
          status: 'pending', // Mapped to 'queued' on API
          proofRefHash: payload.proof.proofPayload.substring(0, 64) // mock storing some hash reference
        }
      });
    } catch (err: any) {
      // Prisma error code for unique constraint violation
      if (err.code === 'P2002') {
         throw new ConflictException({
            error: 'DUPLICATE_CONTRIBUTION',
            message: 'A contribution for this round has already been submitted by this organization',
          });
      }
      throw err;
    }

    await enqueueProofForVerification(contribution.id, payload);

    return {
      proofId: contribution.id,
      status: 'queued',
    };
  }

  async getProofStatus(proofId: string, orgId: string) {
    const contribution = await this.prisma.contribution.findUnique({
      where: { id: proofId }
    });

    if (!contribution) {
      throw new NotFoundException('Proof not found');
    }
    
    // Scoped to the submitting org
    if (contribution.orgId !== orgId) {
      throw new NotFoundException('Proof not found');
    }

    let apiStatus = contribution.status;
    if (apiStatus === 'pending') {
      apiStatus = 'queued';
    }

    return {
      proofId: contribution.id,
      status: apiStatus,
    };
  }
}
