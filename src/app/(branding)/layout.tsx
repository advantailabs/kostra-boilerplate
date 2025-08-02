import { Inter } from 'next/font/google';
import React from 'react';

import type { Metadata } from 'next';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

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
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white antialiased`}>{children}</body>
    </html>
  );
}
