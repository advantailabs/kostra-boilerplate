import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { EmailDriver, EmailMessage } from '../types';

export class AwsSesDriver implements EmailDriver {
  private client: SESClient;

  constructor(config: { region: string; accessKeyId: string; secretAccessKey: string }) {
    this.client = new SESClient({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  async send(message: EmailMessage): Promise<void> {
    const command = new SendEmailCommand({
      Source: message.from || process.env.FROM_EMAIL || 'noreply@example.com',
      Destination: {
        ToAddresses: Array.isArray(message.to) ? message.to : [message.to],
      },
      Message: {
        Subject: {
          Data: message.subject,
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: message.html,
            Charset: 'UTF-8',
          },
          Text: message.text
            ? {
                Data: message.text,
                Charset: 'UTF-8',
              }
            : undefined,
        },
      },
    });

    await this.client.send(command);
  }
}
