'use client';

import { CTASection } from '@/components/branding/cta-section';
import { CustomizationsSection } from '@/components/branding/customizations-section';
import { InnovativeHero } from '@/components/branding/innovative-hero';
import { MinimalFeatures } from '@/components/branding/minimal-features';
import { SecuritySection } from '@/components/branding/security-section';

export default function HomePage() {
  return (
    <>
      <section id="product">
        <InnovativeHero />
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
