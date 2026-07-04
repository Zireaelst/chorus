import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { LicensesService } from './licenses.service';
import { RbacGuard } from '../auth/rbac.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('v1/marketplace/licenses')
export class LicensesController {
    constructor(private readonly licensesService: LicensesService) {}

    @Get('checkpoint/:checkpointId')
    @UseGuards(RbacGuard)
    @Roles('chorus_admin')
    async listLicenses(@Param('checkpointId') checkpointId: string) {
        return this.licensesService.getLicenses(checkpointId);
    }

    @Post()
    @UseGuards(RbacGuard)
    @Roles('chorus_admin')
    async createLicense(
        @Body() body: { checkpointId: string; licenseeName: string; termsText: string }
    ) {
        return this.licensesService.createLicense(body.checkpointId, body.licenseeName, body.termsText);
    }
}
