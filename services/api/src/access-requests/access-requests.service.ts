import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateAccessRequest, DecideAccessRequest } from '@chorus/types';

@Injectable()
export class AccessRequestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService
  ) {}

  async createRequest(cohortId: string, orgId: string, userId: string, payload: CreateAccessRequest) {
    // Check if duplicate pending request exists
    const existing = await this.prisma.cohortAccessRequest.findFirst({
      where: {
        cohortId,
        requestingOrgId: orgId,
        status: 'pending'
      }
    });

    if (existing) {
      throw new ConflictException('REQUEST_ALREADY_PENDING');
    }

    const request = await this.prisma.cohortAccessRequest.create({
      data: {
        cohortId,
        requestingOrgId: orgId,
        status: 'pending',
        justification: payload.justification
      }
    });

    await this.audit.logEvent({
      orgId,
      actorUserId: userId,
      eventType: 'access_request.created',
      metadata: {
        requestId: request.id,
        cohortId
      }
    });

    return request;
  }

  async decideRequest(requestId: string, orgId: string, userId: string, payload: DecideAccessRequest) {
    const request = await this.prisma.cohortAccessRequest.findUnique({
      where: { id: requestId },
      include: { cohort: true }
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    if (request.cohort.orgId !== orgId) {
      throw new ForbiddenException('Cannot decide request for cohort owned by another organization');
    }

    if (request.status !== 'pending') {
      throw new ConflictException('REQUEST_NOT_PENDING');
    }

    const updated = await this.prisma.cohortAccessRequest.update({
      where: { id: requestId },
      data: {
        status: payload.decision,
        decidedByUserId: userId,
        decidedAt: new Date()
      }
    });

    await this.audit.logEvent({
      orgId,
      actorUserId: userId,
      eventType: `access_request.${payload.decision}`,
      metadata: {
        requestId,
        cohortId: request.cohortId,
        note: payload.note
      }
    });

    // Enqueue an access request decision notification asynchronously
    // BullMQ/Queue implementation is abstracted for MVP hook
    console.log(`[Notification Hook] Enqueueing access_request_${payload.decision} for org ${request.requestingOrgId}`);

    return updated;
  }

  // Helper method for Sponsor to list their own requests
  async listMyRequests(orgId: string) {
    return this.prisma.cohortAccessRequest.findMany({
      where: { requestingOrgId: orgId },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Helper method for Hospital to list incoming requests
  async listIncomingRequests(orgId: string) {
    return this.prisma.cohortAccessRequest.findMany({
      where: { cohort: { orgId } },
      include: {
        requestingOrg: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
