import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import * as crypto from 'crypto';

@Injectable()
export class ApiKeysService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async createApiKey(orgId: string, actorUserId: string, name: string) {
    // Generate a random 32-byte key
    const rawKey = `ch_${crypto.randomBytes(32).toString('hex')}`;
    
    // Hash it for storage
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

    const apiKey = await this.prisma.apiKey.create({
      data: {
        orgId,
        name,
        keyHash,
        createdByUserId: actorUserId,
      },
    });

    await this.audit.logEvent({
      actorUserId,
      orgId,
      eventType: 'api_key.created',
      metadata: { apiKeyId: apiKey.id, name },
    });

    // Return the raw key EXACTLY once. It is never stored.
    return {
      id: apiKey.id,
      name: apiKey.name,
      key: rawKey,
      createdAt: apiKey.createdAt,
    };
  }

  async revokeApiKey(orgId: string, actorUserId: string, keyId: string) {
    const apiKey = await this.prisma.apiKey.findUnique({
      where: { id: keyId },
    });

    if (!apiKey || apiKey.orgId !== orgId) {
      throw new NotFoundException('API key not found');
    }

    await this.prisma.apiKey.update({
      where: { id: keyId },
      data: { revokedAt: new Date() },
    });

    await this.audit.logEvent({
      actorUserId,
      orgId,
      eventType: 'api_key.revoked',
      metadata: { apiKeyId: apiKey.id, name: apiKey.name },
    });
  }
}
