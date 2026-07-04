import { Controller, Post, Delete, Body, Param, UseGuards, Req, HttpCode } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { RbacGuard } from '../auth/rbac.guard';
import { Roles } from '../auth/roles.decorator';
import { FastifyRequest } from 'fastify';

@Controller('v1/orgs/:orgId/api-keys')
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Post()
  @UseGuards(RbacGuard)
  @Roles('hospital_admin')
  async createApiKey(
    @Param('orgId') orgId: string,
    @Body() body: { name: string },
    @Req() req: FastifyRequest & { user?: any }
  ) {
    const actorUserId = req.user?.id || 'system';
    return this.apiKeysService.createApiKey(orgId, actorUserId, body.name);
  }

  @Delete(':keyId')
  @UseGuards(RbacGuard)
  @Roles('hospital_admin')
  @HttpCode(204)
  async revokeApiKey(
    @Param('orgId') orgId: string,
    @Param('keyId') keyId: string,
    @Req() req: FastifyRequest & { user?: any }
  ) {
    const actorUserId = req.user?.id || 'system';
    await this.apiKeysService.revokeApiKey(orgId, actorUserId, keyId);
  }
}
