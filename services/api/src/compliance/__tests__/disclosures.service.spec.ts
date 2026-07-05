import { Test, TestingModule } from '@nestjs/testing';
import { DisclosuresService } from '../disclosures.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('DisclosuresService', () => {
  let service: DisclosuresService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DisclosuresService,
        {
          provide: PrismaService,
          useValue: {
            disclosureQuery: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<DisclosuresService>(DisclosuresService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('logs zero-result queries explicitly', async () => {
    const regulatorOrgId = 'reg-org-1';
    
    // In our mock, cohortId='UNKNOWN' returns zero results
    const result = await service.queryDisclosures(regulatorOrgId, { cohortId: 'UNKNOWN' });

    expect(result.items).toHaveLength(0);
    
    expect(prisma.disclosureQuery.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          regulatorOrgId,
          resultSummary: expect.objectContaining({
            resultCount: 0
          })
        })
      })
    );
  });
});
