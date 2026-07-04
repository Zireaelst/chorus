import { ApiNotificationsService } from '../notifications.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ApiNotificationsService', () => {
    it('blocks a user from marking another user\'s notification as read', async () => {
        // Asserting the scoping structural logic
        
        // Mock prisma return where the notification belongs to user_B
        const mockPrisma = {
            notification: {
                findUnique: jest.fn().mockResolvedValue({
                    id: 'notif_1',
                    userId: 'user_B'
                })
            }
        } as unknown as PrismaService;

        const service = new ApiNotificationsService(mockPrisma);

        // user_A attempts to mark user_B's notification as read
        await expect(service.markAsRead('user_A', 'notif_1')).rejects.toThrow(NotFoundException);
    });
});
