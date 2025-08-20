import { POST } from '../route';

jest.mock('@/lib/s3', () => ({
  generatePresignedUrl: jest.fn().mockResolvedValue({
    presignedUrl: 'https://example.com/presigned',
    key: 'key',
    bucket: 'bucket',
  }),
}));

jest.mock('@/services/repositories/user', () => ({
  getUserByClerkId: jest.fn().mockResolvedValue({ id: 1, plan: 'PRO' }),
}));

jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn().mockResolvedValue({ userId: 'clerk_1' }),
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
});
