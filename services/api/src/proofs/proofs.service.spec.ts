import { Test, TestingModule } from '@nestjs/testing';
import { ProofsService } from './proofs.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as proofsQueue from './proofs.queue';

jest.mock('./proofs.queue', () => ({
  enqueueProofForVerification: jest.fn()
}));

describe('ProofsService', () => {
  let service: ProofsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      cohort: { findUnique: jest.fn() },
      contribution: {
        findUnique: jest.fn(),
        create: jest.fn()
      }
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProofsService,
        { provide: PrismaService, useValue: prisma }
      ],
    }).compile();

    service = module.get<ProofsService>(ProofsService);
    jest.clearAllMocks();
  });

  describe('submitProof', () => {
    const validPayload = {
      cohortId: 'c1',
      orgId: 'o1',
      roundNumber: 1,
      proof: { proofPayload: '0x123' }
    };

    it('rejects if cohort is not active', async () => {
      prisma.cohort.findUnique.mockResolvedValueOnce({ status: 'draft' });

      await expect(service.submitProof(validPayload)).rejects.toThrow(ConflictException);
    });

    it('rejects duplicate contribution (application layer)', async () => {
      prisma.cohort.findUnique.mockResolvedValueOnce({ status: 'active' });
      prisma.contribution.findUnique.mockResolvedValueOnce({ id: 'existing' });

      await expect(service.submitProof(validPayload)).rejects.toThrow(ConflictException);
    });

    it('rejects duplicate contribution (database layer race condition)', async () => {
      prisma.cohort.findUnique.mockResolvedValueOnce({ status: 'active' });
      prisma.contribution.findUnique.mockResolvedValueOnce(null);
      prisma.contribution.create.mockRejectedValueOnce({ code: 'P2002' });

      await expect(service.submitProof(validPayload)).rejects.toThrow(ConflictException);
    });

    it('creates contribution and enqueues job', async () => {
      prisma.cohort.findUnique.mockResolvedValueOnce({ status: 'active' });
      prisma.contribution.findUnique.mockResolvedValueOnce(null);
      prisma.contribution.create.mockResolvedValueOnce({ id: 'contrib-1' });

      const result = await service.submitProof(validPayload);
      
      expect(result).toEqual({ proofId: 'contrib-1', status: 'queued' });
      expect(proofsQueue.enqueueProofForVerification).toHaveBeenCalledWith('contrib-1', validPayload);
    });
  });
});
