export const siteConfig = {
  name: 'Peon',
  url: 'https://peon.sh',
  description: 'Your Personal AI Peon',
  baseLinks: {
    home: '/app/search',
    settings: {
      users: '/app/settings/users',
    },
    onboarding: '/onboarding',
  },
};

export type SiteConfigType = typeof siteConfig;
