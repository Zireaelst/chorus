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

    // Set HttpOnly, Secure, SameSite=Lax cookie
    res.setCookie('chorus_session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
      domain: process.env.COOKIE_DOMAIN || undefined,
    });

    return { success: true };
  }

  @Get()
  async getSession(@Req() req: FastifyRequest) {
    // fastify-cookie should be configured for this to work
    const token = req.cookies['chorus_session'];
    if (!token) {
      throw new UnauthorizedException('No session cookie');
    }
    const user = await this.authService.verify(token);
    return { user };
  }

  @Post('revoke')
  async revoke(@Req() req: FastifyRequest, @Res({ passthrough: true }) res: FastifyReply) {
    const token = req.cookies['chorus_session'];
    if (token) {
      await this.authService.revoke(token);
    }
    res.clearCookie('chorus_session', {
      path: '/',
      domain: process.env.COOKIE_DOMAIN || undefined,
    });
    return { success: true };
  }
}
