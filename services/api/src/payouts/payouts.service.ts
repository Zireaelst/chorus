import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class PayoutsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService
  ) {}

  async getPayouts(orgId: string, actorUserId: string, cursor?: string, limit: number = 25) {
    const take = Math.min(limit, 100);
    
    // We fetch one more to determine if there is a next page
    const payouts = await this.prisma.payout.findMany({
      where: { orgId },
      take: take + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1, // Skip the cursor itself
      }),
      orderBy: { settledAt: 'desc' },
    });

    let nextCursor: string | null = null;
    if (payouts.length > take) {
      const nextItem = payouts.pop();
      nextCursor = nextItem?.id ?? null;
    }

    // Sprint 3 constraint: Write to audit log exclusively via AuditService
    await this.auditService.logEvent({
      actorUserId,
      orgId,
      eventType: 'payouts_read',
      metadata: { cursor, limit: take, resultsCount: payouts.length }
    });

    return {
      items: payouts.map(p => ({
        id: p.id,
        contributionId: p.contributionId,
        amount: Number(p.amount), // Convert Decimal to JS Number
        currency: p.currency, // PROVISIONAL: pending decision from pending-decisions-ledger
        onChainTxRef: p.onChainTxRef,
        settledAt: p.settledAt,
      })),
      nextCursor,
    };
  }
}
