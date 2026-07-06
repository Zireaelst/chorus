import { z } from 'zod';

export const PayoutSchema = z.object({
  id: z.string().uuid(),
  contributionId: z.string().uuid(),
  orgId: z.string().uuid(),
  amount: z.union([z.number(), z.string()]), // Decimal can be serialized as string
  currency: z.string(), // PROVISIONAL: pending decision from pending-decisions-ledger
  onChainTxRef: z.string(),
  settledAt: z.union([z.string().datetime(), z.date()]),
});

export type Payout = z.infer<typeof PayoutSchema>;
