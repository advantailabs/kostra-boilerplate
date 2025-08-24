import { withSentryConfig } from '@sentry/nextjs';
/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-1c83380c5e270f0d584e576e038edc6b.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'pub-af1e06f43a504834a771308801881057.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'peon.sh',
      },
      {
        protocol: 'https',
        hostname: 'public-storage.peon.sh',
      },
      {
        protocol: 'https',
        hostname: 'private-storage.peon.sh',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },

  // Enable SSG/SSR optimizations
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },

  // Custom headers for static content caching
  async headers() {
    return [
      {
        // Apply cache headers to static pages
        source: '/(privacy|terms)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1 year cache
          },
        ],
      },
      {
        // Apply cache headers to static assets
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Apply shorter cache for landing page (SSR)
        source: '/',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400', // 1 hour browser, 24 hours CDN
          },
        ],
      },
    ];
  },

  // Optimize builds for static content
  output: 'standalone',

  // Enable compression
  compress: true,

  // PoweredBy header removal for security
  poweredByHeader: false,
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: 'advant-xi',

  project: 'peon',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: '/monitoring',

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,

  // Disable the default Sentry webpack plugins since we're using instrumentation
  disableServerWebpackPlugin: true,
  disableClientWebpackPlugin: true,
});
