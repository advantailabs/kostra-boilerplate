import { CTASection } from '@/components/branding/cta-section';
import { CustomizationsSection } from '@/components/branding/customizations-section';
import { InnovativeHero } from '@/components/branding/innovative-hero';
import { MinimalFeatures } from '@/components/branding/minimal-features';
import { ScreenshotShowcase } from '@/components/branding/screenshot-showcase';
import { SecuritySection } from '@/components/branding/security-section';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Peon - Your Personal AI Assistant',
  description:
    'Transform scattered information into actionable intelligence with AI-powered knowledge assistants. Trusted by hundreds of organizations worldwide.',
  keywords:
    'knowledge management, AI assistants, document organization, enterprise search, intelligent automation',
  openGraph: {
    title: 'Peon - Your Personal AI Assistant',
    description:
      'Transform scattered information into actionable intelligence with AI-powered knowledge assistants.',
    type: 'website',
    url: 'https://peon.sh',
    images: [
      {
        url: '/screenshots/persona-chat.jpg',
        width: 1200,
        height: 630,
        alt: 'Peon AI Chat Interface',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Peon - Your Personal AI Assistant',
    description:
      'Transform scattered information into actionable intelligence with AI-powered knowledge assistants.',
    images: ['/screenshots/persona-chat.jpg'],
  },
  alternates: {
    canonical: 'https://peon.sh',
  },
};

// This function enables SSR for the homepage while keeping it fast
export default function HomePage() {
  return (
    <>
      <section id="home">
        <InnovativeHero />
      </section>

      <section id="product">
        <ScreenshotShowcase />
      </section>

      <section id="features">
        <MinimalFeatures />
      </section>

      <section id="security">
        <SecuritySection />
      </section>

      <section id="integrations">
        <CustomizationsSection />
      </section>

      <section id="cta">
        <CTASection />
      </section>
    </>
  );
}
