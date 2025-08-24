import { withSentryConfig } from '@sentry/nextjs';
/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        'utf-8-validate': 'commonjs utf-8-validate',
        'bufferutil': 'commonjs bufferutil',
      });
    }
    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  optimizePackageImports: ['framer-motion'],
};

export default nextConfig;
