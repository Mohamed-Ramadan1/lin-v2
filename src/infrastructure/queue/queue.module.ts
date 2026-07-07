import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createQueueOptions } from './config/queue.config';
import {
  DEFAULT_QUEUE_NAME,
  EMAIL_QUEUE_NAME,
  NOTIFICATION_QUEUE_NAME,
} from './constants/queue.constants';
import { QueueService } from './services/queue.service';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: createQueueOptions,
    }),
    BullModule.registerQueue(
      { name: DEFAULT_QUEUE_NAME },
      { name: EMAIL_QUEUE_NAME },
      { name: NOTIFICATION_QUEUE_NAME },
    ),
  ],
  providers: [QueueService],
  exports: [BullModule, QueueService],
})
export class QueueModule {}
