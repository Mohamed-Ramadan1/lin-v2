import { ObjectCannedACL } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

export type UploadBody = Buffer | Uint8Array | string | Readable;

export type UploadOptions = {
  acl?: ObjectCannedACL;
  body: UploadBody;
  cacheControl?: string;
  contentDisposition?: string;
  contentEncoding?: string;
  contentLength?: number;
  contentType?: string;
  key: string;
  metadata?: Record<string, string>;
};

export type SignedUploadUrlOptions = {
  acl?: ObjectCannedACL;
  contentLength?: number;
  contentType?: string;
  expiresInSeconds?: number;
  key: string;
  metadata?: Record<string, string>;
};
