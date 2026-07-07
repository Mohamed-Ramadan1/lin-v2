import { ConfigService } from '@nestjs/config';
import {
  utilities as nestWinstonUtilities,
  WinstonModuleOptions,
} from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import {
  APPLICATION_LOG_FILENAME,
  DEFAULT_LOG_DIR,
  DEFAULT_LOG_LEVEL,
  DEFAULT_LOG_MAX_FILES,
  DEFAULT_LOG_MAX_SIZE,
  ERROR_LOG_FILENAME,
} from '../constants/logging.constants';

export function createWinstonLoggerOptions(
  config: ConfigService,
): WinstonModuleOptions {
  const environment = config.get<string>('NODE_ENV', 'development');
  const level = config.get<string>('LOG_LEVEL', DEFAULT_LOG_LEVEL);
  const logDir = normalizeLogDir(
    config.get<string>('LOG_DIR', DEFAULT_LOG_DIR),
  );
  const maxSize = config.get<string>('LOG_MAX_SIZE', DEFAULT_LOG_MAX_SIZE);
  const maxFiles = config.get<string>('LOG_MAX_FILES', DEFAULT_LOG_MAX_FILES);

  return {
    level,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.json(),
    ),
    transports: [
      new winston.transports.Console({
        format:
          environment === 'production'
            ? winston.format.json()
            : winston.format.combine(
                winston.format.timestamp(),
                winston.format.ms(),
                nestWinstonUtilities.format.nestLike('Noviq', {
                  colors: true,
                  prettyPrint: true,
                }),
              ),
      }),
      new winston.transports.DailyRotateFile({
        filename: `${logDir}/${APPLICATION_LOG_FILENAME}`,
        level,
        maxFiles,
        maxSize,
      }),
      new winston.transports.DailyRotateFile({
        filename: `${logDir}/${ERROR_LOG_FILENAME}`,
        level: 'error',
        maxFiles,
        maxSize,
      }),
    ],
  };
}

function normalizeLogDir(logDir: string): string {
  return logDir.replace(/\/+$/, '') || DEFAULT_LOG_DIR;
}
