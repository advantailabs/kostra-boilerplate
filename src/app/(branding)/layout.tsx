import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import React from 'react';

import { Footer } from '@/components/branding/footer';
import { Navigation } from '@/components/branding/navigation';

import type { Metadata } from 'next';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Your Brand Name',
  description: 'Your brand description here',
};

export default function BrandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="mx-auto">
          <ThemeProvider defaultTheme="system" attribute="class">
            <header className="fixed left-0 right-0 top-0 z-50 h-16 backdrop-blur-md">
              <Navigation />
            </header>
            <main className="relative">{children}</main>

            <Footer />
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
