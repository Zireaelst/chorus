import { Test, TestingModule } from '@nestjs/testing';
import { WebhooksService } from './webhooks.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { BadRequestException } from '@nestjs/common';

describe('WebhooksService', () => {
  let service: WebhooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhooksService,
        {
          provide: PrismaService,
          useValue: { webhook: { create: jest.fn() } },
        },
        {
          provide: AuditService,
          useValue: { logEvent: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<WebhooksService>(WebhooksService);
  });

  describe('validateUrlForSSRF', () => {
    it('should reject localhost', async () => {
      await expect(service['validateUrlForSSRF']('localhost')).rejects.toThrow(BadRequestException);
    });

    it('should reject 127.0.0.1', async () => {
      await expect(service['validateUrlForSSRF']('127.0.0.1')).rejects.toThrow(BadRequestException);
    });

    it('should reject 10.0.0.1', async () => {
      await expect(service['validateUrlForSSRF']('10.0.0.1')).rejects.toThrow(BadRequestException);
    });

    it('should reject 192.168.1.1', async () => {
      await expect(service['validateUrlForSSRF']('192.168.1.1')).rejects.toThrow(BadRequestException);
    });

    it('should accept api.github.com', async () => {
      await expect(service['validateUrlForSSRF']('api.github.com')).resolves.not.toThrow();
    });
  });
});
