import { Inject, Injectable, Logger } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import {
  MAIL_TRANSPORTER,
  MAIL_DEFAULT_FROM,
} from '../constants/mail.constants';
import { SendEmailOptions } from '../types/send-email-options.type';

@Injectable()
export class EmailSenderService {
  private readonly logger = new Logger(EmailSenderService.name);
  private readonly from = MAIL_DEFAULT_FROM;
  constructor(
    @Inject(MAIL_TRANSPORTER) private readonly transporter: Transporter,
  ) {}

  async send(options: SendEmailOptions): Promise<void> {
    try {
      const result = await this.transporter.sendMail({
        from: options.from || this.from,
        to: options.to,
        cc: options.cc,
        bcc: options.bcc,
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: options.attachments?.map((a) => ({
          filename: a.filename,
          content: a.content,
          contentType: a.contentType,
        })),
      });

      this.logger.log(
        `Email sent to "${this.formatRecipients(options.to)}" | subject: "${options.subject}" | messageId: ${result.messageId}`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      this.logger.error(
        `Failed to send email to "${this.formatRecipients(options.to)}" | subject: "${options.subject}" | error: ${message}`,
      );

      throw error;
    }
  }

  async sendMany(emails: SendEmailOptions[]): Promise<void> {
    for (const email of emails) {
      await this.send(email);
    }
  }

  private formatRecipients(recipients?: string | string[]): string {
    if (!recipients) {
      return 'none';
    }

    return Array.isArray(recipients) ? recipients.join(', ') : recipients;
  }
}
