import { Package } from '@/lib/prisma/generated/client';
import request from 'supertest';

export const createPackage = async (appUrl: string, authCookie: string, packageData: unknown) => {
  return request(appUrl)
    .post('/api/packages')
    .set('Cookie', authCookie)
    .send(packageData as Package);
};
