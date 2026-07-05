import { Controller, Post, Patch, Get, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { DisputesService } from './disputes.service';
import { RbacGuard } from '../auth/rbac.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateDisputeDto, UpdateDisputeDto } from './disputes.dto';

@Controller('v1/disputes')
@UseGuards(RbacGuard)
export class DisputesController {
  constructor(private readonly disputesService: DisputesService) {}

  @Post()
  @Roles('chorus_admin')
  async createDispute(@Body() payload: CreateDisputeDto, @Request() req: any) {
    const user = { userId: req.user.id, orgId: req.user.orgId, role: req.user.role };
    return this.disputesService.create(user as any, payload);
  }

  @Get()
  @Roles('chorus_admin')
  async listDisputes(@Query('status') status?: string) {
    const items = await this.disputesService.list(status);
    return { items };
  }

  @Patch(':id')
  @Roles('chorus_admin')
  async updateDispute(
    @Param('id') id: string,
    @Body() payload: UpdateDisputeDto,
    @Request() req: any
  ) {
    const user = { userId: req.user.id, orgId: req.user.orgId, role: req.user.role };
    return this.disputesService.update(id, user as any, payload);
  }
}
