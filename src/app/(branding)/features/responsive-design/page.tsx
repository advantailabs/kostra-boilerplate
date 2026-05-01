import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Responsive Design | Kostra Next.js Boilerplate',
  description:
    'Kostra is built mobile-first with Tailwind CSS — fully responsive layouts, dark mode by default, accessible component patterns, and smooth animations via Framer Motion.',
  keywords:
    'responsive Next.js design, Tailwind CSS boilerplate, dark mode SaaS, mobile-first Next.js, accessible React components',
  openGraph: {
    title: 'Responsive Design | Kostra Next.js Boilerplate',
    description:
      'Mobile-first Tailwind CSS layouts, dark mode, accessible components, and Framer Motion animations — built into Kostra.',
    type: 'article',
    url: 'https://kostra.io/features/responsive-design',
  },
  alternates: { canonical: 'https://kostra.io/features/responsive-design' },
  robots: { index: true, follow: true },
};

export default function ResponsiveDesignPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: 'Responsive Design in Kostra',
            description:
              'How Kostra implements mobile-first responsive design with Tailwind CSS, dark mode, and accessible components.',
            url: 'https://kostra.io/features/responsive-design',
            isPartOf: { '@type': 'WebSite', name: 'Kostra', url: 'https://kostra.io' },
          }),
        }}
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/features" className="hover:text-gray-300 transition-colors">Features</Link>
            <span>/</span>
            <span className="text-gray-300">Responsive Design</span>
          </nav>

          <div className="mb-16">
            <div className="mb-4 inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-300">
              UI / UX
            </div>
            <h1 className="mb-6 text-4xl font-light tracking-tight text-white sm:text-5xl md:text-6xl">
              Responsive{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Design
              </span>
            </h1>
            <p className="max-w-2xl text-lg text-gray-400 sm:text-xl">
              Kostra's UI is built mobile-first with Tailwind CSS — every layout adapts cleanly
              from 320px to 4K. Dark mode is the default, components are accessible, and
              Framer Motion handles smooth page transitions and micro-animations.
            </p>
          </div>

          {/* What's included */}
          <section className="mb-16">
            <h2 className="mb-8 text-2xl font-light text-white">Design system</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                {
                  icon: '📱',
                  title: 'Mobile-first layouts',
                  description: 'Every page is designed for small screens first. Grid layouts, navigation, tables, and cards all adapt with Tailwind responsive prefixes (sm:, md:, lg:).',
                },
                {
                  icon: '🌑',
                  title: 'Dark mode',
                  description: 'Kostra\'s colour system is dark-first — deep blacks, muted grays, and accent gradients. The palette is defined in tailwind.config.ts for easy customisation.',
                },
                {
                  icon: '♿',
                  title: 'Accessible components',
                  description: 'Semantic HTML, ARIA labels on interactive elements, keyboard navigation support, and sufficient colour contrast ratios across all UI components.',
                },
                {
                  icon: '✨',
                  title: 'Framer Motion animations',
                  description: 'Smooth entrance animations, hover states, and page transitions via Framer Motion. Motion respects prefers-reduced-motion for accessibility.',
                },
                {
                  icon: '🎨',
                  title: 'Atomic Design components',
                  description: 'Components follow Atomic Design: atoms (buttons, inputs, badges), molecules (form groups, cards), and organisms (navigation, dashboard panels).',
                },
                {
                  icon: '🔧',
                  title: 'Tailwind configuration',
                  description: 'Custom colour tokens, extended spacing, typography scale, and border radius presets defined in tailwind.config.ts — easy to theme for your brand.',
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="mb-3 text-2xl">{item.icon}</div>
                  <h3 className="mb-2 font-medium text-white">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Tech */}
          <section className="mb-16 rounded-2xl border border-white/10 bg-white/5 p-8">
            <h2 className="mb-6 text-lg font-medium text-white">Frontend stack</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: 'CSS framework', value: 'Tailwind CSS v3' },
                { label: 'Animation library', value: 'Framer Motion' },
                { label: 'Icon library', value: 'Remixicon (@remixicon/react)' },
                { label: 'Component pattern', value: 'Atomic Design' },
                { label: 'Colour mode', value: 'Dark-first' },
                { label: 'Breakpoints', value: 'sm (640px) · md (768px) · lg (1024px) · xl (1280px)' },
              ].map((item) => (
                <div key={item.label}>
                  <dt className="text-xs text-gray-500">{item.label}</dt>
                  <dd className="mt-1 text-sm font-medium text-white">{item.value}</dd>
                </div>
              ))}
            </div>
          </section>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-purple-950/40 to-black p-8 text-center">
            <h2 className="mb-2 text-xl font-medium text-white">Beautiful UI. Ready to customise.</h2>
            <p className="mb-6 text-gray-400">Responsive design is the foundation of Kostra's complete SaaS kit — get the full stack.</p>
            <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90">
              Get Kostra →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
