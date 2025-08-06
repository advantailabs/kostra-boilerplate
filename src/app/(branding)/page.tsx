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
  robots: {
    index: true,
    follow: true,
  },
};

// Static generation - this page will be pre-rendered at build time
export async function generateStaticParams() {
  return [{}]; // This will statically generate the homepage
}

// This function enables SSG for the homepage - pre-rendered at build time
export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      <>
        {/* Structured Data for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Peon - Your Personal AI Assistant',
              description:
                'Transform scattered information into actionable intelligence with AI-powered knowledge assistants.',
              url: 'https://peon.sh',
              sameAs: ['https://peon.sh/privacy-policy', 'https://peon.sh/terms-of-services'],
              mainEntity: {
                '@type': 'SoftwareApplication',
                name: 'Peon',
                applicationCategory: 'BusinessApplication',
                description:
                  'AI-powered knowledge assistants for enterprise document organization and intelligent automation.',
                operatingSystem: 'Web Browser',
                offers: {
                  '@type': 'Offer',
                  price: '0',
                  priceCurrency: 'USD',
                  description: 'Free tier available with 100 credits',
                },
              },
              publisher: {
                '@type': 'Organization',
                name: 'Peon',
                url: 'https://peon.sh',
              },
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://peon.sh/app?q={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />

        {/* Navigation hints for crawlers */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: 'https://peon.sh',
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Privacy Policy',
                  item: 'https://peon.sh/privacy-policy',
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: 'Terms of Service',
                  item: 'https://peon.sh/terms-of-services',
                },
              ],
            }),
          }}
        />

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
    </div>
  );
}
