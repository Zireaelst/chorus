import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../api/src/prisma/prisma.service';
import { WebhookDeliveryService } from './webhook-delivery.service';

@Injectable()
export class WebhookRetryWorker {
    private readonly MAX_ATTEMPTS = 5;

    constructor(
        private readonly prisma: PrismaService,
        private readonly webhookService: WebhookDeliveryService
    ) {}

    /**
     * Efficiently reads failed deliveries using the `status = 'failed'` partial index.
     * Simulated as a worker polling mechanism.
     */
    async processFailedDeliveries() {
        const failedDeliveries = await this.prisma.webhookDelivery.findMany({
            where: { status: 'failed', attemptCount: { lt: this.MAX_ATTEMPTS } },
            take: 50,
            orderBy: { attemptedAt: 'asc' },
            include: { webhook: true } // Need the webhook url
        });

        for (const delivery of failedDeliveries) {
            console.log(`[WebhookRetryWorker] Retrying delivery ${delivery.id} (Attempt ${delivery.attemptCount + 1})`);
            
            // In a real system, we'd wait for a backoff period before retrying based on attemptedAt
            
            // Note: In MVP, checkSSRF is private on the webhookService.
            // Ideally we'd invoke a public re-dispatch method.
            // We simulate the retry logic directly here for MVP boundaries.
            
            let isSafe = false;
            try {
                const parsed = new URL(delivery.webhook.url);
                const hostname = parsed.hostname;
                if (!(hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('10.') || hostname.startsWith('192.168.'))) {
                    isSafe = true;
                }
            } catch (e) {
                isSafe = false;
            }

            if (!isSafe) {
                console.warn(`[WebhookRetryWorker] SSRF blocked retry to ${delivery.webhook.url}`);
                await this.prisma.webhookDelivery.update({
                    where: { id: delivery.id },
                    data: { 
                        attemptCount: delivery.attemptCount + 1,
                        attemptedAt: new Date()
                    }
                });
                continue;
            }

            const success = true; // Simulating HTTP request success

            await this.prisma.webhookDelivery.update({
                where: { id: delivery.id },
                data: {
                    status: success ? 'delivered' : 'failed',
                    attemptCount: delivery.attemptCount + 1,
                    attemptedAt: new Date()
                }
            });
        }
    }
}
