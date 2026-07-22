import { EmailName } from './email-names.type';

export interface WelcomeTemplateData {
  userName: string;
  loginUrl?: string;
}

export interface PasswordResetTemplateData {
  userName: string;
  resetUrl: string;
  expiresInMinutes: number;
}

export interface EmailVerificationTemplateData {
  userName: string;
  verificationUrl: string;
  expiresInMinutes: number;
}

export type TemplateDataMap = {
  [EmailName.WELCOME]: WelcomeTemplateData;
  [EmailName.PASSWORD_RESET]: PasswordResetTemplateData;
  [EmailName.EMAIL_VERIFICATION]: EmailVerificationTemplateData;
};

export type MailTemplate<T extends EmailName> = (
  data: TemplateDataMap[T],
) => string;
