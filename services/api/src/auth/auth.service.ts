import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { exchangeCodeForSession, verifySession } from '@chorus/auth-client';
import { MembershipRole } from '@chorus/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async exchangeCode(code: string, clientId: string, ip: string) {
    const { user, session } = await exchangeCodeForSession(code, clientId);
    if (!user || !session) {
      throw new UnauthorizedException('Invalid exchange response');
    }

    // Upsert user in our database based on WorkOS profile
    const dbUser = await this.prisma.user.upsert({
      where: { workosUserId: user.id },
      update: { email: user.email },
      create: {
        workosUserId: user.id,
        email: user.email,
      },
    });

    // The user must belong to an organization to be authorized in Chorus.
    // In MVP/Sprint 3, we expect them to be invited or synced via SCIM.
    // WorkOS doesn't return orgs directly in the user object by default without
    // fetching memberships, but auth-client/WorkOS might. We'll query our own memberships.
    const memberships = await this.prisma.memberships.findMany({
      where: { userId: dbUser.id },
    });

    if (memberships.length === 0) {
      // In a full implementation, we might auto-provision based on email domain,
      // but the spec says they must be invited.
      throw new ForbiddenException('User is not a member of any organization');
    }

    // Log the event
    await this.audit.logEvent({
      actorUserId: dbUser.id,
      orgId: memberships[0].orgId, // Using primary org for the login event
      eventType: 'session.issued',
      metadata: {
        ip,
        workosSessionId: session.id,
      },
    });

    return {
      sessionCookie: session.token,
      expiresAt: session.expiresAt,
    };
  }

  async verify(sessionToken: string) {
    try {
      const result = await verifySession(sessionToken);
      if (!result.user) {
        throw new UnauthorizedException('Invalid session');
      }

      // Fetch user and memberships
      const dbUser = await this.prisma.user.findUnique({
        where: { workosUserId: result.user.id },
        include: { memberships: true },
      });

      if (!dbUser) {
        throw new UnauthorizedException('User not found in system');
      }

      return {
        id: dbUser.id,
        email: dbUser.email,
        workosUserId: dbUser.workosUserId,
        memberships: dbUser.memberships.map((m) => ({
          orgId: m.orgId,
          role: m.role as MembershipRole,
        })),
      };
    } catch (e) {
      throw new UnauthorizedException('Session verification failed');
    }
  }

  async revoke(sessionToken: string) {
    // In a real WorkOS setup, we might revoke the session on their end as well.
    // For now, clearing the cookie is handled by the controller.
    // We can also verify it just to find out *who* logged out, for the audit log.
    try {
      const user = await this.verify(sessionToken);
      if (user && user.memberships.length > 0) {
        await this.audit.logEvent({
          actorUserId: user.id,
          orgId: user.memberships[0].orgId,
          eventType: 'session.revoked',
          metadata: {},
        });
      }
    } catch (e) {
      // Ignore verification errors during logout
    }
  }
}
