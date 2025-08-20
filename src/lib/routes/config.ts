/**
 * Route configuration definitions
 */

import { ADMIN, RouteConfig, USER } from './types';

export const ALL_ROUTES: RouteConfig[] = [
  // Public landing pages
  { path: '/', isPublic: true },
  { path: '/privacy-policy', isPublic: true },
  { path: '/sitemap.xml', isPublic: true },
  { path: '/robots.txt', isPublic: true },
  { path: '/terms-of-services', isPublic: true },
  { path: '/customizations', isPublic: true },

  // Static files and assets (should be handled by Next.js but included for safety)
  { path: '/favicon.ico', isPublic: true },
  { path: '/_next/[...path]', isPublic: true },
  { path: '/images/[...path]', isPublic: true },
  { path: '/logos/[...path]', isPublic: true },
  { path: '/screenshots/[...path]', isPublic: true },

  // Public webhooks and auth
  { path: '/api/webhooks/clerk', isPublic: true },
  { path: '/api/webhooks/stripe', isPublic: true },
  { path: '/api/auth', isPublic: true },

  // Protected app pages - require authentication
  { path: '/onboarding', isPublic: false, accessTo: { GET: [USER, ADMIN] } },
  { path: '/app', isPublic: false, accessTo: { GET: [USER, ADMIN] } },
  { path: '/app/chat', isPublic: false, accessTo: { GET: [USER, ADMIN] } },
  { path: '/app/chat/[threadId]', isPublic: false, accessTo: { GET: [USER, ADMIN] } },
  { path: '/app/files', isPublic: false, accessTo: { GET: [USER, ADMIN] } },
  { path: '/app/personas', isPublic: false, accessTo: { GET: [USER, ADMIN] } },
  { path: '/app/knowledge-bases', isPublic: false, accessTo: { GET: [USER, ADMIN] } },
  { path: '/app/knowledge-bases/[id]', isPublic: false, accessTo: { GET: [USER, ADMIN] } },
  { path: '/app/search', isPublic: false, accessTo: { GET: [USER, ADMIN] } },
  { path: '/app/search/results', isPublic: false, accessTo: { GET: [USER, ADMIN] } },
  { path: '/app/credit-history', isPublic: false, accessTo: { GET: [USER, ADMIN] } },
  { path: '/app/details', isPublic: false, accessTo: { GET: [USER, ADMIN] } },
  { path: '/app/settings', isPublic: false, accessTo: { GET: [USER, ADMIN] } },
  { path: '/app/settings/general', isPublic: false, accessTo: { GET: [USER, ADMIN] } },
  { path: '/app/settings/billing', isPublic: false, accessTo: { GET: [USER, ADMIN] } },
  { path: '/app/settings/users', isPublic: false, accessTo: { GET: [USER, ADMIN] } },

  // API routes - personas
  {
    path: '/api/personas',
    isPublic: false,
    accessTo: {
      GET: [USER, ADMIN],
      POST: [USER, ADMIN],
    },
  },
  {
    path: '/api/personas/[id]',
    isPublic: false,
    accessTo: {
      GET: [USER, ADMIN],
      PUT: [USER, ADMIN],
      DELETE: [USER, ADMIN],
    },
  },

  // API routes - threads
  {
    path: '/api/threads',
    isPublic: false,
    accessTo: {
      GET: [USER, ADMIN],
    },
  },
  {
    path: '/api/threads/[id]',
    isPublic: false,
    accessTo: {
      GET: [USER, ADMIN],
      DELETE: [USER, ADMIN],
    },
  },
  {
    path: '/api/threads/[id]/messages/stream',
    isPublic: false,
    accessTo: {
      POST: [USER, ADMIN],
    },
  },
  {
    path: '/api/threads/stream',
    isPublic: false,
    accessTo: {
      POST: [USER, ADMIN],
    },
  },

  // API routes - files
  {
    path: '/api/files',
    isPublic: false,
    accessTo: {
      GET: [USER, ADMIN],
      POST: [USER, ADMIN],
    },
  },
  {
    path: '/api/files/[id]',
    isPublic: false,
    accessTo: {
      GET: [USER, ADMIN],
      PUT: [USER, ADMIN],
      DELETE: [USER, ADMIN],
    },
  },
  {
    path: '/api/files/[id]/download',
    isPublic: false,
    accessTo: {
      POST: [USER, ADMIN],
    },
  },

  // API routes - file upload
  {
    path: '/api/file-upload/presigned-url',
    isPublic: false,
    accessTo: {
      POST: [USER, ADMIN],
    },
  },

  // API routes - knowledge bases
  {
    path: '/api/knowledge-bases',
    isPublic: false,
    accessTo: {
      GET: [USER, ADMIN],
      POST: [USER, ADMIN],
    },
  },
  {
    path: '/api/knowledge-bases/[id]',
    isPublic: false,
    accessTo: {
      GET: [USER, ADMIN],
      PUT: [USER, ADMIN],
      DELETE: [USER, ADMIN],
    },
  },
  {
    path: '/api/knowledge-bases/[id]/files',
    isPublic: false,
    accessTo: {
      GET: [USER, ADMIN],
      POST: [USER, ADMIN],
      DELETE: [USER, ADMIN],
    },
  },

  // API routes - search
  {
    path: '/api/search/smart',
    isPublic: false,
    accessTo: {
      POST: [USER, ADMIN],
    },
  },

  // API routes - users
  {
    path: '/api/users/data',
    isPublic: false,
    accessTo: {
      GET: [USER, ADMIN],
    },
  },
  {
    path: '/api/users/credits',
    isPublic: false,
    accessTo: {
      GET: [USER, ADMIN],
    },
  },
  {
    path: '/api/users/credits/history',
    isPublic: false,
    accessTo: {
      GET: [USER, ADMIN],
    },
  },

  // API routes - billing
  {
    path: '/api/billing/checkout',
    isPublic: false,
    accessTo: {
      POST: [USER, ADMIN],
    },
  },
  {
    path: '/api/billing/portal',
    isPublic: false,
    accessTo: {
      POST: [USER, ADMIN],
    },
  },

  // Legacy route for backward compatibility
  {
    path: '/api/onboard',
    isPublic: false,
    accessTo: { POST: [ADMIN, USER] },
  },
] as const;
