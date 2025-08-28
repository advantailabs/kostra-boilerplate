import { POST } from '../route';

jest.mock('@/lib/s3', () => ({
  generatePresignedUrl: jest.fn().mockResolvedValue({
    presignedUrl: 'https://example.com/presigned',
    key: 'key',
    bucket: 'bucket',
  }),
}));

jest.mock('@/lib/auth/jwt', () => ({
  getAuthUser: jest.fn().mockResolvedValue({
    userId: 1,
    plan: 'PRO',
    email: 'test@example.com',
  }),
}));

jest.mock('@/lib/prisma', () => ({
  prisma: {
    file: {
      count: jest.fn().mockResolvedValue(0),
    },
  },
}));

jest.mock('@/services/repositories/persona', () => ({
  findPersonaByUserAndId: jest.fn((userId: number, personaId: number) =>
    Promise.resolve(userId === 1 && personaId === 10 ? { id: 10 } : null)
  ),
}));

describe('Presigned URL authorization', () => {
  it('rejects PersonaLogo presign for foreign persona', async () => {
    const req = {
      json: async () => ({
        uploadPurpose: 'PersonaLogo',
        fileType: 'image/png',
        objectName: 'logo.png',
        objectId: 99, // foreign persona
      }),
    } as any;

    const res = await POST(req);
    const body = await res.json();
    expect(res.status).toBe(404);
    expect(body.message).toBe('Persona not found');
  });

  it('allows PersonaLogo presign for owned persona', async () => {
    const req = {
      json: async () => ({
        uploadPurpose: 'PersonaLogo',
        fileType: 'image/png',
        objectName: 'logo.png',
        objectId: 10,
      }),
    } as any;

    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it('rejects UserAvatar presign for different user', async () => {
    const req = {
      json: async () => ({
        uploadPurpose: 'UserAvatar',
        fileType: 'image/png',
        objectName: 'avatar.png',
        objectId: 99, // different user
      }),
    } as any;

    const res = await POST(req);
    const body = await res.json();
    expect(res.status).toBe(404);
    expect(body.message).toBe('User not found');
  });

  it('allows UserAvatar presign for current user', async () => {
    const req = {
      json: async () => ({
        uploadPurpose: 'UserAvatar',
        fileType: 'image/png',
        objectName: 'avatar.png',
        objectId: 1, // current user
      }),
    } as any;

    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it('rejects UserDocument presign for different user', async () => {
    const req = {
      json: async () => ({
        uploadPurpose: 'UserDocument',
        fileType: 'application/pdf',
        objectName: 'document.pdf',
        objectId: 99, // different user
      }),
    } as any;

    const res = await POST(req);
    const body = await res.json();
    expect(res.status).toBe(404);
    expect(body.message).toBe('User not found');
  });

  it('allows UserDocument presign for current user', async () => {
    const req = {
      json: async () => ({
        uploadPurpose: 'UserDocument',
        fileType: 'application/pdf',
        objectName: 'document.pdf',
        objectId: 1, // current user
      }),
    } as any;

    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it('allows MessageAttachment presign for any authenticated user', async () => {
    const req = {
      json: async () => ({
        uploadPurpose: 'MessageAttachment',
        fileType: 'image/jpeg',
        objectName: 'attachment.jpg',
        objectId: 123, // thread ID or any context
      }),
    } as any;

    const res = await POST(req);
    expect(res.status).toBe(200);
  });
});
