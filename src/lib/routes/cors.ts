/**
 * CORS handling logic
 */

import { ALLOWED_ORIGINS } from '@/lib/constants/cors';
import { NextRequest, NextResponse } from 'next/server';

export const CORS_OPTIONS = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-ID',
} as const;

/**
 * Apply CORS headers to the response
 */
export function applyCorsHeaders(request: NextRequest, response: NextResponse): NextResponse {
  const origin = request.headers.get('origin') ?? '';

  if (ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  Object.entries(CORS_OPTIONS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

/**
 * Handle CORS preflight requests
 */
export function handleCorsPreflightRequest(request: NextRequest): NextResponse | null {
  if (request.method !== 'OPTIONS') return null;

  const origin = request.headers.get('origin') ?? '';
  const preflightHeaders = {
    ...(ALLOWED_ORIGINS.includes(origin) && {
      'Access-Control-Allow-Origin': origin,
    }),
    ...CORS_OPTIONS,
  };

  return NextResponse.json({}, { headers: preflightHeaders });
}
