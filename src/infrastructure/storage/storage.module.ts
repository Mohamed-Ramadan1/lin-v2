import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  s3ClientProvider,
  s3StorageConfigProvider,
} from './providers/s3.provider';
import { S3StorageService } from './services/s3-storage.service';

@Module({
  imports: [ConfigModule],
  providers: [s3StorageConfigProvider, s3ClientProvider, S3StorageService],
  exports: [S3StorageService],
})
export class StorageModule {}
