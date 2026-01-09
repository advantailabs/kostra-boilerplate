import { Resend } from 'resend';
import { EmailDriver, EmailMessage } from '../types';

export class ResendDriver implements EmailDriver {
  private resend: Resend;

  constructor(config: { apiKey: string }) {
    this.resend = new Resend(config.apiKey);
  }

  async send(message: EmailMessage): Promise<unknown> {
    const { data, error } = await this.resend.emails.send({
      from: message.from || 'Kostra <noreply@example.com>',
      to: Array.isArray(message.to) ? message.to : [message.to],
      subject: message.subject,
      html: message.html,
      text: message.text,
    });

    if (error) {
      throw new Error(`Resend API error: ${error.message || 'Failed to send email'}`);
    }

    // Added to test in Jest
    return data;
  }
}
