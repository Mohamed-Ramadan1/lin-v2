export type S3StorageConfig = {
  accessKeyId: string;
  bucket: string;
  endpoint?: string;
  forcePathStyle: boolean;
  keyPrefix: string;
  publicBaseUrl?: string;
  region: string;
  secretAccessKey: string;
  signedUrlExpiresSeconds: number;
};
