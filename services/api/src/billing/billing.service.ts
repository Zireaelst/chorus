import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Interface representing a future Payment Processor (e.g. Stripe, Paddle).
 * This remains unimplemented as no provider has been selected yet.
 */
interface IPaymentProcessor {
    chargeTransactionFee(orgId: string, amountCents: number): Promise<boolean>;
    setupSubscription(orgId: string, planTier: string): Promise<boolean>;
}

@Injectable()
export class BillingService {
    constructor(private readonly prisma: PrismaService) {}

    // Mock payment processor injected seamlessly
    private paymentProcessor: IPaymentProcessor = {
        chargeTransactionFee: async () => true, // Mock success
        setupSubscription: async () => true,
    };

    /**
     * Compute and record a transactional fee (e.g. for a sponsor accessing a cohort)
     */
    async recordTransactionFee(orgId: string, transactionType: string): Promise<void> {
        // v1.0 hardcoded fee: $50 per transaction
        const feeAmountCents = 5000;

        const ledgerEntry = await this.prisma.feeLedgerEntry.create({
            data: {
                orgId,
                amount: feeAmountCents,
                currency: 'USD',
                type: transactionType,
                status: 'pending'
            }
        });

        const success = await this.paymentProcessor.chargeTransactionFee(orgId, feeAmountCents);

        await this.prisma.feeLedgerEntry.update({
            where: { id: ledgerEntry.id },
            data: { status: success ? 'settled' : 'failed' }
        });
    }

    /**
     * Get billing state for an organization
     */
    async getBillingState(orgId: string) {
        const subscription = await this.prisma.billingSubscription.findUnique({
            where: { orgId }
        });

        const ledgerEntries = await this.prisma.feeLedgerEntry.findMany({
            where: { orgId },
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        return {
            subscription: subscription || { planTier: 'free', status: 'active' },
            recentTransactions: ledgerEntries
        };
    }
}
