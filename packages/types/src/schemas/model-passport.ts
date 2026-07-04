import { z } from 'zod';

export const ModelCheckpointSchema = z.object({
  id: z.string().uuid(),
  cohortId: z.string().uuid(),
  startRound: z.number().int().nonnegative(),
  endRound: z.number().int().nonnegative(),
  checkpointHash: z.string(),
  createdAt: z.date(),
});

export type ModelCheckpoint = z.infer<typeof ModelCheckpointSchema>;

export const ModelPassportSchema = z.object({
  checkpointId: z.string().uuid(),
  checkpointHash: z.string(),
  cohortId: z.string().uuid(),
  provenance: z.array(z.object({
    orgId: z.string().uuid(),
    verifiedContributions: z.number().int().nonnegative(),
  })),
  derivedAt: z.date(),
  schemaVersion: z.literal('1.0'),
});

export type ModelPassport = z.infer<typeof ModelPassportSchema>;

export const ModelLicenseSchema = z.object({
  id: z.string().uuid(),
  checkpointId: z.string().uuid(),
  licenseeName: z.string(),
  termsText: z.string(),
  createdAt: z.date(),
});

export type ModelLicense = z.infer<typeof ModelLicenseSchema>;
