import { getEmailDriver } from '@/lib/email/factory';
import { getOTPEmailTemplate } from '@/lib/email/templates';
import { OtpPurpose } from '@/lib/prisma/generated/client';

export interface SendEmailData {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export interface SendOTPEmailData {
  email: string;
  otp: string;
  purpose: OtpPurpose;
}

export class EmailService {
  /**
   * Send email using the configured email driver
   */
  static async sendEmail(data: SendEmailData): Promise<void> {
    const emailDriver = getEmailDriver();

    const fromEmail = process.env.FROM_EMAIL || 'noreply@kostra.io';
    const fromEmailName = process.env.FROM_EMAIL_NAME || 'Kostra';

    await emailDriver.send({
      to: data.to,
      from: `${fromEmailName} <${fromEmail}>`,
      subject: data.subject,
      html: data.html,
      text: data.text,
    });
  }

  /**
   * Send OTP verification email
   */
  static async sendOTPEmail(data: SendOTPEmailData): Promise<void> {
    const { email, otp, purpose } = data;

    // Convert purpose to template format
    const templatePurpose = purpose.toLowerCase().replace('_', '-') as 'signup' | 'password-reset';

    const templateData = {
      otp,
      purpose: templatePurpose,
    };

    const { subject, html, text } = getOTPEmailTemplate(templateData);

    await this.sendEmail({
      to: email,
      subject,
      html,
      text,
    });
  }
}
