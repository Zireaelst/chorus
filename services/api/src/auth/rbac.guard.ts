import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MembershipRole } from '@chorus/types';
import { FastifyRequest } from 'fastify';

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<MembershipRole[]>('roles', context.getHandler());
    if (!requiredRoles || requiredRoles.length === 0) {
      // If no roles are specified, the route might be public or require a separate AuthGuard.
      // We'll let it pass here, but in a real app we might enforce @Roles everywhere.
      return true;
    }

    const request = context.switchToHttp().getRequest<FastifyRequest & { user?: any }>();
    const user = request.user; // Expected to be populated by an AuthMiddleware/AuthGuard

    if (!user) {
      throw new UnauthorizedException('UNAUTHENTICATED');
    }

    // Check if the user has any of the required roles in ANY of their orgs
    // Real implementation might scope this to a specific orgId from the request params.
    const hasRole = user.memberships.some((m: any) => requiredRoles.includes(m.role as MembershipRole));
    if (!hasRole) {
      throw new ForbiddenException({
        error: {
          code: 'FORBIDDEN',
          message: 'Authenticated, but the caller role doesn\'t permit this action',
          // requestId would be injected by a global exception filter
        }
      });
    }

    return true;
  }
}
