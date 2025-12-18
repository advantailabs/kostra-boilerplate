import * as Sentry from '@sentry/nextjs';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from 'react';

import { Providers } from '@/providers/Providers';

import './globals.css';
import { siteConfig } from './siteConfig';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export function generateMetadata(): Metadata {
  const sentryData = Sentry.getTraceData();
  const filteredSentryData = Object.fromEntries(
    Object.entries(sentryData).filter(([_, value]) => value !== undefined)
  );

  return {
    metadataBase: new URL('https://kostra.io'),
    title: siteConfig.name,
    description: siteConfig.description,
    keywords: [],
    authors: [
      {
        name: 'Kostra',
        url: 'https://kostra.io',
      },
    ],
    creator: 'Kostra',
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteConfig.url,
      title: siteConfig.name,
      description: siteConfig.description,
      siteName: siteConfig.name,
    },
    icons: {
      icon: [
        { url: '/favicon/favicon.ico' },
        { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      ],
      apple: { url: '/favicon/apple-touch-icon.png' },
      other: [
        {
          rel: 'manifest',
          url: '/favicon/site.webmanifest',
        },
      ],
    },
    other: {
      ...filteredSentryData,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.className} overflow-x-hidden bg-background text-text antialiased`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
