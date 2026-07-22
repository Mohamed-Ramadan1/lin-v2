import { EmailName } from './email-names.type';
import { TemplateDataMap } from './mail-template.type';

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
  emailName: EmailName;
  templateData?: TemplateDataMap[EmailName];
}
