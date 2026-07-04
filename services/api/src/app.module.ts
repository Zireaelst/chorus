// services/api — root NestJS module
// Sprint 0: empty module. Imports added in v0.3 (auth, orgs, cohorts, proofs).

import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [AuthModule, AuditModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
