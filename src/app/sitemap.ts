import { MetadataRoute } from 'next';
import { siteConfig } from './siteConfig';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const currentDate = new Date().toISOString();

  // Use priorities from site config
  const { high: HIGH_PRIORITY, medium: MEDIUM_PRIORITY, low: LOW_PRIORITY } =
    siteConfig.sitemap.priorities;

  // Use change frequencies from site config
  const { weekly: WEEKLY, monthly: MONTHLY, yearly: YEARLY } =
    siteConfig.sitemap.changeFrequencies;

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

    // Features hub - high value SEO page
    {
      url: `${baseUrl}/features`,
      lastModified: currentDate,
      changeFrequency: MONTHLY,
      priority: HIGH_PRIORITY,
    },

    // Feature sub-pages
    {
      url: `${baseUrl}/features/modern-authentication`,
      lastModified: currentDate,
      changeFrequency: MONTHLY,
      priority: MEDIUM_PRIORITY,
    },
    {
      url: `${baseUrl}/features/multi-auth-system`,
      lastModified: currentDate,
      changeFrequency: MONTHLY,
      priority: MEDIUM_PRIORITY,
    },
    {
      url: `${baseUrl}/features/stripe-integration`,
      lastModified: currentDate,
      changeFrequency: MONTHLY,
      priority: MEDIUM_PRIORITY,
    },
    {
      url: `${baseUrl}/features/credit-system`,
      lastModified: currentDate,
      changeFrequency: MONTHLY,
      priority: MEDIUM_PRIORITY,
    },
    {
      url: `${baseUrl}/features/file-management`,
      lastModified: currentDate,
      changeFrequency: MONTHLY,
      priority: MEDIUM_PRIORITY,
    },
    {
      url: `${baseUrl}/features/file-management-system`,
      lastModified: currentDate,
      changeFrequency: MONTHLY,
      priority: MEDIUM_PRIORITY,
    },
    {
      url: `${baseUrl}/features/blog-and-categories`,
      lastModified: currentDate,
      changeFrequency: MONTHLY,
      priority: MEDIUM_PRIORITY,
    },
    {
      url: `${baseUrl}/features/lead-management`,
      lastModified: currentDate,
      changeFrequency: MONTHLY,
      priority: MEDIUM_PRIORITY,
    },
    {
      url: `${baseUrl}/features/email-campaigns-templates`,
      lastModified: currentDate,
      changeFrequency: MONTHLY,
      priority: MEDIUM_PRIORITY,
    },
    {
      url: `${baseUrl}/features/resend-aws-ses-integration`,
      lastModified: currentDate,
      changeFrequency: MONTHLY,
      priority: MEDIUM_PRIORITY,
    },
    {
      url: `${baseUrl}/features/user-management`,
      lastModified: currentDate,
      changeFrequency: MONTHLY,
      priority: MEDIUM_PRIORITY,
    },
    {
      url: `${baseUrl}/features/responsive-design`,
      lastModified: currentDate,
      changeFrequency: MONTHLY,
      priority: MEDIUM_PRIORITY,
    },

    // For Developers page
    {
      url: `${baseUrl}/nextjs-boilerplate-features`,
      lastModified: currentDate,
      changeFrequency: MONTHLY,
      priority: HIGH_PRIORITY,
    },

    // Comparison / informational pages - high SEO value
    {
      url: `${baseUrl}/best-nextjs-boilerplates`,
      lastModified: currentDate,
      changeFrequency: MONTHLY,
      priority: HIGH_PRIORITY,
    },

    // Competitor alternative pages
    {
      url: `${baseUrl}/shipfast-alternative`,
      lastModified: currentDate,
      changeFrequency: MONTHLY,
      priority: HIGH_PRIORITY,
    },
    {
      url: `${baseUrl}/supastarter-alternative`,
      lastModified: currentDate,
      changeFrequency: MONTHLY,
      priority: HIGH_PRIORITY,
    },
    {
      url: `${baseUrl}/wasp-alternative`,
      lastModified: currentDate,
      changeFrequency: MONTHLY,
      priority: HIGH_PRIORITY,
    },
    {
      url: `${baseUrl}/makerkit-alternative`,
      lastModified: currentDate,
      changeFrequency: MONTHLY,
      priority: HIGH_PRIORITY,
    },

    // Head-to-head comparison pages
    {
      url: `${baseUrl}/T3-Stack-vs-Kostra`,
      lastModified: currentDate,
      changeFrequency: MONTHLY,
      priority: MEDIUM_PRIORITY,
    },
    {
      url: `${baseUrl}/bedrock-vs-Kostra`,
      lastModified: currentDate,
      changeFrequency: MONTHLY,
      priority: MEDIUM_PRIORITY,
    },
    {
      url: `${baseUrl}/saasbold-vs-Kostra`,
      lastModified: currentDate,
      changeFrequency: MONTHLY,
      priority: MEDIUM_PRIORITY,
    },
    {
      url: `${baseUrl}/other-Nextjs-Boilerplates-vs-Kostra`,
      lastModified: currentDate,
      changeFrequency: MONTHLY,
      priority: LOW_PRIORITY,
    },
  ];
}
