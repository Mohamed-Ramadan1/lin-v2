import { ConfigService } from '@nestjs/config';
import { createQueueOptions } from './queue.config';

describe('createQueueOptions', () => {
  it('creates BullMQ Redis connection and default job options from env', () => {
    const config = new ConfigService({
      QUEUE_REDIS_HOST: 'redis.local',
      QUEUE_REDIS_PORT: '6380',
      QUEUE_REDIS_PASSWORD: 'secret',
      QUEUE_REDIS_DB: '2',
      QUEUE_PREFIX: 'noviq-test',
      QUEUE_DEFAULT_ATTEMPTS: '5',
      QUEUE_BACKOFF_DELAY_MS: '2500',
      QUEUE_REMOVE_ON_COMPLETE: '100',
      QUEUE_REMOVE_ON_FAIL: '200',
    });

    expect(createQueueOptions(config)).toMatchObject({
      connection: {
        db: 2,
        host: 'redis.local',
        maxRetriesPerRequest: null,
        password: 'secret',
        port: 6380,
      },
      defaultJobOptions: {
        attempts: 5,
        backoff: {
          delay: 2500,
          type: 'exponential',
        },
        removeOnComplete: 100,
        removeOnFail: 200,
      },
      prefix: 'noviq-test',
    });
  });
});
