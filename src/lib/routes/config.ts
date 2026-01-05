/**
 * Route configuration definitions
 */

import { ADMIN, RouteConfig, USER } from './types';

export const ALL_ROUTES: RouteConfig[] = [
  // Public landing pages
  { path: '/', isPublic: true },
  { path: '/sitemap.xml', isPublic: true },
  { path: '/robots.txt', isPublic: true },
  { path: '/privacy-policy', isPublic: true },
  { path: '/terms-of-services', isPublic: true },
  { path: '/contact', isPublic: true },
  { path: '/blog', isPublic: true },
  { path: '/blog/[slug]', isPublic: true },

  // Static files and assets (should be handled by Next.js but included for safety)
  { path: '/favicon.ico', isPublic: true },
  { path: '/favicon/[...path]', isPublic: true },
  { path: '/_next/[...path]', isPublic: true },
  { path: '/images/[...path]', isPublic: true },
  { path: '/logos/[...path]', isPublic: true },
  { path: '/screenshots/[...path]', isPublic: true },

  // Public webhooks and auth
  { path: '/api/webhooks/stripe', isPublic: true },
  { path: '/api/auth/logout', isPublic: true },
  { path: '/api/auth', isPublic: true },
  { path: '/api/auth/google/verify', isPublic: true },
  { path: '/api/auth/login', isPublic: true },
  { path: '/api/auth/signup', isPublic: true },
  { path: '/api/auth/verify-signup', isPublic: true },
  { path: '/api/auth/forgot-password', isPublic: true },
  { path: '/api/auth/reset-password', isPublic: true },
  { path: '/api/auth/resend-otp', isPublic: true },

  // Protected app pages - require authentication
  { path: '/onboarding', isPublic: false, accessTo: { GET: [USER, ADMIN] } },
  { path: '/app', isPublic: false, accessTo: { GET: [USER, ADMIN] } },

  { path: '/app/files', isPublic: false, accessTo: { GET: [USER, ADMIN] } },
  { path: '/app/packages', isPublic: false, accessTo: { GET: [ADMIN] } },
  { path: '/app/blogs', isPublic: false, accessTo: { GET: [ADMIN] } },
  { path: '/app/categories', isPublic: false, accessTo: { GET: [ADMIN] } },
  { path: '/app/contact-management', isPublic: false, accessTo: { GET: [ADMIN] } },
  { path: '/app/email-templates', isPublic: false, accessTo: { GET: [ADMIN] } },
  { path: '/app/email-campaigns', isPublic: false, accessTo: { GET: [ADMIN] } },
  { path: '/app/credit-history', isPublic: false, accessTo: { GET: [USER, ADMIN] } },
  { path: '/app/settings', isPublic: false, accessTo: { GET: [USER, ADMIN] } },
  { path: '/app/settings/general', isPublic: false, accessTo: { GET: [USER, ADMIN] } },
  { path: '/app/settings/billing', isPublic: false, accessTo: { GET: [USER, ADMIN] } },
  { path: '/app/settings/users', isPublic: false, accessTo: { GET: [USER, ADMIN] } },

  // Admin pages - require admin role
  { path: '/app/admin', isPublic: false, accessTo: { GET: [ADMIN] } },
  { path: '/app/admin/users', isPublic: false, accessTo: { GET: [ADMIN] } },

  // API routes - packages
  {
    path: '/api/packages',
    isPublic: false,
    accessTo: {
      GET: [ADMIN],
      POST: [ADMIN],
    },
  },
  {
    path: '/api/packages/[id]',
    isPublic: false,
    accessTo: {
      GET: [ADMIN],
      PATCH: [ADMIN],
      DELETE: [ADMIN],
    },
  },

  // API routes - blogs
  {
    path: '/api/blogs',
    isPublic: false,
    accessTo: {
      GET: [ADMIN],
      POST: [ADMIN],
    },
  },
  {
    path: '/api/blogs/[id]',
    isPublic: false,
    accessTo: {
      GET: [ADMIN],
      PUT: [ADMIN],
      DELETE: [ADMIN],
    },
  },

  // API routes - categories
  {
    path: '/api/categories',
    isPublic: false,
    accessTo: {
      GET: [ADMIN],
      POST: [ADMIN],
    },
  },
  {
    path: '/api/categories/[id]',
    isPublic: false,
    accessTo: {
      GET: [ADMIN],
      PUT: [ADMIN],
      DELETE: [ADMIN],
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

  // API routes - auth
  {
    path: '/api/auth',
    isPublic: false,
    accessTo: {
      GET: [USER, ADMIN],
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

  // API routes - admin
  {
    path: '/api/admin/users',
    isPublic: false,
    accessTo: {
      GET: [ADMIN],
      POST: [ADMIN],
    },
  },
  {
    path: '/api/admin/users/[id]',
    isPublic: false,
    accessTo: {
      GET: [ADMIN],
      PUT: [ADMIN],
      DELETE: [ADMIN],
    },
  },
  {
    path: '/api/admin/users/[id]/restore',
    isPublic: false,
    accessTo: {
      POST: [ADMIN],
    },
  },

  // API routes - email templates
  {
    path: '/api/email-templates',
    isPublic: false,
    accessTo: {
      GET: [ADMIN],
    },
  },
  {
    path: '/api/email-templates/[id]',
    isPublic: false,
    accessTo: {
      GET: [ADMIN],
    },
  },

  // API routes - Email Campaigns
  {
    path: '/api/campaigns',
    isPublic: false,
    accessTo: {
      GET: [ADMIN],
      POST: [ADMIN],
    },
  },
  {
    path: '/api/campaigns/[id]',
    isPublic: false,
    accessTo: {
      GET: [ADMIN],
      PUT: [ADMIN],
      DELETE: [ADMIN],
    },
  },
  {
    path: '/api/campaigns/[id]/recipients',
    isPublic: false,
    accessTo: {
      GET: [ADMIN],
    },
  },

  // API routes - campaign recipients
  {
    path: '/api/campaign-recipients',
    isPublic: false,
    accessTo: {
      GET: [ADMIN],
      POST: [ADMIN],
    },
  },
  {
    path: '/api/campaign-recipients/[id]',
    isPublic: false,
    accessTo: {
      GET: [ADMIN],
      PUT: [ADMIN],
      DELETE: [ADMIN],
    },
  },

  // API routes - campaign email sending
  {
    path: '/api/campaigns/process-scheduled',
    isPublic: true, // Public for cron job access
    accessTo: {
      POST: [], // No role required (cron job endpoint)
    },
  },

  // Legacy route for backward compatibility
  {
    path: '/api/onboard',
    isPublic: false,
    accessTo: { POST: [ADMIN, USER] },
  },

  // API routes - contact management
  { path: '/api/contact', isPublic: false, accessTo: { POST: [], GET: [ADMIN] } },
  {
    path: '/api/contact/[id]',
    isPublic: false,
    accessTo: { GET: [ADMIN], PUT: [ADMIN], DELETE: [ADMIN] },
  },
] as const;
