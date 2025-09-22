import { AwsSesDriver } from './drivers/aws-ses';
import { ResendDriver } from './drivers/resend';
import { EmailConfig, EmailDriver, EmailDriverType } from './types';

export class EmailDriverFactory {
  static create(config: EmailConfig): EmailDriver {
    switch (config.driver) {
      case 'aws-ses':
        if (!config.awsSes) {
          throw new Error('AWS SES configuration is required');
        }
        return new AwsSesDriver(config.awsSes);

      case 'resend':
        if (!config.resend) {
          throw new Error('Resend configuration is required');
        }
        return new ResendDriver(config.resend);

      default:
        throw new Error(`Unsupported email driver: ${config.driver}`);
    }
  }
}

// Singleton instance
let emailDriver: EmailDriver | null = null;

export function getEmailDriver(): EmailDriver {
  if (!emailDriver) {
    const config: EmailConfig = {
      driver: (process.env.EMAIL_DRIVER as EmailDriverType) || 'resend',
      awsSes:
        process.env.EMAIL_DRIVER === 'aws-ses'
          ? {
              region: process.env.AWS_REGION || '',
              accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            }
          : undefined,
      resend:
        process.env.EMAIL_DRIVER === 'resend'
          ? {
              apiKey: process.env.RESEND_API_KEY || '',
            }
          : undefined,
    };

    emailDriver = EmailDriverFactory.create(config);
  }

  return emailDriver;
}
