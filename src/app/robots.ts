import { MetadataRoute } from 'next';
import { siteConfig } from './siteConfig';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url;

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/privacy-policy', '/terms-of-services'],
        disallow: [
          // Block API routes from being crawled
          '/api/*',
          // Block all authenticated app areas
          '/app/*',
          // Block any temporary or testing routes
          '/_next/*',
          '/.*', // Hidden files/folders
        ],
      },
      // Special rules for search engines
      {
        userAgent: 'Googlebot',
        allow: ['/', '/privacy-policy', '/terms-of-services'],
        disallow: ['/api/*', '/app/*'], // More restrictive for Google
      },
      {
        userAgent: 'Bingbot',
        allow: ['/', '/privacy-policy', '/terms-of-services'],
        disallow: ['/api/*', '/app/*'], // More restrictive for Bing
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
