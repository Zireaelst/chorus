import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { redisClient } from '../redis.client';

@Injectable()
export class CopilotQuotaGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest & { user?: any }>();
    
    const orgId = request.user?.orgId || 'unknown-org';
    const limit = 500; // Mock daily limit per org from SECURITY_MODEL.md
    const windowSeconds = 86400; // 24 hours

    const key = `copilot-quota:${orgId}`;
    
    const currentCount = await redisClient.incr(key);
    if (currentCount === 1) {
      await redisClient.expire(key, windowSeconds);
    }

    if (currentCount > limit) {
      const ttl = await redisClient.ttl(key);
      const response = context.switchToHttp().getResponse();
      
      response.header('Retry-After', ttl > 0 ? ttl : windowSeconds);
      
      throw new HttpException(
        'COPILOT_QUOTA_EXCEEDED',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
