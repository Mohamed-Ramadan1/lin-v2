import { EmailName } from '../types/email-names.type';
import { TemplateDataMap } from '../types/mail-template.type';
import { welcomeTemplate } from './welcome.template';
import { passwordResetTemplate } from './password-reset.template';
import { emailVerificationTemplate } from './email-verification.template';

export type TemplateRenderer<T extends EmailName> = (
  data: TemplateDataMap[T],
) => string;

export const TEMPLATE_REGISTRY: Record<
  EmailName,
  TemplateRenderer<EmailName>
> = {
  [EmailName.WELCOME]: welcomeTemplate,
  [EmailName.PASSWORD_RESET]: passwordResetTemplate,
  [EmailName.EMAIL_VERIFICATION]: emailVerificationTemplate,
};
