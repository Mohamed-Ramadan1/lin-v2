import {
  CopyObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Inject, Injectable } from '@nestjs/common';
import { S3_CLIENT, S3_STORAGE_CONFIG } from '../constants/storage.constants';
import { S3StorageConfig } from '../types/s3-storage-config.type';
import { StorageObject } from '../types/storage-object.type';
import {
  SignedUploadUrlOptions,
  UploadOptions,
} from '../types/upload-options.type';

@Injectable()
export class S3StorageService {
  constructor(
    @Inject(S3_CLIENT)
    private readonly s3: S3Client,
    @Inject(S3_STORAGE_CONFIG)
    private readonly config: S3StorageConfig,
  ) {}

  async uploadBuffer(options: UploadOptions): Promise<StorageObject> {
    return this.uploadManaged(options);
  }

  async uploadStream(options: UploadOptions): Promise<StorageObject> {
    return this.uploadManaged(options);
  }

  async putObject(options: UploadOptions): Promise<StorageObject> {
    const key = this.buildKey(options.key);

    await this.s3.send(
      new PutObjectCommand({
        ACL: options.acl,
        Body: options.body,
        Bucket: this.config.bucket,
        CacheControl: options.cacheControl,
        ContentDisposition: options.contentDisposition,
        ContentEncoding: options.contentEncoding,
        ContentLength: options.contentLength,
        ContentType: options.contentType,
        Key: key,
        Metadata: options.metadata,
      }),
    );

    return this.toStorageObject(key);
  }

  async getObject(key: string) {
    return this.s3.send(
      new GetObjectCommand({
        Bucket: this.config.bucket,
        Key: this.buildKey(key),
      }),
    );
  }

  async headObject(key: string) {
    return this.s3.send(
      new HeadObjectCommand({
        Bucket: this.config.bucket,
        Key: this.buildKey(key),
      }),
    );
  }

  async objectExists(key: string): Promise<boolean> {
    try {
      await this.headObject(key);
      return true;
    } catch {
      return false;
    }
  }

  async deleteObject(key: string): Promise<void> {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.config.bucket,
        Key: this.buildKey(key),
      }),
    );
  }

  async deleteObjects(keys: string): Promise<void>;
  async deleteObjects(keys: string[]): Promise<void>;
  async deleteObjects(keys: string | string[]): Promise<void> {
    const objectKeys = Array.isArray(keys) ? keys : [keys];

    if (objectKeys.length === 0) {
      return;
    }

    await this.s3.send(
      new DeleteObjectsCommand({
        Bucket: this.config.bucket,
        Delete: {
          Objects: objectKeys.map((key) => ({
            Key: this.buildKey(key),
          })),
          Quiet: true,
        },
      }),
    );
  }

  async copyObject(
    sourceKey: string,
    targetKey: string,
  ): Promise<StorageObject> {
    const builtSourceKey = this.buildKey(sourceKey);
    const builtTargetKey = this.buildKey(targetKey);

    await this.s3.send(
      new CopyObjectCommand({
        Bucket: this.config.bucket,
        CopySource: encodeCopySource(this.config.bucket, builtSourceKey),
        Key: builtTargetKey,
      }),
    );

    return this.toStorageObject(builtTargetKey);
  }

  async getSignedUploadUrl(options: SignedUploadUrlOptions) {
    const key = this.buildKey(options.key);
    const command = new PutObjectCommand({
      ACL: options.acl,
      Bucket: this.config.bucket,
      ContentLength: options.contentLength,
      ContentType: options.contentType,
      Key: key,
      Metadata: options.metadata,
    });

    const url = await getSignedUrl(this.s3, command, {
      expiresIn:
        options.expiresInSeconds ?? this.config.signedUrlExpiresSeconds,
    });

    return {
      key,
      url,
    };
  }

  async getSignedDownloadUrl(
    key: string,
    expiresInSeconds = this.config.signedUrlExpiresSeconds,
  ): Promise<string> {
    return getSignedUrl(
      this.s3,
      new GetObjectCommand({
        Bucket: this.config.bucket,
        Key: this.buildKey(key),
      }),
      {
        expiresIn: expiresInSeconds,
      },
    );
  }

  getPublicUrl(key: string): string | undefined {
    const builtKey = this.buildKey(key);

    if (!this.config.publicBaseUrl) {
      return undefined;
    }

    return `${this.config.publicBaseUrl}/${builtKey}`;
  }

  buildKey(...parts: string[]): string {
    const key = parts
      .flatMap((part) => part.split('/'))
      .map((part) => part.trim())
      .filter(Boolean)
      .join('/');

    if (!this.config.keyPrefix) {
      return key;
    }

    if (key.startsWith(`${this.config.keyPrefix}/`)) {
      return key;
    }

    return `${this.config.keyPrefix}/${key}`;
  }

  private async uploadManaged(options: UploadOptions): Promise<StorageObject> {
    const key = this.buildKey(options.key);
    const upload = new Upload({
      client: this.s3,
      params: {
        ACL: options.acl,
        Body: options.body,
        Bucket: this.config.bucket,
        CacheControl: options.cacheControl,
        ContentDisposition: options.contentDisposition,
        ContentEncoding: options.contentEncoding,
        ContentLength: options.contentLength,
        ContentType: options.contentType,
        Key: key,
        Metadata: options.metadata,
      },
    });

    await upload.done();

    return this.toStorageObject(key);
  }

  private toStorageObject(key: string): StorageObject {
    return {
      bucket: this.config.bucket,
      key,
      url: this.getPublicUrl(key),
    };
  }
}

function encodeCopySource(bucket: string, key: string): string {
  return encodeURI(`${bucket}/${key}`);
}
