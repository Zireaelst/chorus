import { WebhookDeliveryService } from '../webhook-delivery.service';
import { PrismaService } from '../../../api/src/prisma/prisma.service';

describe('WebhookDeliveryService', () => {
    it('blocks webhook delivery to private/local IP addresses immediately prior to sending', async () => {
        // Asserting the delivery time SSRF protection structural logic.
        const mockPrisma = {} as PrismaService;
        const service = new WebhookDeliveryService(mockPrisma);
        
        // We can test the internal `checkSSRF` method by calling it through type coercion for unit testing boundaries
        const checkSSRF = (service as any).checkSSRF.bind(service);

        const localUrl = 'http://127.0.0.1:8080/webhook';
        const isSafeLocal = await checkSSRF(localUrl);
        expect(isSafeLocal).toBe(false);

        const internalUrl = 'http://10.1.2.3/receive';
        const isSafeInternal = await checkSSRF(internalUrl);
        expect(isSafeInternal).toBe(false);

        const publicUrl = 'https://api.sponsor.com/webhook';
        const isSafePublic = await checkSSRF(publicUrl);
        expect(isSafePublic).toBe(true);
    });
});
