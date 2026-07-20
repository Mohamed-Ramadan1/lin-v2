import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { CacheModule } from './cache/cache.module';
import { LoggingModule } from './logging/logging.module';
import { SecurityJwtModule } from './security/jwt/jwt.module';
import { SecurityPasswordModule } from './security/password/password.module';
import { QueueModule } from './queue/queue.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    DatabaseModule,
    CacheModule,
    LoggingModule,
    SecurityJwtModule,
    SecurityPasswordModule,
    QueueModule,
    StorageModule,
  ],
  exports: [
    DatabaseModule,
    CacheModule,
    LoggingModule,
    SecurityJwtModule,
    SecurityPasswordModule,
    QueueModule,
    StorageModule,
  ],
})
export class InfrastructureModule {}
