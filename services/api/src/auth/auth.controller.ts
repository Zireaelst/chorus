import { Controller, Post, Get, Body, Req, Res, UnauthorizedException } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from './auth.service';

@Controller('v1/auth/session')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('exchange')
  async exchange(
    @Body() body: { code: string; clientId: string },
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply
  ) {
    if (!body.code || !body.clientId) {
      throw new UnauthorizedException('Missing code or clientId');
    }

    const { sessionCookie, expiresAt } = await this.authService.exchangeCode(
      body.code,
      body.clientId,
      req.ip
    );

    const cookieOptions: any = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    };
    if (process.env.COOKIE_DOMAIN) cookieOptions.domain = process.env.COOKIE_DOMAIN;
    (res as any).setCookie('chorus_session', sessionCookie, cookieOptions);

    return { success: true };
  }

  @Get()
  async getSession(@Req() req: FastifyRequest) {
    // fastify-cookie should be configured for this to work
    const token = (req as any).cookies['chorus_session'];
    if (!token) {
      throw new UnauthorizedException('No session cookie');
    }
    const user = await this.authService.verify(token);
    return { user };
  }

  @Post('revoke')
  async revoke(@Req() req: FastifyRequest, @Res({ passthrough: true }) res: FastifyReply) {
    const token = (req as any).cookies['chorus_session'];
    if (token) {
      await this.authService.revoke(token);
    }
    const clearOptions: any = { path: '/' };
    if (process.env.COOKIE_DOMAIN) clearOptions.domain = process.env.COOKIE_DOMAIN;
    (res as any).clearCookie('chorus_session', clearOptions);
    return { success: true };
  }
}
