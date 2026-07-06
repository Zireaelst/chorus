import { z } from 'zod';

export const complianceFlagSchema = z.object({
  severity: z.enum(['blocking', 'advisory']),
  regulation: z.string(),
  citation: z.string(),
  explanation: z.string(),
});

export type ComplianceFlag = z.infer<typeof complianceFlagSchema>;
