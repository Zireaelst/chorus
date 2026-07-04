import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ModelPassportService } from './model-passport.service';
import { RbacGuard } from '../auth/rbac.guard';
import { Roles } from '../auth/roles.decorator';
import { PrismaService } from '../prisma/prisma.service';

@Controller('v1/marketplace/checkpoints')
export class ModelCheckpointsController {
    constructor(
        private readonly passportService: ModelPassportService,
        private readonly prisma: PrismaService
    ) {}

    @Get()
    @UseGuards(RbacGuard)
    @Roles('chorus_admin')
    async listCheckpoints() {
        return this.prisma.modelCheckpoint.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }

    @Post()
    @UseGuards(RbacGuard)
    @Roles('chorus_admin')
    async registerCheckpoint(
        @Body() body: { cohortId: string; startRound: number; endRound: number; checkpointHash: string }
    ) {
        return this.prisma.modelCheckpoint.create({
            data: {
                cohortId: body.cohortId,
                startRound: body.startRound,
                endRound: body.endRound,
                checkpointHash: body.checkpointHash
            }
        });
    }

    @Get(':id/passport')
    @UseGuards(RbacGuard)
    @Roles('chorus_admin')
    async getPassport(@Param('id') id: string) {
        return this.passportService.derivePassport(id);
    }
}
