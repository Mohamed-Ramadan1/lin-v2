import { EmailName } from '../types/email-names.type';
import { WelcomeTemplateData } from '../types/mail-template.type';
import { MAIL_APP_NAME } from '../constants/mail.constants';
import { baseTemplate } from './base.template';

export function welcomeTemplate(data: WelcomeTemplateData): string {
  const body = `
    <h2>Welcome aboard, ${data.userName} &#128075;</h2>
    <p>Your account is all set up and ready to go. We're thrilled to have you join ${MAIL_APP_NAME}.</p>
    <p>Jump in and start organizing your world:</p>
    <a href="${data.loginUrl}" class="btn">Get Started &rarr;</a>
    <div class="link-fallback">Or copy this link: ${data.loginUrl}</div>
  `;

  return baseTemplate(body);
}

welcomeTemplate.templateName = EmailName.WELCOME;
