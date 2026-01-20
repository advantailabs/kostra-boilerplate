// Tests the Resend email driver to ensure it correctly sends emails and handles errors.
import { ResendDriver } from '@/lib/email/drivers/resend';
import { Resend } from 'resend';

// 1. Mock the entire 'resend' module
// Other imported modules using Resend will get the mocked version
jest.mock('resend');

describe('sendWelcomeEmail', () => {
  const expectedResponse = {
    from: 'Kostra <onboarding@resend.dev>',
    to: ['test@example.com'],
    subject: 'Welcome!',
    html: '<strong>Hello there!</strong>',
  };

  // 2. Clear all mocks before each test to ensure isolation
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully send an email and return data', async () => {
    // 3. Define the mock response for a successful API call
    const mockSuccessResponse = {
      id: '1234',
      from: 'onboarding@resend.dev',
      to: ['test@example.com'],
      created_at: new Date().toISOString(),
      statusCode: 200,
      data: { id: '1234' },
    };

    // Mock ( send fake ) response from Resend.emails.send
    const mockSend = jest.fn().mockResolvedValue({ data: mockSuccessResponse, error: null });

    // We access the mock instance and chain to the specific 'send' function to set its resolved value
    // Resend as jest.Mock casting necessary to avoid TS errors
    (Resend as jest.Mock).mockImplementation(() => ({
      emails: {
        send: mockSend,
      },
    }));

    // ResendDriver is mocked by jet, no need for real api key
    const resendDriver = new ResendDriver({ apiKey: 'test-api-key' });

    // 4. Call the function under test
    const result = await resendDriver.send(expectedResponse);

    // 5. Assertions
    // Check the result matches the mock data
    expect(result).toEqual(mockSuccessResponse);

    // Verify that the 'send' function was called exactly once
    expect(mockSend).toHaveBeenCalledTimes(1);

    // Verify it was called with the correct arguments
    expect(mockSend).toHaveBeenCalledWith(expectedResponse);
  });

  it('should handle API errors and throw an exception', async () => {
    const mockErrorObj = new Error('Resend API error: Failed to send email');

    (Resend as jest.Mock).mockImplementation(() => ({
      emails: {
        send: jest.fn().mockResolvedValue({
          data: null,
          error: mockErrorObj,
        }),
      },
    }));

    const resendDriver = new ResendDriver({
      apiKey: 'test-api-key',
    });

    // Test that the function rejects with the expected error
    await expect(resendDriver.send(expectedResponse)).rejects.toThrow(
      'Resend API error: Failed to send email'
    );
  });
});
