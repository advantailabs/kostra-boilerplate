import { generateDownloadUrl, generatePresignedUrl } from '@/services/external/aws/s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

jest.mock('@aws-sdk/s3-request-presigner');

// Mocks getBucketName so that it does not depend on environment variables during tests
jest.mock('@/services/internal/files/file-upload/file-upload-config', () => {
  const actual = jest.requireActual('@/services/internal/files/file-upload/file-upload-config');
  return {
    ...actual, // Use all actual implementations
    getBucketName: jest.fn(() => 'kostra-test-private'), // Overwrite just this one with a mock
  };
});

describe('S3 Download URL Generation', () => {
  it('should generate a valid download URL', async () => {
    // Mock the getSignedUrl function to return a predictable URL
    (getSignedUrl as jest.Mock).mockResolvedValue(
      'my-bucket.s3.us-east-1.amazonaws.com/test-bucket/test-file.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=TESTCREDENTIAL&X-Amz-Date=20240610T000000Z&X-Amz-Expires=900&X-Amz-SignedHeaders=host&X-Amz-Signature=TESTSIGNATURE'
    );

    // Mock environment variables
    process.env.R2_ACCESS_KEY_ID = 'test-access-key';
    process.env.R2_SECRET_ACCESS_KEY = 'test-secret-key';
    process.env.R2_ACCOUNT_ID = 'test-account-id';

    const bucket = 'test-bucket';
    const key = 'test-file.pdf';
    const filename = 'test-file.pdf';

    const result = await generateDownloadUrl(bucket, key, filename);

    expect(result).toHaveProperty('downloadUrl');
    expect(result).toHaveProperty('expiresAt');
    expect(result.downloadUrl).toContain('test-bucket');
    expect(result.downloadUrl).toContain('test-file.pdf');
    expect(result.expiresAt).toBeInstanceOf(Date);
  });

  it('should generate a valid Pre-Signed Upload URL', async () => {
    (getSignedUrl as jest.Mock).mockResolvedValue(
      'my-bucket.s3.us-east-1.amazonaws.com/kostra-test-private/test-file.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=TESTCREDENTIAL&X-Amz-Date=20240610T000000Z&X-Amz-Expires=900&X-Amz-SignedHeaders=host&X-Amz-Signature=TESTSIGNATURE'
    );

    const result = await generatePresignedUrl('pdf/open', 'UserDocument', 'test-file.pdf', '12345');

    expect(result).toHaveProperty('presignedUrl');
    expect(result).toHaveProperty('key');
    expect(result).toHaveProperty('bucket');

    expect(result.presignedUrl).toContain('kostra-test-private');
    expect(result.presignedUrl).toContain('test-file.pdf');
    expect(result.key).toContain('test-file.pdf');
    expect(result.bucket).toBe('kostra-test-private');
  });
});
