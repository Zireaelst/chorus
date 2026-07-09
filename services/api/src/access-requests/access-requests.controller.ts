import { Controller, Post, Patch, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AccessRequestsService } from './access-requests.service';
import { RbacGuard } from '../auth/rbac.guard';
import { Roles } from '../auth/roles.decorator';
import type { CreateAccessRequest, DecideAccessRequest } from '@chorus/types';

@Controller('v1')
export class AccessRequestsController {
  constructor(private readonly accessRequestsService: AccessRequestsService) {}

  @Post('cohorts/:cohortId/access-requests')
  @UseGuards(RbacGuard)
  @Roles('sponsor')
  async createRequest(
    @Param('cohortId') cohortId: string,
    @Body() payload: CreateAccessRequest,
    @Request() req: any
  ) {
    return this.accessRequestsService.createRequest(
      cohortId,
      req.user.orgId,
      req.user.id,
      payload
    );
  }

  @Patch('access-requests/:requestId')
  @UseGuards(RbacGuard)
  @Roles('hospital_admin', 'compliance_officer')
  async decideRequest(
    @Param('requestId') requestId: string,
    @Body() payload: DecideAccessRequest,
    @Request() req: any
  ) {
    return this.accessRequestsService.decideRequest(
      requestId,
      req.user.orgId,
      req.user.id,
      payload
    );
  }

  // Sponsor endpoint to fetch own requests
  @Get('sponsor/access-requests')
  @UseGuards(RbacGuard)
  @Roles('sponsor')
  async getMyRequests(@Request() req: any) {
    const items = await this.accessRequestsService.listMyRequests(req.user.orgId);
    return { items };
  }

  // Hospital endpoint to fetch incoming requests
  @Get('hospital/access-requests')
  @UseGuards(RbacGuard)
  @Roles('hospital_admin', 'compliance_officer')
  async getIncomingRequests(@Request() req: any) {
    const items = await this.accessRequestsService.listIncomingRequests(req.user.orgId);
    return { items };
  }
}
