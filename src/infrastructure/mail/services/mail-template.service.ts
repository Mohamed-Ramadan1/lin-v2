import { Injectable, Logger } from '@nestjs/common';
import { EmailName } from '../types/email-names.type';
import { TemplateDataMap } from '../types/mail-template.type';
import { TEMPLATE_REGISTRY } from '../templates';

@Injectable()
export class MailTemplateService {
  private readonly logger = new Logger(MailTemplateService.name);

  render<T extends EmailName>(
    templateName: T,
    data: TemplateDataMap[T],
  ): string {
    const renderer = TEMPLATE_REGISTRY[templateName];

    if (!renderer) {
      this.logger.error(`Unknown email template "${templateName}"`);
      throw new Error(`Unknown email template "${templateName}"`);
    }

    this.logger.debug(`Rendering email template "${templateName}"`);
    return renderer(data);
  }
}
