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
export class RateLimitGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    
    // Determine caller type based on headers or user object presence.
    // Real implementation relies on AuthMiddleware, but we can infer from headers:
    const isApiKey = !!request.headers['authorization']?.startsWith('Bearer');
    
    // Rate limits: 120/min API-key, 300/min session
    const limit = isApiKey ? 120 : 300;
    const windowSeconds = 60;

    // Use IP or API key as the identifier. We fallback to IP if unauthenticated.
    let identifier = request.ip || 'unknown';
    if (request.headers['authorization']) {
        identifier = request.headers['authorization'];
    } else if (request.cookies && request.cookies['session']) {
        identifier = request.cookies['session'];
    }

    const key = `rate-limit:${identifier}`;
    
    const currentCount = await redisClient.incr(key);
    if (currentCount === 1) {
      await redisClient.expire(key, windowSeconds);
    }

    if (currentCount > limit) {
      const ttl = await redisClient.ttl(key);
      const response = context.switchToHttp().getResponse();
      
      response.header('Retry-After', ttl > 0 ? ttl : windowSeconds);
      
      throw new HttpException(
        'RATE_LIMITED',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
