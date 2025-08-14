import { clerkMiddleware } from '@clerk/nextjs/server';
import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

// Types
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | null;
const ROLES_LIST = ['ADMIN', 'USER'] as const;

type UserRole = (typeof ROLES_LIST)[number];

interface MethodAccess {
  [key: string]: UserRole[];
}

interface RouteConfig {
  path: string;
  methods: HttpMethod[];
  exact: boolean;
  accessTo?: MethodAccess;
}

const { ADMIN, USER } = ROLES_LIST.reduce(
  (acc, role) => {
    acc[role] = role;
    return acc;
  },
  {} as Record<UserRole, UserRole>
);

// Constants
const ALLOWED_ORIGINS = ['https://www.advant.xyz', 'https://advant.xyz', 'http://localhost:3000'];

const CORS_OPTIONS = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-ID',
} as const;

const PUBLIC_ROUTES: RouteConfig[] = [
  { path: '/', methods: [null], exact: true },
  { path: '/privacy-policy', methods: [null], exact: false },
  { path: '/sitemap.xml', methods: [null], exact: false },
  { path: '/terms-of-services', methods: [null], exact: false },
  { path: '/customizations', methods: [null], exact: false },
  { path: '/api/webhooks/clerk', methods: [null], exact: false },
  { path: '/api/webhooks/stripe', methods: [null], exact: false },
  { path: '/api/auth', methods: [null], exact: false },
  {
    path: '/api/onboard',
    methods: ['POST'],
    exact: false,
    accessTo: {
      POST: [ADMIN, USER],
    },
  },
  // Chat API routes - require authentication
  { path: '/api/personas', methods: ['GET', 'POST', 'PUT', 'DELETE'], exact: false },
  { path: '/api/threads', methods: ['GET', 'POST', 'PUT', 'DELETE'], exact: false },
  { path: '/api/threads/', methods: ['POST'], exact: false }, // messages endpoint
  { path: '/api/files', methods: ['GET', 'POST', 'PUT', 'DELETE'], exact: false },
  { path: '/api/knowledge-bases', methods: ['GET', 'POST', 'PUT', 'DELETE'], exact: false },
] as const;

// Helper functions
function matchRoute(path: string, route: RouteConfig): boolean {
  return route.exact ? path === route.path : path.startsWith(route.path);
}

function isMethodAllowed(method: string, allowedMethods: HttpMethod[]): boolean {
  return allowedMethods.some(allowed => allowed === null || allowed === method);
}

/**
 * Checks if a request is for a public route
 */
function isPublicRoute(request: Request): boolean {
  const url = new URL(request.url);
  const path = url.pathname;
  const { method } = request;

  return PUBLIC_ROUTES.some(
    route => matchRoute(path, route) && isMethodAllowed(method, route.methods)
  );
}

/**
 * Apply CORS headers to the response
 */
function applyCorsHeaders(request: NextRequest, response: NextResponse): NextResponse {
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
function handleCorsPreflightRequest(request: NextRequest): NextResponse | null {
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

function checkAccess(path: string, method: string, userRole: UserRole): boolean {
  const route = PUBLIC_ROUTES.find(route => matchRoute(path, route));

  if (!route) return false;

  // If the method is in the public methods list, it's accessible
  if (route.methods.includes(method as HttpMethod)) {
    return true;
  }

  // Check if the method has role-based access control
  if (route.accessTo && route.accessTo[method]) {
    return route.accessTo[method].includes(userRole);
  }

  return false;
}

async function verifyJWT(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

/**
 * Check if a user has admin privileges
 */
async function checkUserRoleStatus(request: NextRequest): Promise<UserRole | null> {
  const authHeader = request.headers.get('x-custom-token');
  const token = authHeader?.replace('Bearer ', '');
  if (token) {
    const decoded = await verifyJWT(token);
    if (decoded && typeof decoded.role === 'string') {
      const role = decoded.role.toUpperCase() as UserRole;
      return ROLES_LIST.includes(role) ? role : null;
    }
  }
  return null;
}

// Main middleware
const middleware = clerkMiddleware(
  async (auth, request: NextRequest) => {
    const preflightResponse = handleCorsPreflightRequest(request);
    if (preflightResponse) return preflightResponse;

    const url = new URL(request.url);
    const userRole = await checkUserRoleStatus(request);

    // Only protect non-public routes that don't require specific role access
    if (!isPublicRoute(request)) {
      await auth.protect();
    }

    // Check if the route requires specific role access
    const requiresRoleAccess = PUBLIC_ROUTES.some(
      route => matchRoute(url.pathname, route) && route.accessTo?.[request.method]
    );

    if (requiresRoleAccess) {
      if (!userRole) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }

      const hasAccess = checkAccess(url.pathname, request.method, userRole);
      if (!hasAccess) {
        return NextResponse.json(
          {
            error: 'You do not have sufficient privileges to perform this action',
          },
          { status: 403 }
        );
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
