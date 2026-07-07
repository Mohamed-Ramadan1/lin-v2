import {
  CopyObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Upload } from '@aws-sdk/lib-storage';
import { S3StorageConfig } from '../types/s3-storage-config.type';
import { S3StorageService } from './s3-storage.service';

type UploadMockArgs = {
  params: {
    Bucket?: string;
    Key?: string;
  };
};

jest.mock('@aws-sdk/lib-storage', () => ({
  Upload: jest.fn().mockImplementation(({ params }: UploadMockArgs) => ({
    done: jest.fn().mockResolvedValue({
      Bucket: params.Bucket,
      Key: params.Key,
    }),
  })),
}));

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest
    .fn()
    .mockResolvedValue('https://signed.example.com/object'),
}));

describe('S3StorageService', () => {
  let client: { send: jest.Mock<Promise<unknown>, [unknown]> };
  let service: S3StorageService;

  const storageConfig: S3StorageConfig = {
    accessKeyId: 'access-key',
    bucket: 'assets-bucket',
    forcePathStyle: false,
    keyPrefix: 'uploads',
    region: 'eu-west-1',
    secretAccessKey: 'secret-key',
    signedUrlExpiresSeconds: 900,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    client = {
      send: jest.fn<Promise<unknown>, [unknown]>(),
    };
    service = new S3StorageService(
      client as unknown as S3Client,
      storageConfig,
    );
  });

  it('uploads buffers through multipart Upload and returns object metadata', async () => {
    await expect(
      service.uploadBuffer({
        body: Buffer.from('file'),
        contentType: 'text/plain',
        key: 'avatar.txt',
      }),
    ).resolves.toEqual({
      bucket: 'assets-bucket',
      key: 'uploads/avatar.txt',
      url: undefined,
    });

    const uploadMock = Upload as unknown as {
      mock: {
        calls: Array<
          [
            {
              client: unknown;
              params: Record<string, unknown>;
            },
          ]
        >;
      };
    };
    const [uploadArgs] = uploadMock.mock.calls[0];

    expect(uploadArgs.client).toBe(client);
    expect(uploadArgs.params).toMatchObject({
      Body: Buffer.from('file'),
      Bucket: 'assets-bucket',
      ContentType: 'text/plain',
      Key: 'uploads/avatar.txt',
    });
  });

  it('puts small objects directly with PutObjectCommand', async () => {
    client.send.mockResolvedValue({});

    await service.putObject({
      body: 'hello',
      key: 'notes/readme.txt',
    });

    const command = client.send.mock.calls[0][0] as PutObjectCommand;
    expect(command).toBeInstanceOf(PutObjectCommand);
    expect(command.input).toMatchObject({
      Body: 'hello',
      Bucket: 'assets-bucket',
      Key: 'uploads/notes/readme.txt',
    });
  });

  it('creates signed upload and download urls', async () => {
    await expect(
      service.getSignedUploadUrl({
        contentType: 'image/png',
        key: 'images/photo.png',
      }),
    ).resolves.toEqual({
      key: 'uploads/images/photo.png',
      url: 'https://signed.example.com/object',
    });

    await expect(
      service.getSignedDownloadUrl('images/photo.png'),
    ).resolves.toBe('https://signed.example.com/object');
    expect(getSignedUrl).toHaveBeenCalledTimes(2);
  });

  it('sends object management commands', async () => {
    client.send.mockResolvedValue({});

    await service.getObject('file.txt');
    await service.headObject('file.txt');
    await service.deleteObject('file.txt');
    await service.deleteObjects(['one.txt', 'two.txt']);
    await service.copyObject('source.txt', 'target.txt');

    const sentCommands = client.send.mock.calls.map(([command]) => command);

    expect(sentCommands[0]).toBeInstanceOf(GetObjectCommand);
    expect(sentCommands[1]).toBeInstanceOf(HeadObjectCommand);
    expect(sentCommands[2]).toBeInstanceOf(DeleteObjectCommand);
    expect(sentCommands[3]).toBeInstanceOf(DeleteObjectsCommand);
    expect(sentCommands[4]).toBeInstanceOf(CopyObjectCommand);
  });
});
