import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CacheService } from './services/cache.service';
import { CacheKeyService } from './services/cache-key.service';
import { redisProvider } from './redis/redis';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [redisProvider, CacheService, CacheKeyService],
  exports: [CacheService, CacheKeyService],
})
export class CacheModule {}
