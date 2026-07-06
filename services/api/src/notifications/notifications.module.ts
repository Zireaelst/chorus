import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { ApiNotificationsService } from './notifications.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NotificationsController],
  providers: [ApiNotificationsService],
})
export class NotificationsModule {}
