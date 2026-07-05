import { SetMetadata } from '@nestjs/common';

export const REQUIRES_IDEMPOTENCY_KEY = 'requiresIdempotencyKey';
export const RequiresIdempotencyKey = () => SetMetadata(REQUIRES_IDEMPOTENCY_KEY, true);
