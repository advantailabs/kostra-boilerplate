export const siteConfig = {
  name: 'Peon',
  url: 'https://peon.sh',
  description: 'Your Personal AI Peon',
  baseLinks: {
    home: '/app',
    blogs: '/app/blogs',
    categories: '/app/categories',
    settings: {
      users: '/app/settings/users',
      general: '/app/settings/general',
      billing: '/app/settings/billing',
    },
    onboarding: '/onboarding',
    privacy: '/privacy-policy',
    terms: '/terms-of-services',
    customizations: '/customizations',
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
