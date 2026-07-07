import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async logEvent(params: {
    actorUserId: string;
    orgId: string;
    eventType: string;
    metadata: any;
  }) {
    await this.prisma.auditLog.create({
      data: {
        actorUserId: params.actorUserId,
        orgId: params.orgId,
        eventType: params.eventType,
        metadata: params.metadata,
      },
    });
  }
}
