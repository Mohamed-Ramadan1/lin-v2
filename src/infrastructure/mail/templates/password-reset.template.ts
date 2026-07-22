import { EmailName } from '../types/email-names.type';
import { PasswordResetTemplateData } from '../types/mail-template.type';
import { baseTemplate } from './base.template';

export function passwordResetTemplate(data: PasswordResetTemplateData): string {
  const body = `
    <h2>Reset your password</h2>
    <p>Hi ${data.userName}, we received a request to reset your password. No worries — tap the button below to pick a new one.</p>
    <a href="${data.resetUrl}" class="btn">Reset Password</a>
    <p style="font-size: 13px; color: #6b7280;">This link expires in <strong>${data.expiresInMinutes} minutes</strong>. If you didn't request this, you can safely ignore this email.</p>
    <div class="link-fallback">Or copy this link: ${data.resetUrl}</div>
  `;

  return baseTemplate(body);
}

passwordResetTemplate.templateName = EmailName.PASSWORD_RESET;
