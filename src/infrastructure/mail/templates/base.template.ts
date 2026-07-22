import { MAIL_APP_NAME } from '../constants/mail.constants';

const APP_NAME = MAIL_APP_NAME;
const YEAR = new Date().getFullYear();

export function baseTemplate(body: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${APP_NAME}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    body {
      margin: 0;
      padding: 0;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f0f2f5;
      color: #1f2937;
      line-height: 1.6;
    }

    .wrapper {
      max-width: 560px;
      margin: 0 auto;
      padding: 32px 16px;
    }

    .card {
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 4px 16px rgba(0, 0, 0, 0.04);
    }

    .brand-bar {
      height: 4px;
      background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
    }

    .header {
      padding: 36px 40px 0;
      text-align: center;
    }

    .logo {
      font-size: 22px;
      font-weight: 700;
      color: #1e1b4b;
      letter-spacing: -0.3px;
    }

    .logo-dot {
      display: inline-block;
      width: 7px;
      height: 7px;
      background: #6366f1;
      border-radius: 50%;
      margin-left: 2px;
      vertical-align: middle;
      position: relative;
      top: -8px;
    }

    .body {
      padding: 28px 40px 40px;
    }

    .body h2 {
      margin: 0 0 12px;
      font-size: 20px;
      font-weight: 700;
      color: #111827;
      letter-spacing: -0.2px;
    }

    .body p {
      margin: 0 0 16px;
      font-size: 15px;
      color: #4b5563;
      line-height: 1.65;
    }

    .body p:last-child {
      margin-bottom: 0;
    }

    .btn {
      display: inline-block;
      padding: 13px 36px;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: #ffffff;
      text-decoration: none;
      border-radius: 10px;
      font-weight: 600;
      font-size: 15px;
      margin: 20px 0 8px;
      box-shadow: 0 2px 8px rgba(99, 102, 241, 0.35);
    }

    .link-fallback {
      word-break: break-all;
      color: #9ca3af;
      font-size: 12px;
      margin-top: 12px;
      line-height: 1.5;
    }

    .divider {
      height: 1px;
      background: #e5e7eb;
      margin: 28px 0 0;
    }

    .footer {
      padding: 20px 40px 28px;
      text-align: center;
    }

    .footer p {
      margin: 0;
      font-size: 12px;
      color: #9ca3af;
      line-height: 1.6;
    }

    .footer a {
      color: #6366f1;
      text-decoration: none;
    }

    @media (max-width: 480px) {
      .wrapper {
        padding: 16px 8px;
      }

      .header {
        padding: 28px 24px 0;
      }

      .body {
        padding: 20px 24px 32px;
      }

      .footer {
        padding: 16px 24px 24px;
      }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="brand-bar"></div>
      <div class="header">
        <div class="logo">${APP_NAME}<span class="logo-dot"></span></div>
      </div>
      <div class="body">
        ${body}
      </div>
      <div class="divider"></div>
      <div class="footer">
        <p>&copy; ${YEAR} ${APP_NAME}. All rights reserved.</p>
        <p>This is an automated message — please do not reply to this email.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}
