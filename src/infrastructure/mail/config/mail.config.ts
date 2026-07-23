import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import {
  MAIL_DEFAULT_FROM,
  MAIL_DEFAULT_HOST,
  MAIL_DEFAULT_PORT,
} from '../constants/mail.constants';
import { MailConfig } from '../types/mail-config.type';

export function createMailConfig(config: ConfigService): MailConfig {
  return {
    host: config.get<string>('EMAIL_HOST', MAIL_DEFAULT_HOST),
    port: config.get<number>('EMAIL_PORT', MAIL_DEFAULT_PORT),
    user: config.get<string>('EMAIL_USER'),
    pass: config.get<string>('EMAIL_PASSWORD'),
    from: config.get<string>('EMAIL_FROM', MAIL_DEFAULT_FROM),
    secure: config.get<string>('EMAIL_SECURE', 'false') === 'true',
  };
}

export function createMailTransporter(config: ConfigService): Transporter {
  const mailConfig = createMailConfig(config);

  if (mailConfig.user && mailConfig.pass) {
    return createTransport({
      host: mailConfig.host,
      port: mailConfig.port,
      secure: mailConfig.secure,
      auth: {
        user: mailConfig.user,
        pass: mailConfig.pass,
      },
    });
  }

  return createTransport({
    host: mailConfig.host,
    port: mailConfig.port,
    secure: mailConfig.secure,
  });
}
