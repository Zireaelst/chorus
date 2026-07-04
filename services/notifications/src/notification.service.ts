import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../api/src/prisma/prisma.service';
import { MockEmailTransport, IEmailTransport } from './email-transport.interface';
import { WebhookDeliveryService } from './webhook-delivery.service';

@Injectable()
export class NotificationService {
    private emailTransport: IEmailTransport;

    constructor(
        private readonly prisma: PrismaService,
        private readonly webhookService: WebhookDeliveryService
    ) {
        this.emailTransport = new MockEmailTransport();
    }

    /**
     * Dispatch notification to all channels (In-app, Email, Webhook)
     */
    async dispatch(orgId: string, userId: string, eventType: string, payload: any) {
        // 1. In-App Notification (Database Write)
        await this.prisma.notification.create({
            data: {
                userId,
                orgId,
                type: eventType,
                payload
            }
        });

        // 2. Email Delivery
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (user) {
            // Note: email content generation would happen here
            await this.emailTransport.sendEmail(
                user.email,
                `New Event: ${eventType}`,
                `You have a new notification regarding ${eventType}.`
            );
        }

        // 3. Webhook Delivery
        await this.webhookService.dispatchWebhooks(orgId, eventType, payload);
    }
}
