import { Test, TestingModule } from '@nestjs/testing';
import { OrgsService } from './orgs.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { BadRequestException } from '@nestjs/common';

describe('OrgsService', () => {
  let service: OrgsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      organization: { findUnique: jest.fn() },
      user: { findUnique: jest.fn() }
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrgsService,
        { provide: PrismaService, useValue: prisma },
        { provide: AuditService, useValue: { logEvent: jest.fn() } },
      ],
    }).compile();

    service = module.get<OrgsService>(OrgsService);
  });

  describe('inviteMember', () => {
    it('should reject an invalid role for the org type', async () => {
      prisma.organization.findUnique.mockResolvedValue({ type: 'hospital' });
      await expect(service.inviteMember('org1', 'user1', 'test@test.com', 'sponsor')).rejects.toThrow(BadRequestException);
    });

    it('should accept a valid role for the org type', async () => {
      prisma.organization.findUnique.mockResolvedValue({ type: 'hospital' });
      prisma.user.findUnique.mockResolvedValue(null);
      const res = await service.inviteMember('org1', 'user1', 'test@test.com', 'clinician');
      expect(res.role).toBe('clinician');
      expect(res.status).toBe('pending');
    });
  });
});
