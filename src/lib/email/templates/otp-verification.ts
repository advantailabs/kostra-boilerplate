/**
 * Email templates for OTP verification
 */

import { siteConfig } from '@/app/siteConfig';
import { EMAIL_CONSTANTS } from '@/lib/constants/email';

export interface OTPTemplateData {
  otp: string;
  purpose: 'signup' | 'password-reset';
}

export function generateOTPEmailTemplate(data: OTPTemplateData): {
  subject: string;
  html: string;
  text: string;
} {
  const { otp, purpose } = data;

  // Destructure necessary variables from constants
  const isSignup = purpose === 'signup';
  const purposeKey = isSignup ? 'SIGNUP' : 'PASSWORD_RESET';

  const subject = EMAIL_CONSTANTS.SUBJECTS[purposeKey];
  const header = EMAIL_CONSTANTS.HEADERS[purposeKey];
  const instruction = EMAIL_CONSTANTS.INSTRUCTIONS[purposeKey];
  const disclaimer = EMAIL_CONSTANTS.DISCLAIMERS[purposeKey];

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 400px;
          margin: 20px auto;
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          padding: 20px 20px 15px 20px;
          text-align: center;
          border-bottom: 1px solid #f0f0f0;
        }
        .logo {
          text-align: center;
          margin-bottom: 15px;
        }
        .logo-container {
          display: inline-block;
          vertical-align: middle;
        }
        .logo-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: inline-block;
          vertical-align: middle;
          margin-right: 3px;
          color: white;
          font-weight: bold;
          font-size: 18px;
          text-align: center;
          line-height: 32px;
        }
        .logo-text {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          display: inline-block;
          vertical-align: middle;
        }
        .title {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }
        .content {
          padding: 20px;
          text-align: center;
        }
        .instruction {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 20px;
          line-height: 1.5;
        }
        .otp-container {
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .otp-code {
          font-size: 28px;
          font-weight: 700;
          color: #6366f1;
          letter-spacing: 6px;
          margin: 0;
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
        }
        .divider {
          height: 1px;
          background: #e5e7eb;
          margin: 20px 0;
        }
        .disclaimer {
          font-size: 12px;
          color: #9ca3af;
          text-align: center;
          margin: 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">
            <div class="logo-icon">
                <img src="${siteConfig.url}/logos/dark-symbol.png" alt="Kostra Logo" width="32" height="32" style="border-radius: 7px; display: block;"/>
            </div>
            <div class="logo-text">Kostra</div>
          </div>
          <h1 class="title">${header}</h1>
        </div>
        
        <div class="content">
          <p class="instruction">${instruction}</p>
          
          <div class="otp-container">
            <p class="otp-code">${otp}</p>
          </div>
          
          <div class="divider"></div>
          
          <p class="disclaimer">${disclaimer}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
${header}

${instruction}

Your verification code: ${otp}

${disclaimer}

---
Kostra Team
  `;

  return { subject, html, text };
}
