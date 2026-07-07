import { Queue } from 'bullmq';
import {
  DEFAULT_QUEUE_NAME,
  EMAIL_QUEUE_NAME,
  NOTIFICATION_QUEUE_NAME,
} from '../constants/queue.constants';
import { QueueService } from './queue.service';

type QueueMock = Pick<Queue, 'add' | 'addBulk'>;

function createQueueMock(): jest.Mocked<QueueMock> {
  return {
    add: jest.fn(),
    addBulk: jest.fn(),
  };
}

describe('QueueService', () => {
  let defaultQueue: jest.Mocked<QueueMock>;
  let emailQueue: jest.Mocked<QueueMock>;
  let notificationQueue: jest.Mocked<QueueMock>;
  let service: QueueService;

  beforeEach(() => {
    defaultQueue = createQueueMock();
    emailQueue = createQueueMock();
    notificationQueue = createQueueMock();
    service = new QueueService(
      defaultQueue as unknown as Queue,
      emailQueue as unknown as Queue,
      notificationQueue as unknown as Queue,
    );
  });

  it('adds a job to a named queue', async () => {
    await service.add(EMAIL_QUEUE_NAME, 'send-welcome-email', {
      userId: 'user-1',
    });

    expect(emailQueue.add).toHaveBeenCalledWith(
      'send-welcome-email',
      { userId: 'user-1' },
      undefined,
    );
  });

  it('adds delayed jobs with delay option merged into job options', async () => {
    await service.addDelayed(
      NOTIFICATION_QUEUE_NAME,
      'send-reminder',
      { userId: 'user-1' },
      30_000,
      { attempts: 2 },
    );

    expect(notificationQueue.add).toHaveBeenCalledWith(
      'send-reminder',
      { userId: 'user-1' },
      {
        attempts: 2,
        delay: 30_000,
      },
    );
  });

  it('adds bulk jobs to the selected queue', async () => {
    await service.addBulk(DEFAULT_QUEUE_NAME, [
      {
        name: 'job-one',
        data: { id: '1' },
      },
      {
        name: 'job-two',
        data: { id: '2' },
      },
    ]);

    expect(defaultQueue.addBulk).toHaveBeenCalledWith([
      {
        name: 'job-one',
        data: { id: '1' },
      },
      {
        name: 'job-two',
        data: { id: '2' },
      },
    ]);
  });

  it('rejects unknown queues', async () => {
    await expect(service.add('missing', 'job', {})).rejects.toThrow(
      'Queue "missing" is not registered.',
    );
  });
});
