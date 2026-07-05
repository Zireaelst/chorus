import { RateLimitGuard } from './rate-limit.guard';
import { ExecutionContext } from '@nestjs/common';
import { redisClient } from '../redis.client';
import { HttpException } from '@nestjs/common';

jest.mock('../redis.client', () => ({
  redisClient: {
    incr: jest.fn(),
    expire: jest.fn(),
    ttl: jest.fn(),
  }
}));

describe('RateLimitGuard', () => {
  let guard: RateLimitGuard;

  beforeEach(() => {
    guard = new RateLimitGuard();
    jest.clearAllMocks();
  });

  it('allows request within API key limit', async () => {
    (redisClient.incr as jest.Mock).mockResolvedValueOnce(50);
    
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          ip: '127.0.0.1',
          headers: { authorization: 'Bearer test-key' }
        }),
        getResponse: () => ({})
      })
    } as any as ExecutionContext;

    const result = await guard.canActivate(mockContext);
    expect(result).toBe(true);
    expect(redisClient.incr).toHaveBeenCalledWith('rate-limit:Bearer test-key');
  });

  it('blocks request exceeding session limit', async () => {
    (redisClient.incr as jest.Mock).mockResolvedValueOnce(301);
    (redisClient.ttl as jest.Mock).mockResolvedValueOnce(45);
    
    const mockResponse = { header: jest.fn() };
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          ip: '127.0.0.1',
          headers: {},
          cookies: { session: 'session-cookie' }
        }),
        getResponse: () => mockResponse
      })
    } as any as ExecutionContext;

    await expect(guard.canActivate(mockContext)).rejects.toThrow(HttpException);
    expect(mockResponse.header).toHaveBeenCalledWith('Retry-After', 45);
  });
});
