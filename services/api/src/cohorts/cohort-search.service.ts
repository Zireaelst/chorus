import { Injectable } from '@nestjs/common';
const mockCohorts = []; type MockCohort = any;
import { K_ANONYMITY_FLOOR } from '../config/anonymity';

export interface SearchResult {
  cohortId: string;
  title: string;
  orgId: string;
  sizeEstimate: string; // Bucketed
}

@Injectable()
export class CohortSearchService {
  
  async search(query: any): Promise<SearchResult[]> {
    // In a real implementation (v0.9), this would match `query` against criteria.
    // For Sprint 6, we return the mock dataset, filtered by K_ANONYMITY_FLOOR.
    
    const results: SearchResult[] = [];
    
    for (const cohort of mockCohorts) {
      if (cohort.exactMatchCount >= K_ANONYMITY_FLOOR) {
        results.push({
          cohortId: cohort.id,
          title: cohort.title,
          orgId: cohort.orgId,
          sizeEstimate: this.bucketSize(cohort.exactMatchCount)
        });
      }
      // If below floor, silently drop it.
    }
    
    return results;
  }

  private bucketSize(count: number): string {
    // Simple mock bucketing logic
    if (count < 20) return "10–20";
    if (count < 50) return "20–50";
    if (count < 100) return "50–100";
    return "100+";
  }
}
