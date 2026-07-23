import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { EMAIL_QUEUE_NAME } from '../../queue/constants/queue.constants';
import { EmailSenderService } from '../services/email-sender.service';
import { MailTemplateService } from '../services/mail-template.service';
import { SendEmailOptions } from '../types/send-email-options.type';

@Processor(EMAIL_QUEUE_NAME)
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(
    private readonly emailSenderService: EmailSenderService,
    private readonly mailTemplateService: MailTemplateService,
  ) {
    super();
  }

  async process(job: Job<SendEmailOptions>): Promise<void> {
    this.logger.log(
      `Processing email job ${job.id} | attempt ${job.attemptsMade + 1} | to: "${this.formatRecipients(job.data.to)}" | subject: "${job.data.subject}" | emailName: ${job.data.emailName}`,
    );

    const html = this.resolveHtml(job);

    await this.emailSenderService.send({ ...job.data, html });
  }

  private resolveHtml(job: Job<SendEmailOptions>): string {
    if (job.data.html) {
      return job.data.html;
    }

    if (!job.data.templateData) {
      throw new Error(
        `Email job ${job.id} has no "html" and no "templateData" for template "${job.data.emailName}"`,
      );
    }

    return this.mailTemplateService.render(
      job.data.emailName,
      job.data.templateData,
    );
  }

  private formatRecipients(recipients?: string | string[]): string {
    if (!recipients) {
      return 'none';
    }

    return Array.isArray(recipients) ? recipients.join(', ') : recipients;
  }
}
