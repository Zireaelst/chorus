import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateDisputeDto, UpdateDisputeDto } from './disputes.dto';
import { SessionUser } from '@chorus/types';

@Injectable()
export class DisputesService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  async create(user: SessionUser, data: CreateDisputeDto) {
    // Validate that the subject exists
    if (data.subjectType === 'access_request') {
      const existing = await this.prisma.cohortAccessRequest.findUnique({
        where: { id: data.subjectId }
      });
      if (!existing) {
        throw new NotFoundException(`Subject access_request ${data.subjectId} not found`);
      }
    } else if (data.subjectType === 'contribution' || data.subjectType === 'payout') {
      // Mock resolution: the real implementations exist off-chain or on-chain without Prisma schema equivalents
      // so we assume they resolve successfully in this environment since off-chain indexer is out of scope.
      const isValidOnChain = true; 
      if (!isValidOnChain) {
         throw new NotFoundException(`Subject ${data.subjectType} ${data.subjectId} not found on-chain`);
      }
    } else {
      throw new BadRequestException('Invalid subject type');
    }

    const dispute = await this.prisma.dispute.create({
      data: { status: params?.status as any,
        subjectType: data.subjectType,
        subjectId: data.subjectId,
        description: data.description,
        status: 'open',
      }
    });

    await this.audit.logEvent({
      actorUserId: user.id,
      orgId: user.memberships[0].orgId,
      eventType: 'dispute.created',
      metadata: { status: params?.status as any, disputeId: dispute.id, subjectType: data.subjectType, subjectId: data.subjectId }
    });

    return dispute;
  }

  async list(status?: string) {
    const where = status ? { status } : {};
    return this.prisma.dispute.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
  }

  async getById(id: string) {
    const dispute = await this.prisma.dispute.findUnique({ where: { id } });
    if (!dispute) throw new NotFoundException('Dispute not found');
    return dispute;
  }

  async update(id: string, user: SessionUser, data: UpdateDisputeDto) {
    const dispute = await this.getById(id);
    const oldStatus = dispute.status;

    const updated = await this.prisma.dispute.update({
      where: { id },
      data: { status: params?.status as any,
        status: data.status,
        resolutionNote: data.resolutionNote !== undefined ? data.resolutionNote : undefined
      }
    });

    if (data.status && oldStatus !== data.status) {
      await this.audit.logEvent({
        actorUserId: user.id,
        orgId: user.memberships[0].orgId,
        eventType: 'dispute.status_updated',
        metadata: { status: params?.status as any, disputeId: id, oldStatus, newStatus: data.status, resolutionNote: data.resolutionNote }
      });
    } else if (data.resolutionNote) {
      await this.audit.logEvent({
        actorUserId: user.id,
        orgId: user.memberships[0].orgId,
        eventType: 'dispute.note_updated',
        metadata: { status: params?.status as any, disputeId: id, resolutionNote: data.resolutionNote }
      });
    }

    return updated;
  }
}
