import { Controller, Get, Patch, Param, Req, UseGuards } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { ApiNotificationsService } from './notifications.service';
import { RbacGuard } from '../auth/rbac.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('v1/notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: ApiNotificationsService) {}

    @Get()
    @UseGuards(RbacGuard)
    @Roles('hospital_admin', 'sponsor', 'chorus_admin')
    async getNotifications(@Req() req: FastifyRequest & { user?: any }) {
        const userId = req.user?.id;
        return this.notificationsService.getMyNotifications(userId);
    }

    @Patch(':id/read')
    @UseGuards(RbacGuard)
    @Roles('hospital_admin', 'sponsor', 'chorus_admin')
    async markAsRead(
        @Req() req: FastifyRequest & { user?: any },
        @Param('id') notificationId: string
    ) {
        const userId = req.user?.id;
        const orgId = req.user?.memberships?.[0]?.orgId;
        return this.notificationsService.markAsRead(userId, orgId, notificationId);
    }
}
