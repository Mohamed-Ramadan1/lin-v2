import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { createWinstonLoggerOptions } from './logging.config';

describe('createWinstonLoggerOptions', () => {
  it('creates console, application file, and error file transports', () => {
    const config = new ConfigService({
      LOG_LEVEL: 'debug',
      LOG_DIR: 'storage/logs',
      LOG_MAX_SIZE: '10m',
      LOG_MAX_FILES: '7d',
    });

    const options = createWinstonLoggerOptions(config);
    const transports = Array.isArray(options.transports)
      ? options.transports
      : [options.transports];
    const rotateTransports = transports.filter(
      (transport) => transport instanceof winston.transports.DailyRotateFile,
    );

    expect(options.level).toBe('debug');
    expect(transports).toHaveLength(3);
    expect(rotateTransports).toHaveLength(2);
    expect(
      rotateTransports.map((transport) => ({
        dirname: transport.dirname,
        filename: transport.filename,
      })),
    ).toEqual([
      {
        dirname: 'storage/logs',
        filename: 'application-%DATE%.log',
      },
      {
        dirname: 'storage/logs',
        filename: 'error-%DATE%.log',
      },
    ]);
  });
});
