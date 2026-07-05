// services/api — NestJS bootstrap
// Sprint 0: Empty application bootstrap. Modules added incrementally from v0.3.
// Source: SYSTEM_ARCHITECTURE.md — "services/api (NestJS) is the sync gateway"
// Source: SYSTEM_ARCHITECTURE.md — Fastify chosen over Express for performance

import 'reflect-metadata'

import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify'

import { AppModule } from './app.module'

import fastifyCookie from '@fastify/cookie';
import { RateLimitGuard } from './common/rate-limit/rate-limit.guard';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  )

  await app.register(fastifyCookie as any, {
    secret: process.env.COOKIE_SECRET || 'fallback-secret-for-dev', 
  });

  app.useGlobalGuards(new RateLimitGuard());

  const port = process.env['PORT'] ?? 4000
  await app.listen(port, '0.0.0.0')
  console.log(`services/api listening on port ${port}`)
}

void bootstrap()
