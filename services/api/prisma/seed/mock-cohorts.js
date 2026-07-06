"use strict";
/**
 * NON-PRODUCTION FIXTURE DATASET
 * Explicitly seeded for Sprint 6 search functionality.
 * This is mock data representing cohorts available for access requests.
 * Do not connect the search endpoint to the real Prisma `cohorts` table.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockCohorts = void 0;
exports.mockCohorts = [
    {
        id: "e4d21b7e-6f81-4b72-8f19-35a1239c0a1a",
        orgId: "a2b41b7e-6f81-4b72-8f19-35a1239c0b1b", // Example hospital org ID
        title: "Type 2 Diabetes in Adults over 50",
        criteria: {
            schemaVersion: "1.0",
            clinical: [{ field: "ICD10", operator: "eq", value: "E11" }],
            demographic: [{ field: "age", operator: "gte", value: 50 }],
            logicalOperator: "AND"
        },
        exactMatchCount: 45 // Above floor
    },
    {
        id: "c8e21b7e-6f81-4b72-8f19-35a1239c0c1c",
        orgId: "a2b41b7e-6f81-4b72-8f19-35a1239c0b1b",
        title: "Rare Disease Alpha",
        criteria: {
            schemaVersion: "1.0",
            clinical: [{ field: "ICD10", operator: "eq", value: "Q99.9" }],
            demographic: [],
            logicalOperator: "AND"
        },
        exactMatchCount: 5 // Below floor, should be suppressed
    },
    {
        id: "b2d21b7e-6f81-4b72-8f19-35a1239c0d1d",
        orgId: "f4b41b7e-6f81-4b72-8f19-35a1239c0e1e",
        title: "Hypertension with specific drug exposure",
        criteria: {
            schemaVersion: "1.0",
            clinical: [{ field: "ICD10", operator: "eq", value: "I10" }],
            demographic: [],
            logicalOperator: "AND"
        },
        exactMatchCount: 15 // Above floor
    }
];
