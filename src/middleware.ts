import { getAuthUser } from '@/lib/auth/jwt';
import {
  applyCorsHeaders,
  checkAccess,
  checkUserRoleStatus,
  findMatchingRoute,
  getEffectiveUserRole,
  handleCorsPreflightRequest,
  isPublicRoute,
  isRouteConfigured,
  requiresRoleAccess,
} from '@/lib/routes';
import { NextRequest, NextResponse } from 'next/server';

// Main middleware
const middleware = async (request: NextRequest) => {
  const preflightResponse = handleCorsPreflightRequest(request);
  if (preflightResponse) return preflightResponse;

  const { pathname: path } = new URL(request.url);
  const userRole = await checkUserRoleStatus(request);
  const { method } = request;

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

  let authUser: any = null;

  // Get authenticated user if available (for both public and protected routes)
  try {
    authUser = await getAuthUser(request);
  } catch (error) {
    // Ignore auth errors for public routes
    if (!isPublic) {
      const response = NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      return applyCorsHeaders(request, response);
    }
  }

  // Only protect non-public routes
  if (!isPublic && !authUser) {
    const response = NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    return applyCorsHeaders(request, response);
  }

  if (needsRoleAccess) {
    // Ensure the user is authenticated for role-gated routes
    if (!authUser) {
      const response = NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      return applyCorsHeaders(request, response);
    }

    // Default to USER role if no custom token provided
    const effectiveRole = getEffectiveUserRole(userRole);
    const hasAccess = checkAccess(path, method, effectiveRole);

    if (!hasAccess) {
      const response = NextResponse.json(
        {
          error: 'You do not have sufficient privileges to perform this action',
        },
        { status: 403 }
      );
      return applyCorsHeaders(request, response);
    }
  }

  // Create response with user ID in headers if user is authenticated
  const response = NextResponse.next();

  if (authUser?.userId) {
    response.headers.set('x-user-id', authUser.userId.toString());
  }

  return applyCorsHeaders(request, response);
};

export default middleware;

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next/static|_next/image|favicon.ico|favicon/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|webmanifest)$).*)',
  ],
};
