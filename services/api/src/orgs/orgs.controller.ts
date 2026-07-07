import { Controller, Get, Patch, Post, Body, Param, UseGuards, Req, Query } from '@nestjs/common';
import { OrgsService } from './orgs.service';
import { RbacGuard } from '../auth/rbac.guard';
import { Roles } from '../auth/roles.decorator';
import { FastifyRequest } from 'fastify';

@Controller('v1/orgs')
export class OrgsController {
  constructor(private readonly orgsService: OrgsService) {}

  @Get(':orgId')
  @UseGuards(RbacGuard)
  // Any role valid in the organization can get the org profile
  @Roles('hospital_admin', 'clinician', 'compliance_officer', 'sponsor', 'regulator', 'chorus_admin')
  async getOrg(@Param('orgId') orgId: string) {
    return this.orgsService.getOrg(orgId);
  }

  @Patch(':orgId')
  @UseGuards(RbacGuard)
  @Roles('hospital_admin', 'chorus_admin')
  async updateOrg(
    @Param('orgId') orgId: string,
    @Body() body: { name?: string; contactEmail?: string },
    @Req() req: FastifyRequest & { user?: any }
  ) {
    const actorUserId = req.user?.id || 'system';
    return this.orgsService.updateOrg(orgId, actorUserId, body);
  }

  @Post(':orgId/members/invite')
  @UseGuards(RbacGuard)
  @Roles('hospital_admin', 'chorus_admin')
  async inviteMember(
    @Param('orgId') orgId: string,
    @Body() body: { email: string; role: string },
    @Req() req: FastifyRequest & { user?: any }
  ) {
    const actorUserId = req.user?.id || 'system';
    return this.orgsService.inviteMember(orgId, actorUserId, body.email, body.role);
  }

  @Get(':orgId/contributions')
  @UseGuards(RbacGuard)
  @Roles('hospital_admin', 'clinician', 'compliance_officer', 'sponsor', 'regulator', 'chorus_admin')
  async getContributions(
    @Param('orgId') orgId: string,
    @Query('cursor') cursor: string,
    @Query('limit') limitStr: string,
    @Req() req: FastifyRequest & { user?: any }
  ) {
    const limit = limitStr ? parseInt(limitStr, 10) : 25;
    return this.orgsService.getContributions(orgId, cursor, limit);
  }
}

