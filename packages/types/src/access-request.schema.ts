import { z } from 'zod';

export const accessRequestStatusSchema = z.enum(['pending', 'approved', 'denied']);

export const accessRequestSchema = z.object({
  id: z.string().uuid(),
  cohortId: z.string().uuid(),
  requestingOrgId: z.string().uuid(),
  status: accessRequestStatusSchema,
  justification: z.string(),
  decidedByUserId: z.string().uuid().nullable(),
  createdAt: z.date(),
  decidedAt: z.date().nullable(),
});

export const createAccessRequestSchema = z.object({
  justification: z.string().min(1, "Justification is required").max(1000),
});

export const decideAccessRequestSchema = z.object({
  decision: z.enum(['approved', 'denied']),
  note: z.string().optional(),
});

export type AccessRequestStatus = z.infer<typeof accessRequestStatusSchema>;
export type AccessRequest = z.infer<typeof accessRequestSchema>;
export type CreateAccessRequest = z.infer<typeof createAccessRequestSchema>;
export type DecideAccessRequest = z.infer<typeof decideAccessRequestSchema>;
