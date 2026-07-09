import { Controller, Post, Get, Body, Param, UseGuards, UseInterceptors, Req, UnauthorizedException } from '@nestjs/common';
import { ProofsService } from './proofs.service';
import { RbacGuard } from '../auth/rbac.guard';
import { Roles } from '../auth/roles.decorator';
import { FastifyRequest } from 'fastify';
import { RequiresIdempotencyKey } from '../common/idempotency/requires-idempotency-key.decorator';
import { IdempotencyInterceptor } from '../common/idempotency/idempotency.interceptor';
import type { SubmitProofRequest } from '@chorus/types';

@Controller('v1/proofs')
export class ProofsController {
  constructor(private readonly proofsService: ProofsService) {}

  @Post()
  @UseGuards(RbacGuard)
  @Roles('hospital_admin')
  @RequiresIdempotencyKey()
  @UseInterceptors(IdempotencyInterceptor)
  async submitProof(
    @Body() body: SubmitProofRequest,
    @Req() req: FastifyRequest & { user?: any }
  ) {
    // API_SPEC.md requires API-key auth only for this endpoint
    const isApiKey = !!req.headers['authorization']?.startsWith('Bearer');
    if (!isApiKey) {
      throw new UnauthorizedException('API-key authentication required for proof submission');
    }

    return this.proofsService.submitProof(body);
  }

  @Get(':proofId')
  @UseGuards(RbacGuard)
  @Roles('hospital_admin', 'chorus_admin')
  async getProof(
    @Param('proofId') proofId: string,
    @Req() req: FastifyRequest & { user?: any }
  ) {
    const isApiKey = !!req.headers['authorization']?.startsWith('Bearer');
    if (!isApiKey && !req.user?.memberships?.some((m: any) => m.role === 'chorus_admin')) {
      throw new UnauthorizedException('API-key authentication required for proof polling');
    }

    const orgId = req.user?.orgId || 'unknown-org';
    return this.proofsService.getProofStatus(proofId, orgId);
  }
}
