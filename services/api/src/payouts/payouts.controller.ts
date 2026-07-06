import { Controller, Get, Param, Query, UseGuards, Req } from '@nestjs/common';
import { PayoutsService } from './payouts.service';
import { RbacGuard } from '../auth/rbac.guard';
import { Roles } from '../auth/roles.decorator';
import type { FastifyRequest } from 'fastify';

@Controller('v1/orgs')
export class PayoutsController {
  constructor(private readonly payoutsService: PayoutsService) {}

  @Get(':orgId/payouts')
  @UseGuards(RbacGuard)
  @Roles('hospital_admin', 'chorus_admin')
  async getPayouts(
    @Param('orgId') orgId: string,
    @Query('cursor') cursor: string,
    @Query('limit') limitStr: string,
    @Req() req: FastifyRequest & { user?: any }
  ) {
    const actorUserId = req.user?.id || 'system';
    const limit = limitStr ? parseInt(limitStr, 10) : 25;
    return this.payoutsService.getPayouts(orgId, actorUserId, cursor, limit);
  }
}
