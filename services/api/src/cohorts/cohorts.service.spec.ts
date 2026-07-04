import { Test, TestingModule } from '@nestjs/testing';
import { CohortsService } from './cohorts.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('CohortsService', () => {
  let service: CohortsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      cohort: { create: jest.fn() },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CohortsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<CohortsService>(CohortsService);
  });

  describe('createCohort', () => {
    it('should reject if criteria fails validation', async () => {
      // Invalid criteria (missing demographic, or empty)
      await expect(
        service.createCohort('org1', 'user1', { title: 'Test Cohort', criteria: {} })
      ).rejects.toThrow(BadRequestException);
    });

    it('should create draft cohort if valid', async () => {
      const validCriteria = {
        schemaVersion: '1.0',
        clinical: [{ field: 'ICD10', operator: 'eq', value: 'A00' }],
        demographic: [{ field: 'age', operator: 'gte', value: 18 }],
        logicalOperator: 'AND'
      };
      
      prisma.cohort.create.mockResolvedValue({ id: 'cohort1' });
      const res = await service.createCohort('org1', 'user1', { title: 'Valid Cohort', criteria: validCriteria });
      
      expect(res.id).toBe('cohort1');
      expect(prisma.cohort.create).toHaveBeenCalled();
    });
  });
});
