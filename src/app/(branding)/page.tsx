import { ArchitectureSection } from '@/components/branding/architecture-section';
import { CTASection } from '@/components/branding/cta-section';
import { FeaturesSection } from '@/components/branding/features-section';
import { InnovativeHero } from '@/components/branding/innovative-hero';
import { MinimalFeatures } from '@/components/branding/minimal-features';
import { PricingSection } from '@/components/branding/pricing-section';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Best Next.js Boilerplate - Modern Web Application',
  description:
    'A comprehensive Next.js boilerplate with modern features, authentication, and scalable architecture. Perfect for building your next web application.',
  keywords:
    'nextjs boilerplate, web application, authentication, modern ui, scalable architecture, next.js',
  openGraph: {
    title: 'Best Next.js Boilerplate - Modern Web Application',
    description:
      'A comprehensive Next.js boilerplate with modern features, authentication, and scalable architecture.',
    type: 'website',
    url: 'https://your-domain.com',
    images: [
      {
        url: '/screenshots/dashboard.png',
        width: 1200,
        height: 630,
        alt: 'Next.js Application Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Next.js Boilerplate - Modern Web Application',
    description:
      'A comprehensive Next.js boilerplate with modern features, authentication, and scalable architecture.',
    images: ['/screenshots/dashboard.png'],
  },
  alternates: {
    canonical: 'https://your-domain.com',
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
              name: 'Best Next.js Boilerplate - Modern Web Application',
              description:
                'A comprehensive Next.js boilerplate with modern features, authentication, and scalable architecture.',
              url: 'https://your-domain.com',
              sameAs: [
                'https://your-domain.com/privacy-policy',
                'https://your-domain.com/terms-of-services',
              ],
              mainEntity: {
                '@type': 'SoftwareApplication',
                name: 'Next.js Boilerplate',
                applicationCategory: 'BusinessApplication',
                description:
                  'A comprehensive Next.js boilerplate with modern features, authentication, and scalable architecture.',
                operatingSystem: 'Web Browser',
                offers: {
                  '@type': 'Offer',
                  price: '0',
                  priceCurrency: 'USD',
                  description: 'Free tier available',
                },
              },
              publisher: {
                '@type': 'Organization',
                name: 'Next.js Boilerplate',
                url: 'https://your-domain.com',
              },
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://your-domain.com/app?q={search_term_string}',
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
                  item: 'https://your-domain.com',
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Privacy Policy',
                  item: 'https://your-domain.com/privacy-policy',
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: 'Terms of Service',
                  item: 'https://your-domain.com/terms-of-services',
                },
              ],
            }),
          }}
        />

        <section id="home">
          <InnovativeHero />
        </section>

        <section id="features">
          <MinimalFeatures />
        </section>

        <section id="features-detailed">
          <FeaturesSection />
        </section>

        <section id="architecture">
          <ArchitectureSection />
        </section>

        <section id="pricing">
          <PricingSection />
        </section>

        <section id="cta">
          <CTASection />
        </section>
      </>
    </div>
  );
}
