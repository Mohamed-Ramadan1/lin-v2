import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { S3_CLIENT, S3_STORAGE_CONFIG } from '../constants/storage.constants';
import { createS3StorageConfig } from '../config/s3.config';
import { S3StorageConfig } from '../types/s3-storage-config.type';

export const s3StorageConfigProvider = {
  provide: S3_STORAGE_CONFIG,
  inject: [ConfigService],
  useFactory: createS3StorageConfig,
};

export const s3ClientProvider = {
  provide: S3_CLIENT,
  inject: [S3_STORAGE_CONFIG],
  useFactory: (config: S3StorageConfig): S3Client => {
    return new S3Client({
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      endpoint: config.endpoint,
      forcePathStyle: config.forcePathStyle,
      region: config.region,
    });
  },
};
