import { MetadataRoute } from 'next';
import { siteConfig } from './siteConfig';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const currentDate = new Date().toISOString();

  // Use priorities from site config
  const { high: HIGH_PRIORITY, medium: MEDIUM_PRIORITY } = siteConfig.sitemap.priorities;

  // Use change frequencies from site config
  const { weekly: WEEKLY, yearly: YEARLY } = siteConfig.sitemap.changeFrequencies;

  return [
    // Landing page - highest priority
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: WEEKLY,
      priority: HIGH_PRIORITY,
    },

    // Public marketing/legal pages - static content
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: YEARLY,
      priority: MEDIUM_PRIORITY,
    },
    {
      url: `${baseUrl}/terms-of-services`,
      lastModified: currentDate,
      changeFrequency: YEARLY,
      priority: MEDIUM_PRIORITY,
    },
  ];
}
