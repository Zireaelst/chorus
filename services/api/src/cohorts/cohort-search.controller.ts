import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CohortSearchService } from './cohort-search.service';
import { RbacGuard } from '../auth/rbac.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('v1/cohorts')
export class CohortSearchController {
  constructor(private readonly searchService: CohortSearchService) {}

  @Get('search')
  @UseGuards(RbacGuard)
  @Roles('sponsor')
  async searchCohorts(@Query() query: any) {
    const items = await this.searchService.search(query);
    return { items };
  }
}
