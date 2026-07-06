import { Test, TestingModule } from '@nestjs/testing';
import { CohortsService } from '../cohorts.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('CohortsService - submitCohort', () => {
  let service: CohortsService;
  let prisma: PrismaService;
  let audit: AuditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CohortsService,
        {
          provide: PrismaService,
          useValue: {
            cohort: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: AuditService,
          useValue: {
            logEvent: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CohortsService>(CohortsService);
    prisma = module.get<PrismaService>(PrismaService);
    audit = module.get<AuditService>(AuditService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw NotFoundException if cohort does not exist or org mismatch', async () => {
    jest.spyOn(prisma.cohort, 'findUnique').mockResolvedValue(null);

    await expect(service.submitCohort('cohort1', 'org1', 'actor1')).rejects.toThrow(NotFoundException);
  });

  it('should throw ConflictException if cohort is not in draft state', async () => {
    jest.spyOn(prisma.cohort, 'findUnique').mockResolvedValue({
      id: 'cohort1',
      orgId: 'org1',
      status: 'submitted',
    } as any);

    await expect(service.submitCohort('cohort1', 'org1', 'actor1')).rejects.toMatchObject({
      response: {
        error: {
          code: 'INVALID_STATE',
        },
      },
    });
  });

  it('should throw ConflictException if cohort has blocking flags', async () => {
    jest.spyOn(prisma.cohort, 'findUnique').mockResolvedValue({
      id: 'cohort1',
      orgId: 'org1',
      status: 'draft',
    } as any);

    jest.spyOn(service, 'checkBlockingFlags').mockResolvedValue(true);

    await expect(service.submitCohort('cohort1', 'org1', 'actor1')).rejects.toMatchObject({
      response: {
        error: {
          code: 'UNRESOLVED_FLAGS',
        },
      },
    });
  });

  it('should update status to submitted and log audit event', async () => {
    jest.spyOn(prisma.cohort, 'findUnique').mockResolvedValue({
      id: 'cohort1',
      orgId: 'org1',
      status: 'draft',
    } as any);

    jest.spyOn(service, 'checkBlockingFlags').mockResolvedValue(false);

    jest.spyOn(prisma.cohort, 'update').mockResolvedValue({
      id: 'cohort1',
      status: 'submitted',
    } as any);

    const result = await service.submitCohort('cohort1', 'org1', 'actor1');

    expect(result).toMatchObject({
      id: 'cohort1',
      status: 'submitted',
    });
    expect(result.circuitGenerationJobId).toBeDefined();

    expect(audit.logEvent).toHaveBeenCalledWith({
      actorUserId: 'actor1',
      orgId: 'org1',
      eventType: 'cohort.submitted',
      metadata: { cohortId: 'cohort1' },
    });
  });
});
