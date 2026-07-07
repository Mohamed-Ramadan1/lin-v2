import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { toNumber } from '../../../core/config/env.utils';
import { CACHE_KEY_PREFIX, REDIS_CLIENT } from '../constants/cache.constants';

export const redisProvider = {
  provide: REDIS_CLIENT,
  inject: [ConfigService],
  useFactory: (config: ConfigService): Redis => {
    return new Redis({
      host: config.get<string>('REDIS_HOST', 'localhost'),
      port: toNumber(config.get<string>('REDIS_PORT'), 6379),
      password: config.get<string>('REDIS_PASSWORD') || undefined,
      db: toNumber(config.get<string>('REDIS_DB'), 0),

      keyPrefix: config.get<string>('REDIS_KEY_PREFIX', CACHE_KEY_PREFIX),

      lazyConnect: true,
      enableReadyCheck: true,
      maxRetriesPerRequest: 2,

      retryStrategy: (attempt) => Math.min(attempt * 100, 2000),
    });
  },
};
