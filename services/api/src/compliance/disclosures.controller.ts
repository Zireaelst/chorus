import { Controller, Get, Query, Req, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { DisclosuresService, DisclosureQueryDto } from './disclosures.service';
import { AuthService } from '../auth/auth.service';

@Controller('v1/compliance/disclosures')
export class DisclosuresController {
  constructor(
    private readonly disclosuresService: DisclosuresService,
    private readonly authService: AuthService
  ) {}

  @Get()
  async getDisclosures(
    @Query() query: DisclosureQueryDto,
    @Req() req: FastifyRequest
  ) {
    const token = (req as any).cookies['chorus_session'];
    if (!token) {
      throw new UnauthorizedException('No session cookie');
    }

    const user = await this.authService.verify(token);
    
    // Authorization: 'regulator' only
    const regulatorMembership = user.memberships.find(m => m.role === 'regulator');
    if (!regulatorMembership) {
      throw new ForbiddenException('Only regulators can access disclosures');
    }

    return this.disclosuresService.queryDisclosures(regulatorMembership.orgId, query);
  }
}
