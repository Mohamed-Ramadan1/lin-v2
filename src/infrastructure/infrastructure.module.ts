import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { CacheModule } from './cache/cache.module';
import { LoggingModule } from './logging/logging.module';
import { SecurityJwtModule } from './security/jwt/jwt.module';

@Module({
  imports: [DatabaseModule, CacheModule, LoggingModule, SecurityJwtModule],
  exports: [DatabaseModule, CacheModule, LoggingModule, SecurityJwtModule],
})
export class InfrastructureModule {}
