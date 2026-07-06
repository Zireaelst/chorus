import { Test, TestingModule } from '@nestjs/testing';
import { PayoutsService } from '../payouts.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';

describe('PayoutsService', () => {
  let service: PayoutsService;
  let prisma: PrismaService;
  let audit: AuditService;

  const mockPrismaService = {
    payout: {
      findMany: jest.fn(),
    },
  };

  const mockAuditService = {
    logEvent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PayoutsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: AuditService, useValue: mockAuditService },
      ],
    }).compile();

    service = module.get<PayoutsService>(PayoutsService);
    prisma = module.get<PrismaService>(PrismaService);
    audit = module.get<AuditService>(AuditService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return payouts and call audit service', async () => {
    const mockPayout = {
      id: 'p1',
      contributionId: 'c1',
      orgId: 'org1',
      amount: 100.5,
      currency: 'USD',
      onChainTxRef: '0x123',
      settledAt: new Date('2025-01-01T00:00:00Z'),
    };

    mockPrismaService.payout.findMany.mockResolvedValue([mockPayout]);

    const result = await service.getPayouts('org1', 'user1', undefined, 25);
    
    expect(result.items).toHaveLength(1);
    expect(result.nextCursor).toBeNull();
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items[0]?.id).toBe('p1');
    expect(result.items[0]?.amount).toBe(100.5);
    
    expect(audit.logEvent).toHaveBeenCalledWith({
      actorUserId: 'user1',
      orgId: 'org1',
      eventType: 'payouts_read',
      metadata: { cursor: undefined, limit: 25, resultsCount: 1 },
    });
  });

  it('should handle pagination cursor correctly', async () => {
    const mockPayout1 = { id: 'p1', amount: 10 };
    const mockPayout2 = { id: 'p2', amount: 20 };
    
    mockPrismaService.payout.findMany.mockResolvedValue([mockPayout1, mockPayout2]);

    const result = await service.getPayouts('org1', 'user1', undefined, 1);
    
    // It should pop the last item to use as nextCursor
    expect(result.items).toHaveLength(1);
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items[0]?.id).toBe('p1');
    expect(result.nextCursor).toBe('p2');
    
    expect(prisma.payout.findMany).toHaveBeenCalledWith(expect.objectContaining({
      take: 2, // limit + 1
    }));
  });
});
