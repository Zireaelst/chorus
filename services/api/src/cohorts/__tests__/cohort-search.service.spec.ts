import { Test, TestingModule } from '@nestjs/testing';
import { CohortSearchService } from '../cohort-search.service';
import { mockCohorts } from '../../../prisma/seed/mock-cohorts';
import { K_ANONYMITY_FLOOR } from '../../config/anonymity';

describe('CohortSearchService', () => {
  let service: CohortSearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CohortSearchService],
    }).compile();

    service = module.get<CohortSearchService>(CohortSearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should enforce k-anonymity floor and return bucketed estimates', async () => {
    const results = await service.search({});
    
    // The rare disease cohort has exactMatchCount = 5, which is < 10 (floor)
    // The other two have 15 and 45.
    // So we should only see 2 results out of 3 mock cohorts.
    expect(results.length).toBe(mockCohorts.filter(c => c.exactMatchCount >= K_ANONYMITY_FLOOR).length);
    
    // Verify bucketing, never exact counts
    const counts = results.map(r => r.sizeEstimate);
    counts.forEach(count => {
      expect(count).toMatch(/\d+–\d+|\d+\+/); // Must match range or + format
      expect(typeof count).toBe('string');
    });
  });
});
