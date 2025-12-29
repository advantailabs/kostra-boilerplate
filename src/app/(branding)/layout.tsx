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
  title: 'Kostra - Modern Next.js SaaS Boilerplate',
  description:
    'A comprehensive Next.js SaaS boilerplate with authentication, file management, billing, and scalable architecture. Built with TypeScript, Tailwind CSS, and best practices.',
  keywords:
    'Next.js boilerplate, SaaS template, TypeScript, Tailwind CSS, authentication, file management, Stripe integration, Prisma, React, web development',
  authors: [{ name: 'Kostra Team' }],
  openGraph: {
    title: 'Kostra - Modern Next.js SaaS Boilerplate',
    description:
      'A comprehensive Next.js SaaS boilerplate with authentication, file management, billing, and scalable architecture.',
    type: 'website',
    url: 'https://kostra.io',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kostra - Modern Next.js SaaS Boilerplate',
    description:
      'A comprehensive Next.js SaaS boilerplate with authentication, file management, billing, and scalable architecture.',
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
