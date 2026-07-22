import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EMAIL_QUEUE_NAME } from '../queue/constants/queue.constants';
import { MAIL_TRANSPORTER } from './constants/mail.constants';
import { createMailTransporter } from './config/mail.config';
import { EmailProcessor } from './processors/email.processor';
import { EmailSenderService } from './services/email-sender.service';
import { MailTemplateService } from './services/mail-template.service';

@Module({
  imports: [ConfigModule, BullModule.registerQueue({ name: EMAIL_QUEUE_NAME })],
  providers: [
    {
      provide: MAIL_TRANSPORTER,
      inject: [ConfigService],
      useFactory: createMailTransporter,
    },
    EmailSenderService,
    EmailProcessor,
    MailTemplateService,
  ],
  exports: [EmailSenderService, MailTemplateService],
})
export class MailModule {}
