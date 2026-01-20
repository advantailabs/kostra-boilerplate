/**
 * Email driver types and interfaces
 */

import type { TestEmailDriverConfig } from './drivers/test';

export interface EmailMessage {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

export interface EmailDriver {
  send(message: EmailMessage): Promise<void | unknown>;
}

export type EmailDriverType = 'aws-ses' | 'resend' | 'test' | 'demo';

export type OtpPurpose = 'SIGNUP' | 'PASSWORD_RESET';

export interface EmailConfig {
  driver: EmailDriverType;
  awsSes?: {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
  };
  resend?: {
    apiKey: string;
  };
  test?: TestEmailDriverConfig;
}
