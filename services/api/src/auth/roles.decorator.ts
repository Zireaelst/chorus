import { SetMetadata } from '@nestjs/common';
import { MembershipRole } from '@chorus/types';

export const Roles = (...roles: MembershipRole[]) => SetMetadata('roles', roles);
