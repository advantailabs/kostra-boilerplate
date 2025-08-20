/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        protocol: 'https',
        hostname: 'images.clerk.dev',
      },
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
    ],
  },

  // Enable SSG/SSR optimizations
  experimental: {
    optimizePackageImports: ['@clerk/nextjs', 'framer-motion'],
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

export default nextConfig;
