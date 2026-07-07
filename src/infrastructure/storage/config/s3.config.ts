import { ConfigService } from '@nestjs/config';
import { toNumber } from '../../../core/config/env.utils';
import {
  DEFAULT_S3_KEY_PREFIX,
  DEFAULT_S3_SIGNED_URL_EXPIRES_SECONDS,
} from '../constants/storage.constants';
import { S3StorageConfig } from '../types/s3-storage-config.type';

export function createS3StorageConfig(config: ConfigService): S3StorageConfig {
  const region = config.get<string>('AWS_REGION');
  const accessKeyId = config.get<string>('AWS_ACCESS_KEY_ID');
  const secretAccessKey = config.get<string>('AWS_SECRET_ACCESS_KEY');
  const bucket = config.get<string>('S3_BUCKET_NAME');

  if (!region || !accessKeyId || !secretAccessKey || !bucket) {
    throw new Error(
      'AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and S3_BUCKET_NAME are required.',
    );
  }

  return {
    accessKeyId,
    bucket,
    endpoint: emptyToUndefined(config.get<string>('S3_ENDPOINT')),
    forcePathStyle: toBoolean(config.get<string>('S3_FORCE_PATH_STYLE'), false),
    keyPrefix: normalizeKeyPrefix(
      config.get<string>('S3_KEY_PREFIX', DEFAULT_S3_KEY_PREFIX),
    ),
    publicBaseUrl: normalizePublicBaseUrl(
      emptyToUndefined(config.get<string>('S3_PUBLIC_BASE_URL')),
    ),
    region,
    secretAccessKey,
    signedUrlExpiresSeconds: toNumber(
      config.get<string>('S3_SIGNED_URL_EXPIRES_SECONDS'),
      DEFAULT_S3_SIGNED_URL_EXPIRES_SECONDS,
    ),
  };
}

function toBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) {
    return fallback;
  }

  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
}

function normalizeKeyPrefix(prefix: string): string {
  return prefix.replace(/^\/+|\/+$/g, '');
}

function normalizePublicBaseUrl(url: string | undefined): string | undefined {
  return url?.replace(/\/+$/g, '');
}

function emptyToUndefined(value: string | undefined): string | undefined {
  return value && value.trim().length > 0 ? value : undefined;
}
