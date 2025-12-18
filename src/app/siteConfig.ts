export const siteConfig = {
  name: 'Kostra',
  url: 'https://kostra.io',
  description: 'Modern Next.js Boilerplate',
  baseLinks: {
    // Public routes
    landing: '/',

    // App routes
    home: '/app',
    blogs: '/app/blogs',
    categories: '/app/categories',
    packages: '/app/packages',
    files: '/app/files',
    creditHistory: '/app/credit-history',

    // Settings routes
    settings: {
      users: '/app/settings/users',
      general: '/app/settings/general',
      billing: '/app/settings/billing',
    },

    // Admin routes
    admin: {
      dashboard: '/app/admin',
      users: '/app/admin/users',
    },

    // Other routes
    onboarding: '/onboarding',
    privacy: '/privacy-policy',
    terms: '/terms-of-services',
  },
  sitemap: {
    // URL priorities for sitemap generation
    priorities: {
      high: 1.0, // Landing page
      medium: 0.8, // Important pages (privacy, terms, main app)
      low: 0.6, // Secondary pages (settings, etc.)
    },
    changeFrequencies: {
      daily: 'daily' as const,
      weekly: 'weekly' as const,
      monthly: 'monthly' as const,
      yearly: 'yearly' as const,
    },
  },
};

export type SiteConfigType = typeof siteConfig;
