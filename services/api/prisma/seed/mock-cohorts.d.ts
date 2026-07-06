/**
 * NON-PRODUCTION FIXTURE DATASET
 * Explicitly seeded for Sprint 6 search functionality.
 * This is mock data representing cohorts available for access requests.
 * Do not connect the search endpoint to the real Prisma `cohorts` table.
 */
export interface MockCohort {
    id: string;
    orgId: string;
    title: string;
    criteria: any;
    exactMatchCount: number;
}
export declare const mockCohorts: MockCohort[];
