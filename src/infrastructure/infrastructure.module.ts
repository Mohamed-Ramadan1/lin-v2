import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { CacheModule } from './cache/cache.module';
import { LoggingModule } from './logging/logging.module';
import { SecurityJwtModule } from './security/jwt/jwt.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    DatabaseModule,
    CacheModule,
    LoggingModule,
    SecurityJwtModule,
    QueueModule,
  ],
  exports: [
    DatabaseModule,
    CacheModule,
    LoggingModule,
    SecurityJwtModule,
    QueueModule,
  ],
})
export class InfrastructureModule {}
