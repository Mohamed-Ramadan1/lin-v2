import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [DatabaseModule, CacheModule],
  exports: [DatabaseModule, CacheModule],
})
export class InfrastructureModule {}
