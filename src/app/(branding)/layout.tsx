// import { Inter } from 'next/font/google';
import React from 'react';

import { MinimalFooter } from '@/components/branding/minimal-footer';
import { ModernNavigation } from '@/components/branding/modern-navigation';
import type { Metadata } from 'next';
import '../globals.css';

// Font is available but not currently used in this layout
// const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Peon - Your Personal AI Peon',
  description:
    'Transform scattered information into actionable intelligence with AI-powered knowledge assistants. Trusted by hundreds of organizations worldwide.',
  keywords:
    'knowledge management, AI assistants, document organization, enterprise search, intelligent automation',
  authors: [{ name: 'Peon Team' }],
  openGraph: {
    title: 'Peon - Your Personal AI Peon',
    description:
      'Transform scattered information into actionable intelligence with AI-powered knowledge assistants.',
    type: 'website',
    url: 'https://peon.ai',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Peon - Your Personal AI Peon',
    description:
      'Transform scattered information into actionable intelligence with AI-powered knowledge assistants.',
  },
};

export default function BrandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black">
      <ModernNavigation />
      <main className="relative pt-12 md:pt-16">{children}</main>
      <MinimalFooter />
      <script
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `
            // Prevent browser scroll restoration on page load
            if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
              window.history.scrollRestoration = 'manual';
            }
          `,
        }}
      />
    </div>
  );
}
