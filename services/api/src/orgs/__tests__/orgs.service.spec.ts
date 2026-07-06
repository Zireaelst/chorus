import { Test, TestingModule } from '@nestjs/testing';
import { OrgsService } from '../orgs.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { BadRequestException, ConflictException } from '@nestjs/common';

describe('OrgsService - inviteMember', () => {
  let service: OrgsService;
  let prisma: PrismaService;
  let audit: AuditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrgsService,
        {
          provide: PrismaService,
          useValue: {
            organization: {
              findUnique: jest.fn(),
            },
            user: {
              findUnique: jest.fn(),
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

    service = module.get<OrgsService>(OrgsService);
    prisma = module.get<PrismaService>(PrismaService);
    audit = module.get<AuditService>(AuditService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw validation error if email is invalid', async () => {
    await expect(
      service.inviteMember('org1', 'actor1', 'not-an-email', 'hospital_admin')
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw validation error if role is invalid for org type', async () => {
    jest.spyOn(prisma.organization, 'findUnique').mockResolvedValue({
      id: 'org1',
      name: 'Test Org',
      type: 'sponsor',
      workosOrgId: 'workos_123',
      createdAt: new Date(),
    } as any);

    await expect(
      service.inviteMember('org1', 'actor1', 'test@test.com', 'clinician')
    ).rejects.toMatchObject({
      response: {
        error: {
          code: 'VALIDATION_ERROR',
        },
      },
    });
  });

  it('should throw conflict if user is already a member', async () => {
    jest.spyOn(prisma.organization, 'findUnique').mockResolvedValue({
      id: 'org1',
      name: 'Test Org',
      type: 'hospital',
      workosOrgId: 'workos_123',
      createdAt: new Date(),
    } as any);

    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: 'user1',
      email: 'test@test.com',
      workosUserId: 'workos_u123',
      memberships: [{ orgId: 'org1', role: 'clinician' }],
    } as any);

    await expect(
      service.inviteMember('org1', 'actor1', 'test@test.com', 'clinician')
    ).rejects.toMatchObject({
      response: {
        error: {
          code: 'ALREADY_MEMBER',
        },
      },
    });
  });

  it('should invite member and log audit event', async () => {
    jest.spyOn(prisma.organization, 'findUnique').mockResolvedValue({
      id: 'org1',
      name: 'Test Org',
      type: 'hospital',
      workosOrgId: 'workos_123',
      createdAt: new Date(),
    } as any);

    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

    const result = await service.inviteMember('org1', 'actor1', 'test@test.com', 'clinician');

    expect(result).toMatchObject({
      email: 'test@test.com',
      role: 'clinician',
      status: 'pending',
    });
    expect(result.inviteId).toBeDefined();

    expect(audit.logEvent).toHaveBeenCalledWith({
      actorUserId: 'actor1',
      orgId: 'org1',
      eventType: 'member.invited',
      metadata: { inviteeEmail: 'test@test.com', role: 'clinician' },
    });
  });
});
