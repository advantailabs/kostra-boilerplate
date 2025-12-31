import { getAuthUser, JWT_KEY, JWTPayload } from '@/lib/auth/jwt';
import {
  applyCorsHeaders,
  checkAccess,
  findMatchingRoute,
  handleCorsPreflightRequest,
  isPublicRoute,
  isRouteConfigured,
  requiresRoleAccess,
} from '@/lib/routes';
import { NextRequest, NextResponse } from 'next/server';
import { UserRole } from './lib/prisma/generated/enums';
import { forbiddenResponse } from './lib/utils/response/response';

// Middleware is now called Proxy
// https://nextjs.org/docs/app/getting-started/proxy#proxy
const proxy = async (request: NextRequest) => {
  const preflightResponse = handleCorsPreflightRequest(request);
  if (preflightResponse) return preflightResponse;

  const { pathname: path } = new URL(request.url);
  const { method } = request;

  let authUser: JWTPayload | null = null;
  let userRole: UserRole | null = null;

  try {
    authUser = await getAuthUser(request);
    if (authUser) {
      userRole = authUser.role.toUpperCase() as UserRole;
    }
  } catch (error) {
    console.error('Auth error:', error);
  }

  // Check if route is configured
  const isConfigured = isRouteConfigured(path);
  if (!isConfigured) {
    const response = NextResponse.json(
      { error: 'Route not found', message: 'This route is not configured' },
      { status: 404 }
    );
    return applyCorsHeaders(request, response);
  }

  const isPublic = isPublicRoute(request);
  const matchedRoute = findMatchingRoute(path);
  const needsRoleAccess = requiresRoleAccess(matchedRoute, method);

  // Only protect non-public routes, but check if method allows public access
  if (!isPublic && !authUser) {
    // Check if this method allows public access (empty array in accessTo)
    const methodAccess =
      matchedRoute?.accessTo?.[
        method as Exclude<'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH', null>
      ];
    const isPublicMethod = methodAccess && methodAccess.length === 0;

    // If method is not public, return appropriate response
    if (!isPublicMethod) {
      // For API routes, return JSON error instead of redirect
      if (path.startsWith('/api/')) {
        const response = forbiddenResponse();
        response.cookies.delete(JWT_KEY || 'auth-token');
        return applyCorsHeaders(request, response);
      }
      // For page routes, redirect to login
      const response = NextResponse.redirect(new URL('/', request.url));
      response.cookies.delete(JWT_KEY || 'auth-token');
      return response;
    }
  }

  // For non-public routes, check role access
  if (!isPublic && needsRoleAccess) {
    // Check if this method allows public access (empty array in accessTo)
    const methodAccess =
      matchedRoute?.accessTo?.[
        method as Exclude<'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH', null>
      ];
    const isPublicMethod = methodAccess && methodAccess.length === 0;

    // If method is not public, ensure the user is authenticated
    if (!isPublicMethod && !authUser) {
      // For API routes, return JSON error instead of redirect
      if (path.startsWith('/api/')) {
        const response = forbiddenResponse();
        response.cookies.delete(JWT_KEY || 'auth-token');
        return applyCorsHeaders(request, response);
      }
      // For page routes, redirect to login
      const response = NextResponse.redirect(new URL('/', request.url));
      response.cookies.delete(JWT_KEY || 'auth-token');
      return response;
    }

    // If method requires authentication, check role access
    if (!isPublicMethod && authUser) {
      const effectiveRole = userRole || 'USER';
      const hasAccess = checkAccess(path, method, effectiveRole);

      if (!hasAccess) {
        if (path.startsWith('/api/')) {
          const response = forbiddenResponse();
          return applyCorsHeaders(request, response);
        }

        const response = NextResponse.redirect(new URL('/', request.url));
        return response;
      }
    }
  }

  // Create response with user ID in headers if user is authenticated
  const response = NextResponse.next();

  if (authUser?.userId) {
    response.headers.set('x-user-id', authUser.userId.toString());
  }

  return applyCorsHeaders(request, response);
};

export default proxy;

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!monitoring|_next/static|_next/image|favicon.ico|favicon/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|webmanifest)$).*)',
  ],
};
