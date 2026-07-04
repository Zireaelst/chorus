import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { UnauthorizedException } from '@nestjs/common';

// Mock dependencies
const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    upsert: jest.fn(),
  },
  memberships: {
    findMany: jest.fn(),
  },
};

const mockAuditService = {
  logEvent: jest.fn(),
};

// Mock external module
jest.mock('@chorus/auth-client', () => ({
  verifySession: jest.fn(),
  exchangeCodeForSession: jest.fn(),
}));

import { verifySession } from '@chorus/auth-client';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: AuditService, useValue: mockAuditService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('verify', () => {
    it('should throw UnauthorizedException if token is invalid', async () => {
      (verifySession as jest.Mock).mockResolvedValue({ user: null });

      await expect(service.verify('invalid-token')).rejects.toThrow(UnauthorizedException);
    });

    it('should return user with memberships on valid session', async () => {
      (verifySession as jest.Mock).mockResolvedValue({
        user: { id: 'workos_user_id', email: 'test@hospital.com' },
      });

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'db_user_id',
        email: 'test@hospital.com',
        workosUserId: 'workos_user_id',
        memberships: [
          { orgId: 'org_id_1', role: 'hospital_admin' },
        ],
      });

      const result = await service.verify('valid-token');
      expect(result.id).toBe('db_user_id');
      expect(result.memberships[0].role).toBe('hospital_admin');
    });
  });
});
