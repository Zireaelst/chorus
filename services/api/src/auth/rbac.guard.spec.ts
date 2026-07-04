import { RbacGuard } from './rbac.guard';
import { ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

describe('RbacGuard', () => {
  let guard: RbacGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RbacGuard(reflector);
  });

  it('should allow access if no roles are required', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(undefined);
    const mockContext = {
      getHandler: jest.fn(),
      switchToHttp: jest.fn(),
    } as unknown as ExecutionContext;

    expect(guard.canActivate(mockContext)).toBe(true);
  });

  it('should throw UnauthorizedException if no user in request', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['hospital_admin']);
    const mockContext = {
      getHandler: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: () => ({ user: undefined }),
      }),
    } as unknown as ExecutionContext;

    expect(() => guard.canActivate(mockContext)).toThrow(UnauthorizedException);
  });

  it('should throw ForbiddenException if user lacks required role', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['hospital_admin']);
    const mockContext = {
      getHandler: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: () => ({
          user: {
            memberships: [{ role: 'clinician' }],
          },
        }),
      }),
    } as unknown as ExecutionContext;

    expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
  });

  it('should return true if user has required role', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['hospital_admin']);
    const mockContext = {
      getHandler: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: () => ({
          user: {
            memberships: [{ role: 'hospital_admin' }],
          },
        }),
      }),
    } as unknown as ExecutionContext;

    expect(guard.canActivate(mockContext)).toBe(true);
  });
});
