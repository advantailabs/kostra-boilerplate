import { getEmailDriver } from '@/lib/email/factory';
import { getOTPEmailTemplate } from '@/lib/email/templates';
import { OtpPurpose } from '@prisma/client';

export interface SendOTPEmailData {
  email: string;
  otp: string;
  purpose: OtpPurpose;
}

export class EmailService {
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

    const emailDriver = getEmailDriver();

    const fromEmail = process.env.FROM_EMAIL || 'noreply@peon.app';
    await emailDriver.send({
      to: email,
      from: `Peon <${fromEmail}>`,
      subject,
      html,
      text,
    });
  }
}
