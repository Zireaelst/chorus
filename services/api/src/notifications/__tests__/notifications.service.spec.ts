import { Test, TestingModule } from '@nestjs/testing';
import { ApiNotificationsService } from '../notifications.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ApiNotificationsService - markAsRead', () => {
  let service: ApiNotificationsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiNotificationsService,
        {
          provide: PrismaService,
          useValue: {
            notification: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ApiNotificationsService>(ApiNotificationsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw NotFoundException if notification does not exist', async () => {
    jest.spyOn(prisma.notification, 'findUnique').mockResolvedValue(null);

    await expect(service.markAsRead('user1', 'org1', 'notif1')).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException if notification belongs to a different user', async () => {
    jest.spyOn(prisma.notification, 'findUnique').mockResolvedValue({
      id: 'notif1',
      userId: 'user2',
      orgId: 'org1',
    } as any);

    await expect(service.markAsRead('user1', 'org1', 'notif1')).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException if notification belongs to a different org', async () => {
    jest.spyOn(prisma.notification, 'findUnique').mockResolvedValue({
      id: 'notif1',
      userId: 'user1',
      orgId: 'org2',
    } as any);

    await expect(service.markAsRead('user1', 'org1', 'notif1')).rejects.toThrow(NotFoundException);
  });

  it('should set readAt to current date if notification is valid', async () => {
    jest.spyOn(prisma.notification, 'findUnique').mockResolvedValue({
      id: 'notif1',
      userId: 'user1',
      orgId: 'org1',
      readAt: null,
    } as any);

    jest.spyOn(prisma.notification, 'update').mockResolvedValue({
      id: 'notif1',
      readAt: new Date(),
    } as any);

    await service.markAsRead('user1', 'org1', 'notif1');

    expect(prisma.notification.update).toHaveBeenCalledWith({
      where: { id: 'notif1' },
      data: { readAt: expect.any(Date) },
    });
  });

  it('should be idempotent if notification is already read', async () => {
    jest.spyOn(prisma.notification, 'findUnique').mockResolvedValue({
      id: 'notif1',
      userId: 'user1',
      orgId: 'org1',
      readAt: new Date(),
    } as any);

    jest.spyOn(prisma.notification, 'update').mockResolvedValue({
      id: 'notif1',
      readAt: new Date(),
    } as any);

    await service.markAsRead('user1', 'org1', 'notif1');

    expect(prisma.notification.update).toHaveBeenCalledWith({
      where: { id: 'notif1' },
      data: { readAt: expect.any(Date) },
    });
  });
});
