import { z } from 'zod';
import { cohortCriteriaSchema } from './cohort-criteria.schema';

// POST /v1/copilot/cohort-draft
export const copilotDraftRequestSchema = z.object({
  description: z.string().max(2000),
  existingCriteria: cohortCriteriaSchema.optional(),
});

export const copilotDraftResponseSchema = z.object({
  suggestedCriteria: cohortCriteriaSchema.optional(),
  ambiguousFields: z.array(z.string()),
  requiresReview: z.literal(true), // Always true, never persists automatically
});

// POST /v1/copilot/compliance-check
export const complianceCheckRequestSchema = z.object({
  criteria: cohortCriteriaSchema,
  jurisdiction: z.string(),
});

export const complianceFlagSchema = z.object({
  severity: z.enum(['blocking', 'advisory']),
  regulation: z.string(),
  citation: z.string(),
  explanation: z.string(),
});

export const complianceCheckResponseSchema = z.object({
  flags: z.array(complianceFlagSchema),
});

export type CopilotDraftRequest = z.infer<typeof copilotDraftRequestSchema>;
export type CopilotDraftResponse = z.infer<typeof copilotDraftResponseSchema>;
export type ComplianceCheckRequest = z.infer<typeof complianceCheckRequestSchema>;
export type ComplianceCheckResponse = z.infer<typeof complianceCheckResponseSchema>;
export type ComplianceFlag = z.infer<typeof complianceFlagSchema>;
