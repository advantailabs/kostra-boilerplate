export const siteConfig = {
  name: 'Dashboard',
  url: 'https://tracko.advant.xyz',
  description: 'Minimalist project management tool',
  baseLinks: {
    home: '/app/search',
    settings: {
      users: '/app/settings/users',
    },
    onboarding: '/onboarding',
  },
};

export type SiteConfigType = typeof siteConfig;
