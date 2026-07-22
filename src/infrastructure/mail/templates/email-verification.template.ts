import { EmailName } from '../types/email-names.type';
import { EmailVerificationTemplateData } from '../types/mail-template.type';
import { baseTemplate } from './base.template';

export function emailVerificationTemplate(data: EmailVerificationTemplateData): string {
  const body = `
    <h2>Verify your email</h2>
    <p>Hi ${data.userName}, thanks for signing up. Please confirm your email address by clicking below.</p>
    <a href="${data.verificationUrl}" class="btn">Verify Email</a>
    <p style="font-size: 13px; color: #6b7280;">This link expires in <strong>${data.expiresInMinutes} minutes</strong>. If you didn't create this account, you can safely ignore this email.</p>
    <div class="link-fallback">Or copy this link: ${data.verificationUrl}</div>
  `;

  return baseTemplate(body);
}

emailVerificationTemplate.templateName = EmailName.EMAIL_VERIFICATION;
