import { Redis } from 'ioredis';
import { Injectable, OnModuleDestroy } from '@nestjs/common';

// Using the BullMQ Redis connection or fallback to localhost
export const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null, // Required by BullMQ
});

@Injectable()
export class RedisService implements OnModuleDestroy {
    get client(): Redis {
        return redisClient;
    }

    onModuleDestroy() {
        redisClient.disconnect();
    }
}
