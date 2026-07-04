import { Controller, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { RbacGuard } from '../auth/rbac.guard';
import { Roles } from '../auth/roles.decorator';
import { FastifyRequest } from 'fastify';

@Controller('v1/orgs/:orgId/webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post()
  @UseGuards(RbacGuard)
  @Roles('hospital_admin')
  async createWebhook(
    @Param('orgId') orgId: string,
    @Body() body: { url: string; eventTypes: string[] },
    @Req() req: FastifyRequest & { user?: any }
  ) {
    const actorUserId = req.user?.id || 'system';
    return this.webhooksService.createWebhook(orgId, actorUserId, body.url, body.eventTypes);
  }
}
