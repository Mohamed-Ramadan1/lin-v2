import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { createWinstonLoggerOptions } from './config/logging.config';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: createWinstonLoggerOptions,
    }),
  ],
  exports: [WinstonModule],
})
export class LoggingModule {}
