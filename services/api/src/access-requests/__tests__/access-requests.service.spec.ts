import { Test, TestingModule } from '@nestjs/testing';
import { AccessRequestsService } from '../access-requests.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';

describe('AccessRequestsService', () => {
  let service: AccessRequestsService;
  let prisma: any;
  let audit: any;

  beforeEach(async () => {
    prisma = {
      cohortAccessRequest: {
        findFirst: jest.fn(),
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      }
    };
    
    audit = {
      log: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessRequestsService,
        { provide: PrismaService, useValue: prisma },
        { provide: AuditService, useValue: audit }
      ],
    }).compile();

    service = module.get<AccessRequestsService>(AccessRequestsService);
  });

  describe('createRequest', () => {
    it('should reject duplicate pending requests', async () => {
      prisma.cohortAccessRequest.findFirst.mockResolvedValue({ id: 'existing-id' });
      
      await expect(service.createRequest('cohort-1', 'org-1', 'user-1', { justification: 'test' }))
        .rejects.toThrow(ConflictException);
    });

    it('should create request and log audit if no duplicates', async () => {
      prisma.cohortAccessRequest.findFirst.mockResolvedValue(null);
      prisma.cohortAccessRequest.create.mockResolvedValue({ id: 'new-id' });
      
      const res = await service.createRequest('cohort-1', 'org-1', 'user-1', { justification: 'test' });
      expect(res.id).toBe('new-id');
      expect(audit.log).toHaveBeenCalledWith('org-1', 'user-1', 'access_request.created', expect.any(Object));
    });
  });

  describe('decideRequest', () => {
    it('should reject if hospital does not own the cohort', async () => {
      prisma.cohortAccessRequest.findUnique.mockResolvedValue({
        id: 'req-1',
        status: 'pending',
        cohort: { orgId: 'other-org' }
      });
      
      await expect(service.decideRequest('req-1', 'my-org', 'user-1', { decision: 'approved' }))
        .rejects.toThrow(ForbiddenException);
    });

    it('should approve and log audit', async () => {
      prisma.cohortAccessRequest.findUnique.mockResolvedValue({
        id: 'req-1',
        status: 'pending',
        cohortId: 'cohort-1',
        cohort: { orgId: 'my-org' }
      });
      
      prisma.cohortAccessRequest.update.mockResolvedValue({ id: 'req-1', status: 'approved' });
      
      const res = await service.decideRequest('req-1', 'my-org', 'user-1', { decision: 'approved' });
      
      expect(res.status).toBe('approved');
      expect(audit.log).toHaveBeenCalledWith('my-org', 'user-1', 'access_request.approved', expect.any(Object));
    });
  });
});
