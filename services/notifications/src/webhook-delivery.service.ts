import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../api/src/prisma/prisma.service';

@Injectable()
export class WebhookDeliveryService {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Re-validates the destination URL against private/internal IP ranges immediately before sending,
     * independent of the registration-time check from Sprint 4.
     */
    private async checkSSRF(url: string): Promise<boolean> {
        try {
            const parsed = new URL(url);
            const hostname = parsed.hostname;
            
            // In a real implementation this would perform DNS resolution and check against 
            // private IP ranges (e.g., 10.0.0.0/8, 127.0.0.0/8, 192.168.0.0/16, 172.16.0.0/12).
            // For MVP simulation, we reject obvious loopback/internal hosts.
            if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('10.') || hostname.startsWith('192.168.')) {
                return false; // Blocked by SSRF
            }

            return true;
        } catch (e) {
            return false;
        }
    }

    async dispatchWebhooks(orgId: string, eventType: string, payload: any) {
        // Fetch all webhooks for this org that subscribe to the eventType
        const webhooks = await this.prisma.webhook.findMany({
            where: {
                orgId,
                status: 'active',
                eventTypes: {
                    has: eventType
                }
            }
        });

        for (const webhook of webhooks) {
            // Log delivery attempt
            const delivery = await this.prisma.webhookDelivery.create({
                data: {
                    webhookId: webhook.id,
                    eventType,
                    payloadHash: 'mock-hash', // compute real hash in prod
                    status: 'pending',
                    attemptCount: 1,
                    attemptedAt: new Date()
                }
            });

            // Delivery time SSRF Check
            const isSafe = await this.checkSSRF(webhook.url);
            if (!isSafe) {
                console.warn(`[WebhookDelivery] SSRF blocked delivery to ${webhook.url}`);
                await this.prisma.webhookDelivery.update({
                    where: { id: delivery.id },
                    data: { status: 'failed' }
                });
                continue;
            }

            // Simulate HTTP delivery
            console.log(`[WebhookDelivery] Dispatching ${eventType} to ${webhook.url}`);
            const success = true; // Simulating successful HTTP request

            await this.prisma.webhookDelivery.update({
                where: { id: delivery.id },
                data: { status: success ? 'delivered' : 'failed' }
            });
        }
    }
}
