import { Module } from '@nestjs/common';
import { DisclosuresController } from './disclosures.controller';
import { DisclosuresService } from './disclosures.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [DisclosuresController],
  providers: [DisclosuresService],
})
export class ComplianceModule {}
