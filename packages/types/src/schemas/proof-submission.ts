import { z } from 'zod';

export const proofPayloadSchema = z.object({
  proofPayload: z.string().regex(/^0x[0-9a-fA-F]+$/), // Valid hex string
  // Optional metadata if needed, but core requirement is proofPayload
});

export const submitProofRequestSchema = z.object({
  cohortId: z.string().uuid(),
  orgId: z.string().uuid(),
  roundNumber: z.number().int().positive(),
  proof: proofPayloadSchema,
});
export type SubmitProofRequest = z.infer<typeof submitProofRequestSchema>;

export const submitProofResponseSchema = z.object({
  proofId: z.string().uuid(),
  status: z.enum(['queued', 'verified', 'rejected']),
});
export type SubmitProofResponse = z.infer<typeof submitProofResponseSchema>;
