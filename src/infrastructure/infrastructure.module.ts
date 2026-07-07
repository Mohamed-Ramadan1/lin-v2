import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { CacheModule } from './cache/cache.module';
import { LoggingModule } from './logging/logging.module';

@Module({
  imports: [DatabaseModule, CacheModule, LoggingModule],
  exports: [DatabaseModule, CacheModule, LoggingModule],
})
export class InfrastructureModule {}
