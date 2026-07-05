import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FastifyRequest } from 'fastify';
import { redisClient } from '../redis.client';
import { REQUIRES_IDEMPOTENCY_KEY } from './requires-idempotency-key.decorator';

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const requiresIdempotency = this.reflector.get<boolean>(
      REQUIRES_IDEMPOTENCY_KEY,
      context.getHandler(),
    );

    if (!requiresIdempotency) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<FastifyRequest & { user?: any }>();
    const idempotencyKey = request.headers['idempotency-key'];

    if (!idempotencyKey) {
      throw new BadRequestException('Idempotency-Key header is required');
    }

    const orgId = request.user?.orgId || 'unknown-org';
    const route = request.url;
    const cacheKey = `idempotency:${orgId}:${route}:${idempotencyKey}`;

    const cachedResponse = await redisClient.get(cacheKey);
    if (cachedResponse) {
      return of(JSON.parse(cachedResponse));
    }

    return next.handle().pipe(
      tap(async (response) => {
        // Cache response for 24 hours
        await redisClient.set(cacheKey, JSON.stringify(response), 'EX', 86400);
      }),
    );
  }
}
