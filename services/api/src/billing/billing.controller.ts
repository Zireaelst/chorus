import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { BillingService } from './billing.service';
import { RbacGuard } from '../auth/rbac.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('v1/billing')
export class BillingController {
    constructor(private readonly billingService: BillingService) {}

    @Get()
    @UseGuards(RbacGuard)
    @Roles('hospital_admin', 'sponsor')
    async getBillingState(@Req() req: FastifyRequest & { user?: any }) {
        const orgId = req.user?.memberships[0]?.orgId;
        return this.billingService.getBillingState(orgId);
    }
}
