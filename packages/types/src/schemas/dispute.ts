import { z } from 'zod';

export const disputeSubjectTypeSchema = z.enum(['contribution', 'access_request', 'payout']);
export const disputeStatusSchema = z.enum(['open', 'under_review', 'resolved']);

export const disputeSchema = z.object({
  id: z.string().uuid(),
  subjectType: disputeSubjectTypeSchema,
  subjectId: z.string(),
  status: disputeStatusSchema,
  description: z.string(),
  resolutionNote: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Dispute = z.infer<typeof disputeSchema>;
export type DisputeSubjectType = z.infer<typeof disputeSubjectTypeSchema>;
export type DisputeStatus = z.infer<typeof disputeStatusSchema>;
