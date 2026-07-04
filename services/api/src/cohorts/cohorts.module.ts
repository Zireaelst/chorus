import { Module } from '@nestjs/common';
import { CohortsController } from './cohorts.controller';
import { CohortsService } from './cohorts.service';
import { CohortSearchController } from './cohort-search.controller';
import { CohortSearchService } from './cohort-search.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CohortsController, CohortSearchController],
  providers: [CohortsService, CohortSearchService],
  exports: [CohortsService],
})
export class CohortsModule {}
