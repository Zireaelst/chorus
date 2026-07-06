import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ApiNotificationsService {
    constructor(private readonly prisma: PrismaService) {}

    async getMyNotifications(userId: string) {
        return this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
    }

    async markAsRead(userId: string, orgId: string, notificationId: string) {
        const notification = await this.prisma.notification.findUnique({
            where: { id: notificationId }
        });

        // Enforce strict scoping to requesting user and org
        if (!notification || notification.userId !== userId || notification.orgId !== orgId) {
            throw new NotFoundException('Notification not found');
        }

        return this.prisma.notification.update({
            where: { id: notificationId },
            data: { readAt: new Date() }
        });
    }
}
