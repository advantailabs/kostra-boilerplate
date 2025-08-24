import { SignJWT, jwtVerify } from 'jose';
import { NextRequest } from 'next/server';

const { JWT_SECRET } = process.env;
const JWT_ALGORITHM = 'HS256';

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  name: string;
  profilePicture?: string;
  isOnboarded: boolean;
  credits: number;
  plan: string;
  isOverdue: boolean;
  planExpiringAt?: string;
  googleId: string;
}

export const generateJWT = async (payload: JWTPayload): Promise<string> => {
  const secret = new TextEncoder().encode(JWT_SECRET);

  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
};

export const verifyJWT = async (token: string): Promise<JWTPayload> => {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret, {
      algorithms: [JWT_ALGORITHM],
    });

    return payload as unknown as JWTPayload;
  } catch (error) {
    throw new Error('Invalid JWT token');
  }
};

export const extractTokenFromRequest = (request: NextRequest): string | null => {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Also check for token in cookies
  const token = request.cookies.get('auth-token')?.value;
  return token || null;
};

export const getAuthUser = async (request: NextRequest): Promise<JWTPayload | null> => {
  try {
    const token = extractTokenFromRequest(request);
    if (!token) {
      return null;
    }

    return await verifyJWT(token);
  } catch (error) {
    return null;
  }
};
