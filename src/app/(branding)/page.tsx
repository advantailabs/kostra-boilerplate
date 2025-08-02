'use client';

import { InnovativeHero } from '@/components/branding/innovative-hero';
import { IntegrationsSection } from '@/components/branding/integrations-section';
import { InteractiveDemo } from '@/components/branding/interactive-demo';
import { MinimalFeatures } from '@/components/branding/minimal-features';
import { MinimalFooter } from '@/components/branding/minimal-footer';
import { ModernNavigation } from '@/components/branding/modern-navigation';
import { SecuritySection } from '@/components/branding/security-section';

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-black">
      <ModernNavigation />

      <main>
        <InnovativeHero />

        <section id="product">
          <InteractiveDemo />
        </section>

        <section id="integrations">
          <IntegrationsSection />
        </section>

        <section id="security">
          <SecuritySection />
        </section>

        <section id="features">
          <MinimalFeatures />
        </section>
      </main>

      <MinimalFooter />
    </div>
  );
}
