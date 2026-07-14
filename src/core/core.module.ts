import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import {
  DEFAULT_THROTTLE_LIMIT,
  DEFAULT_THROTTLE_TTL_MS,
} from '../common/constants/app.constants';
import { getEnvFilePaths, toNumber } from './config/env.utils';
import { AllExceptionsFilter } from '../common/filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      envFilePath: getEnvFilePaths(),
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          name: 'default',
          ttl: toNumber(
            config.get<string>('THROTTLE_TTL'),
            DEFAULT_THROTTLE_TTL_MS,
          ),
          limit: toNumber(
            config.get<string>('THROTTLE_LIMIT'),
            DEFAULT_THROTTLE_LIMIT,
          ),
        },
      ],
    }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
  ],
  exports: [ConfigModule, ScheduleModule, ThrottlerModule],
})
export class CoreModule {}
