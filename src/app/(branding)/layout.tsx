// import { Inter } from 'next/font/google';
import React from 'react';

import { MinimalFooter } from '@/components/branding/minimal-footer';
import { ModernNavigation } from '@/components/branding/modern-navigation';
import { SignInModalProvider } from '@/providers/SignInModalProvider';
import type { Metadata } from 'next';
import '../globals.css';

// Font is available but not currently used in this layout
// const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Kostra - Your Personal AI Kostra',
  description:
    'Transform scattered information into actionable intelligence with AI-powered knowledge assistants. Trusted by hundreds of organizations worldwide.',
  keywords:
    'knowledge management, AI assistants, document organization, enterprise search, intelligent automation',
  authors: [{ name: 'Kostra Team' }],
  openGraph: {
    title: 'Kostra - Your Personal AI Kostra',
    description:
      'Transform scattered information into actionable intelligence with AI-powered knowledge assistants.',
    type: 'website',
    url: 'https://kostra.ai',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kostra - Your Personal AI Kostra',
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
    <SignInModalProvider>
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
    </SignInModalProvider>
  );
}
