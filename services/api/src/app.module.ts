// services/api — root NestJS module
// Sprint 0: empty module. Imports added in v0.3 (auth, orgs, cohorts, proofs).

import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module';
import { AuditModule } from './audit/audit.module';
import { OrgsModule } from './orgs/orgs.module';
import { CohortsModule } from './cohorts/cohorts.module';
import { DeveloperModule } from './developer/developer.module';
import { CopilotModule } from './copilot/copilot.module';

@Module({
  imports: [
    AuthModule, 
    AuditModule,
    OrgsModule,
    CohortsModule,
    DeveloperModule,
    CopilotModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
