import { ConfigService } from '@nestjs/config';
import { createS3StorageConfig } from './s3.config';

describe('createS3StorageConfig', () => {
  it('creates storage config from env with normalized optional controls', () => {
    const config = new ConfigService({
      AWS_REGION: 'eu-west-1',
      AWS_ACCESS_KEY_ID: 'access-key',
      AWS_SECRET_ACCESS_KEY: 'secret-key',
      S3_BUCKET_NAME: 'assets-bucket',
      S3_ENDPOINT: 'http://localhost:9000',
      S3_FORCE_PATH_STYLE: 'true',
      S3_PUBLIC_BASE_URL: 'https://cdn.example.com/',
      S3_SIGNED_URL_EXPIRES_SECONDS: '1200',
      S3_KEY_PREFIX: '/uploads/',
    });

    expect(createS3StorageConfig(config)).toEqual({
      accessKeyId: 'access-key',
      bucket: 'assets-bucket',
      endpoint: 'http://localhost:9000',
      forcePathStyle: true,
      keyPrefix: 'uploads',
      publicBaseUrl: 'https://cdn.example.com',
      region: 'eu-west-1',
      secretAccessKey: 'secret-key',
      signedUrlExpiresSeconds: 1200,
    });
  });

  it('fails when required S3 values are missing', () => {
    expect(() => createS3StorageConfig(new ConfigService())).toThrow(
      'AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and S3_BUCKET_NAME are required.',
    );
  });
});
