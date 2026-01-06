import { AwsSesDriver, ResendDriver, TestDriver } from './drivers';
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

      case 'demo':
      case 'test':
        console.log('in Test/Demo branch');
        return new TestDriver(); // This Driver does nothing, no email is sent, but no error is thrown either

      default:
        throw new Error(`Unsupported email driver: ${config.driver}`);
    }
  }
}

// Singleton instance
let emailDriver: EmailDriver | null = null;

export function getEmailDriver(): EmailDriver {
  const isTest = process.env.TEST_MODE === 'true';
  const isDemo = process.env.IS_DEMO === 'true';
  if (!emailDriver) {
    const config: EmailConfig = {
      driver: isDemo
        ? 'demo'
        : isTest
          ? 'test'
          : (process.env.EMAIL_DRIVER as EmailDriverType) || 'resend',
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
      test: isTest ? {} : undefined,
    };

    emailDriver = EmailDriverFactory.create(config);
  }

  return emailDriver;
}
