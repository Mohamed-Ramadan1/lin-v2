import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import Redis from 'ioredis';
import {
  CACHE_DEFAULT_TTL_MS,
  CACHE_SCAN_COUNT,
  REDIS_CLIENT,
} from '../constants/cache.constants';

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name);

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async onModuleInit(): Promise<void> {
    if (this.redis.status !== 'wait') {
      return;
    }

    try {
      await this.redis.connect();
      this.logger.log('Connected to Redis successfully.');
    } catch (error) {
      this.logger.warn(
        `Redis connection failed: ${this.getErrorMessage(error)}`,
      );
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.redis.status === 'end') {
      return;
    }

    try {
      await this.redis.quit();
    } catch {
      this.redis.disconnect();
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);

      if (value === null) {
        return null;
      }

      return JSON.parse(value) as T;
    } catch (error) {
      this.logger.warn(
        `Failed to read cache key "${key}": ${this.getErrorMessage(error)}`,
      );
      return null;
    }
  }

  async set<T>(
    key: string,
    value: T,
    ttlMs = CACHE_DEFAULT_TTL_MS,
  ): Promise<boolean> {
    try {
      const result = await this.redis.set(
        key,
        JSON.stringify(value),
        'PX',
        this.resolveTtl(ttlMs),
      );

      if (result !== 'OK') {
        throw new Error(`Failed to write cache key "${key}"`);
      }
      return result === 'OK';
    } catch (error) {
      this.logger.warn(
        `Failed to write cache key "${key}": ${this.getErrorMessage(error)}`,
      );
      return false;
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      this.logger.warn(
        `Failed to delete cache key "${key}": ${this.getErrorMessage(error)}`,
      );
    }
  }

  async delMany(keys: string[]): Promise<number> {
    if (keys.length === 0) {
      return 0;
    }

    try {
      return await this.redis.del(...keys);
    } catch (error) {
      this.logger.warn(
        `Failed to delete cache keys: ${this.getErrorMessage(error)}`,
      );
      return 0;
    }
  }

  async remember<T>(
    key: string,
    ttlMs: number,
    loader: () => Promise<T>,
  ): Promise<T> {
    const cached = await this.get<T>(key);

    if (cached !== null) {
      return cached;
    }

    const value = await loader();
    await this.set(key, value, ttlMs);

    return value;
  }

  async invalidatePattern(pattern: string): Promise<number> {
    let cursor = '0';
    let deletedCount = 0;

    try {
      do {
        const [nextCursor, keys] = await this.redis.scan(
          cursor,
          'MATCH',
          pattern,
          'COUNT',
          CACHE_SCAN_COUNT,
        );

        cursor = nextCursor;
        deletedCount += await this.delMany(keys);
      } while (cursor !== '0');

      return deletedCount;
    } catch (error) {
      this.logger.warn(
        `Failed to invalidate cache pattern "${pattern}": ${this.getErrorMessage(error)}`,
      );
      return deletedCount;
    }
  }

  async increment(key: string, ttlMs?: number): Promise<number> {
    try {
      const value = await this.redis.incr(key);

      if (value === 1 && ttlMs !== undefined) {
        await this.redis.pexpire(key, this.resolveTtl(ttlMs));
      }

      return value;
    } catch (error) {
      this.logger.warn(
        `Failed to increment cache key "${key}": ${this.getErrorMessage(error)}`,
      );
      return 0;
    }
  }

  private resolveTtl(ttlMs: number): number {
    return ttlMs > 0 ? ttlMs : CACHE_DEFAULT_TTL_MS;
  }

  private getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }
}
