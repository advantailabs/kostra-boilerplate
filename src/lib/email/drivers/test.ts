import { EmailDriver, EmailMessage } from '../types';

export class TestDriver implements EmailDriver {
  // eslint-disable-next-line no-useless-constructor
  constructor(_config?: Record<string, any>) {
    // Test driver doesn't need any configuration
    // Accept config parameter for interface consistency
  }

  // eslint-disable-next-line class-methods-use-this
  async send(_message: EmailMessage): Promise<void> {
    // Simulate async operation
    await Promise.resolve();

    // In a real test environment, you might want to:
    // - Store emails in memory for assertions
    // - Throw errors to test error handling
    // - Return different responses based on test scenarios
  }
}
