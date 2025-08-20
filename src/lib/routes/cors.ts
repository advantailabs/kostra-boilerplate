/**
 * CORS handling logic
 */

import { ALLOWED_ORIGINS } from '@/lib/constants/cors';
import { NextRequest, NextResponse } from 'next/server';

export const CORS_OPTIONS = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-ID, X-Custom-Token',
} as const;

/**
 * Helper function to compute dynamic CORS headers for streaming responses
 * and other non-NextResponse scenarios
 */
export function withCors(request: NextRequest, headers: Record<string, string> = {}) {
  const origin = request.headers.get('origin') ?? '';
  const corsOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : '';

  const corsHeaders: Record<string, string> = corsOrigin
    ? {
        'Access-Control-Allow-Origin': corsOrigin,
        'Access-Control-Allow-Credentials': 'true',
        Vary: 'Origin',
      }
    : {};

  return {
    ...headers,
    ...corsHeaders,
  };
}

/**
 * Apply CORS headers to the response
 */
export function applyCorsHeaders(request: NextRequest, response: NextResponse): NextResponse {
  const origin = request.headers.get('origin') ?? '';

  if (ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Vary', 'Origin');
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
    'Access-Control-Allow-Credentials': 'true',
    Vary: 'Origin',
    ...CORS_OPTIONS,
  };

  return NextResponse.json({}, { headers: preflightHeaders });
}

/**
 * Create a preflight OPTIONS response for streaming routes
 * Returns a Response object instead of NextResponse for compatibility
 */
export function createPreflightResponse(request: NextRequest): Response {
  const origin = request.headers.get('origin') ?? '';
  const corsOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : '';

  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-ID, X-Custom-Token',
  };

  if (corsOrigin) {
    headers['Access-Control-Allow-Origin'] = corsOrigin;
    headers['Access-Control-Allow-Credentials'] = 'true';
    headers.Vary = 'Origin';
  }

  return new Response(null, {
    status: 204,
    headers,
  });
}
