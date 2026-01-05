import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

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
  stripeCustomerId?: string;
}

const JWT_ALGORITHM = 'HS256';
const JWT_SECRET_RAW = process.env.JWT_SECRET;
export const JWT_KEY = process.env.JWT_KEY;

if (!JWT_SECRET_RAW) {
  throw new Error('JWT_SECRET must be set');
}
const JWT_SECRET_KEY = new TextEncoder().encode(JWT_SECRET_RAW);

export const generateJWT = async (payload: JWTPayload): Promise<string> => {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET_KEY);
};

export const verifyJWT = async (token: string): Promise<JWTPayload> => {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET_KEY, {
      algorithms: [JWT_ALGORITHM],
    });

    return payload as unknown as JWTPayload;
  } catch (error) {
    console.error(error);
    throw new Error('Invalid JWT token');
  }
};

export const extractTokenFromRequest = (request: NextRequest): string | null => {
  const token = request.cookies.get(JWT_KEY || 'auth-token')?.value;
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
    console.error(error);
    return null;
  }
};

export const getUserIdFromHeaders = (request: NextRequest): string | null => {
  const userId = request.headers.get('x-user-id');
  return userId;
};

/**
 * Sets the JWT token as an HTTP-only cookie
 * @param token - The JWT token to set
 */
export const setAuthCookie = async (token: string): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.set(JWT_KEY || 'auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 24 * 60 * 60, // 24 hours
  });
};
