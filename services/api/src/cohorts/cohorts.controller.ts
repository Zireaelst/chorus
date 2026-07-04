import { Controller, Get, Patch, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { CohortsService } from './cohorts.service';
import { RbacGuard } from '../auth/rbac.guard';
import { Roles } from '../auth/roles.decorator';
import { FastifyRequest } from 'fastify';
import { MembershipRole } from '@chorus/types';

@Controller('v1/cohorts')
export class CohortsController {
  constructor(private readonly cohortsService: CohortsService) {}

  @Post()
  @UseGuards(RbacGuard)
  @Roles('hospital_admin', 'compliance_officer', 'sponsor')
  async createCohort(
    @Body() body: { title: string; criteria: any },
    @Req() req: FastifyRequest & { user?: any }
  ) {
    const actorUserId = req.user?.id || 'system';
    // Assume user is operating within their first org context for MVP
    const orgId = req.user?.memberships[0]?.orgId; 
    return this.cohortsService.createCohort(orgId, actorUserId, body);
  }

  @Get(':id')
  @UseGuards(RbacGuard)
  // According to API_SPEC.md, any member of owning org, or a sponsor.
  @Roles('hospital_admin', 'clinician', 'compliance_officer', 'sponsor', 'chorus_admin')
  async getCohort(
    @Param('id') id: string,
    @Req() req: FastifyRequest & { user?: any }
  ) {
    const orgId = req.user?.memberships[0]?.orgId; 
    const role = req.user?.memberships[0]?.role;
    return this.cohortsService.getCohort(id, orgId, role);
  }

  @Patch(':id')
  @UseGuards(RbacGuard)
  @Roles('hospital_admin', 'compliance_officer', 'sponsor') // Creators can edit drafts
  async updateCohort(
    @Param('id') id: string,
    @Body() body: { title?: string; criteria?: any },
    @Req() req: FastifyRequest & { user?: any }
  ) {
    const orgId = req.user?.memberships[0]?.orgId; 
    return this.cohortsService.updateCohort(id, orgId, body);
  }
}
