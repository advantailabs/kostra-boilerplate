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
import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

// Main middleware
const middleware = clerkMiddleware(
  async (auth, request: NextRequest) => {
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

    // Check for presence of a custom token (may be used for elevated access)
    // const hasCustomToken = !!request.headers.get('x-custom-token');
    const isPublic = isPublicRoute(request);
    const matchedRoute = findMatchingRoute(path);
    const needsRoleAccess = requiresRoleAccess(matchedRoute, method);

    // Only protect non-public routes
    if (!isPublic) {
      await auth.protect();
    }

    if (needsRoleAccess) {
      // Ensure the user is authenticated via Clerk for role-gated routes
      try {
        await auth.protect();
      } catch (e) {
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

    return applyCorsHeaders(request, NextResponse.next());
  },
  {
    afterSignInUrl: '/app/chat',
    afterSignUpUrl: '/app/chat',
  }
);

export default middleware;

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
