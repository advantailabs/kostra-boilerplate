 
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { EmailDriver, EmailMessage } from '../types';

export interface TestEmailDriverConfig {
  // Empty interface for now - can be extended in the future
  // Example future properties:
  // logLevel?: 'debug' | 'info' | 'warn' | 'error';
  // storeEmails?: boolean;
  // simulateErrors?: boolean;
}

export class TestDriver implements EmailDriver {
  constructor(_config?: TestEmailDriverConfig) {
    // Test driver doesn't need any configuration
    // Accept config parameter for interface consistency
  }

  async send(_message: EmailMessage): Promise<void> {
    // Simulate async operation
    await Promise.resolve();

    // In a real test environment, you might want to:
    // - Store emails in memory for assertions
    // - Throw errors to test error handling
    // - Return different responses based on test scenarios
  }
}
