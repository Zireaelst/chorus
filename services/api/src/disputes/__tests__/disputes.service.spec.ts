import { Test, TestingModule } from '@nestjs/testing';
import { DisputesService } from '../disputes.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { NotFoundException } from '@nestjs/common';

describe('DisputesService', () => {
  let service: DisputesService;
  let prisma: any;
  let audit: any;

  beforeEach(async () => {
    prisma = {
      cohortAccessRequest: { findUnique: jest.fn() },
      dispute: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn()
      }
    };
    audit = { logEvent: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DisputesService,
        { provide: PrismaService, useValue: prisma },
        { provide: AuditService, useValue: audit }
      ],
    }).compile();

    service = module.get<DisputesService>(DisputesService);
  });

  describe('create', () => {
    const user = { userId: 'u1', orgId: 'o1', role: 'chorus_admin' };

    it('validates subjectId against database for access_request', async () => {
      prisma.cohortAccessRequest.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(user, {
        subjectType: 'access_request',
        subjectId: 'invalid-id',
        description: 'Test dispute'
      })).rejects.toThrow(NotFoundException);
      expect(prisma.cohortAccessRequest.findUnique).toHaveBeenCalledWith({
        where: { id: 'invalid-id' }
      });
      expect(prisma.dispute.create).not.toHaveBeenCalled();
    });

    it('creates dispute and logs audit on valid reference', async () => {
      prisma.cohortAccessRequest.findUnique.mockResolvedValueOnce({ id: 'valid-id' });
      prisma.dispute.create.mockResolvedValueOnce({ id: 'd1', status: 'open' });

      await service.create(user, {
        subjectType: 'access_request',
        subjectId: 'valid-id',
        description: 'Test dispute'
      });

      expect(prisma.dispute.create).toHaveBeenCalled();
      expect(audit.logEvent).toHaveBeenCalledWith(expect.objectContaining({
        eventType: 'dispute.created',
        metadata: { disputeId: 'd1', subjectType: 'access_request', subjectId: 'valid-id' }
      }));
    });
  });

  describe('update', () => {
    const user = { userId: 'u1', orgId: 'o1', role: 'chorus_admin' };

    it('produces no side-effects on the referenced subject and logs transition', async () => {
      prisma.dispute.findUnique.mockResolvedValueOnce({ id: 'd1', status: 'open', subjectType: 'access_request', subjectId: 'subj1' });
      prisma.dispute.update.mockResolvedValueOnce({ id: 'd1', status: 'resolved' });

      await service.update('d1', user, { status: 'resolved', resolutionNote: 'Done' });

      // The mutation affects only the dispute table
      expect(prisma.dispute.update).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: 'd1' },
        data: { status: 'resolved', resolutionNote: 'Done' }
      }));
      // Assert no access request mutation was made
      expect(prisma.cohortAccessRequest.findUnique).not.toHaveBeenCalled();

      expect(audit.logEvent).toHaveBeenCalledWith(expect.objectContaining({
        eventType: 'dispute.status_updated',
        metadata: { disputeId: 'd1', oldStatus: 'open', newStatus: 'resolved', resolutionNote: 'Done' }
      }));
    });
  });
});
