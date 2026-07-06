import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CopilotService } from './copilot.service';
import { CopilotQuotaGuard } from '../common/rate-limit/copilot-quota.guard';
import { RbacGuard } from '../auth/rbac.guard';
import { Roles } from '../auth/roles.decorator';
import { CopilotDraftRequest, ComplianceCheckRequest } from '@chorus/types';

@Controller('v1/copilot')
export class CopilotController {
  constructor(private readonly copilotService: CopilotService) {}

  @Post('cohort-draft')
  @UseGuards(RbacGuard, CopilotQuotaGuard)
  @Roles('hospital_admin', 'compliance_officer', 'sponsor')
  async cohortDraft(@Body() body: CopilotDraftRequest) {
    return this.copilotService.getCohortDraft(body);
  }

  @Post('compliance-check')
  @UseGuards(RbacGuard, CopilotQuotaGuard)
  @Roles('hospital_admin', 'compliance_officer')
  async complianceCheck(@Body() body: ComplianceCheckRequest) {
    return this.copilotService.getComplianceCheck(body);
  }
}
