import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import * as crypto from 'crypto';
import * as dns from 'dns';
import * as util from 'util';
import * as ipaddr from 'ipaddr.js';

const lookup = util.promisify(dns.lookup);

@Injectable()
export class WebhooksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async createWebhook(orgId: string, actorUserId: string, urlStr: string, eventTypes: string[]) {
    // 1. Validate HTTPS
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(urlStr);
    } catch (e) {
      throw new BadRequestException({ error: { code: 'VALIDATION_ERROR', message: 'Invalid URL format' } });
    }

    if (parsedUrl.protocol !== 'https:') {
      throw new BadRequestException({ error: { code: 'VALIDATION_ERROR', message: 'Webhook URL must be HTTPS' } });
    }

    // 2. SSRF Check: resolve hostname and block private/internal IPs
    await this.validateUrlForSSRF(parsedUrl.hostname);

    const secret = crypto.randomBytes(32).toString('hex');
    const secretHash = crypto.createHash('sha256').update(secret).digest('hex');

    const webhook = await this.prisma.webhook.create({
      data: {
        orgId,
        url: urlStr,
        secretHash,
        eventTypes,
        status: 'pending_verification',
      },
    });

    await this.audit.logEvent({
      actorUserId,
      orgId,
      eventType: 'webhook.created',
      metadata: { webhookId: webhook.id, url: urlStr, eventTypes },
    });

    return {
      id: webhook.id,
      url: webhook.url,
      eventTypes: webhook.eventTypes,
      status: webhook.status,
    };
  }

  private async validateUrlForSSRF(hostname: string) {
    // Basic catch for localhost or obvious private names
    if (['localhost', '127.0.0.1'].includes(hostname)) {
      throw new BadRequestException({ error: { code: 'VALIDATION_ERROR', message: 'Webhook URL resolves to a disallowed private/internal network' } });
    }

    try {
      const { address } = await lookup(hostname);
      const ip = ipaddr.parse(address);

      if (ip.range() !== 'unicast' && ip.range() !== 'ipv4Mapped') {
        // Blocks private (RFC 1918), loopback, link-local, multicast, etc.
        throw new BadRequestException({ error: { code: 'VALIDATION_ERROR', message: 'Webhook URL resolves to a disallowed private/internal network' } });
      }
    } catch (err: any) {
      if (err instanceof BadRequestException) throw err;
      // If DNS lookup fails, it's also invalid
      throw new BadRequestException({ error: { code: 'VALIDATION_ERROR', message: 'Could not resolve Webhook URL hostname' } });
    }
  }
}
