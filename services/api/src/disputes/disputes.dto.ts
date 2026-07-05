import { z } from 'zod';
import { disputeSubjectTypeSchema, disputeStatusSchema } from '@chorus/types';

export const createDisputeSchema = z.object({
  subjectType: disputeSubjectTypeSchema,
  subjectId: z.string().min(1),
  description: z.string().min(1)
});
export type CreateDisputeDto = z.infer<typeof createDisputeSchema>;

export const updateDisputeSchema = z.object({
  status: disputeStatusSchema.optional(),
  resolutionNote: z.string().optional()
});
export type UpdateDisputeDto = z.infer<typeof updateDisputeSchema>;
