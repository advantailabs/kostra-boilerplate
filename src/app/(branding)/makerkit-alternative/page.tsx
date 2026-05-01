import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Makerkit Alternative: Production-Ready Next.js Boilerplate',
  description:
    'Kostra is a Makerkit alternative built on Next.js with Stripe billing, multi-auth, file uploads, and admin tools. Ship your SaaS faster for $150.',
  keywords:
    'Makerkit alternative, alternative to Makerkit, Kostra vs Makerkit, Next.js boilerplate simpler than Makerkit, SaaS kit without Makerkit',
  openGraph: {
    title: 'Makerkit Alternative: Production-Ready Next.js Boilerplate',
    description:
      'Kostra vs Makerkit — Stripe billing, multi-auth, file management, and admin without Makerkit\'s complex layered architecture. Ship your SaaS for $150.',
    type: 'article',
    url: 'https://kostra.io/makerkit-alternative',
  },
  alternates: { canonical: 'https://kostra.io/makerkit-alternative' },
  robots: { index: true, follow: true },
};

export default function MakerkitAlternativePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Makerkit Alternative: Production-Ready Next.js Boilerplate | Kostra',
            description: 'Comparison of Kostra and Makerkit for Next.js SaaS development.',
            url: 'https://kostra.io/makerkit-alternative',
            isPartOf: { '@type': 'WebSite', name: 'Kostra', url: 'https://kostra.io' },
          }),
        }}
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16">
            <div className="mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-400">
              Makerkit Alternative
            </div>
            <h1 className="mb-6 text-4xl font-light tracking-tight text-white sm:text-5xl md:text-6xl">
              Looking for a{' '}
              <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                Makerkit alternative?
              </span>
            </h1>
            <p className="max-w-2xl text-lg text-gray-400 sm:text-xl">
              Makerkit is feature-rich but comes with a high setup complexity and layered
              abstraction that takes time to navigate. Kostra gives you auth, billing, file
              management, and an admin panel — in a straightforward, readable Next.js codebase.
            </p>
          </div>

          {/* Complexity comparison */}
          <section className="mb-16">
            <h2 className="mb-8 text-2xl font-light text-white">Simplicity vs. complexity</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="mb-3 font-medium text-white">Makerkit</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• Multiple package monorepo structure</li>
                  <li>• Supabase or Firebase as required backends</li>
                  <li>• Extensive plugin system to navigate</li>
                  <li>• Strong multi-tenancy/org support</li>
                  <li>• Days to weeks to fully understand the structure</li>
                  <li>• $149–$299 depending on plan</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-orange-500/30 bg-orange-950/20 p-6">
                <h3 className="mb-3 font-medium text-white">Kostra</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• Single Next.js monorepo — easy to navigate</li>
                  <li>• Standard PostgreSQL — any provider</li>
                  <li>• Flat, readable service layer (no plugin system)</li>
                  <li>• Auth, billing, storage, email, blog, admin included</li>
                  <li>• Start shipping features in hours, not days</li>
                  <li>• $150 one-time payment</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Feature comparison */}
          <section className="mb-16">
            <h2 className="mb-6 text-2xl font-light text-white">Feature comparison</h2>
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Feature</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-orange-300">Kostra</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Makerkit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {[
                    { feature: 'Codebase structure', kostra: 'Single Next.js app — clear & readable', makerkit: 'Multi-package monorepo' },
                    { feature: 'Database', kostra: 'PostgreSQL via Prisma (any provider)', makerkit: 'Supabase or Firebase' },
                    { feature: 'Auth', kostra: 'Google OAuth + Email/Password + OTP', makerkit: 'Supabase Auth or Firebase Auth' },
                    { feature: 'Stripe billing', kostra: 'Subscriptions + one-time + webhooks + portal', makerkit: 'Subscriptions' },
                    { feature: 'File management', kostra: 'S3/R2 with pre-signed uploads + UI', makerkit: 'Not included' },
                    { feature: 'Credit system', kostra: 'Full credit ledger + Stripe top-ups', makerkit: 'Not included' },
                    { feature: 'Blog CMS', kostra: 'Rich-text editor + categories + SEO slugs', makerkit: 'Not included' },
                    { feature: 'Lead management', kostra: 'Contact forms + admin inbox', makerkit: 'Not included' },
                    { feature: 'Multi-tenancy', kostra: 'Single-tenant (extendable)', makerkit: 'Built-in org/team support' },
                    { feature: 'Setup time', kostra: 'Hours', makerkit: 'Days to weeks' },
                    { feature: 'Price', kostra: '$150 one-time', makerkit: '$149–$299' },
                  ].map((row) => (
                    <tr key={row.feature}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-400">{row.feature}</td>
                      <td className="px-6 py-4 text-sm text-orange-300">{row.kostra}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{row.makerkit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Who Makerkit is for */}
          <section className="mb-16">
            <h2 className="mb-8 text-2xl font-light text-white">Making the right call</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="mb-3 font-medium text-white">Choose Makerkit if:</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• You're building a multi-tenant team/org SaaS product</li>
                  <li>• You're committed to Supabase or Firebase long-term</li>
                  <li>• You want an extensive plugin ecosystem to extend from</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-orange-500/30 bg-orange-950/20 p-6">
                <h3 className="mb-3 font-medium text-white">Choose Kostra if:</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• You want a clean, readable codebase you can understand quickly</li>
                  <li>• You need file management and a credit system included</li>
                  <li>• You prefer a blog CMS and lead management out of the box</li>
                </ul>
              </div>
            </div>
          </section>

          <div className="rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-950/40 to-black p-8 text-center">
            <h2 className="mb-2 text-xl font-medium text-white">Less complexity. More features. $150.</h2>
            <p className="mb-6 text-gray-400">Kostra ships everything you need in a clean Next.js codebase — no plugin system to learn, no platform lock-in.</p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90">
                Get Kostra →
              </Link>
              <Link href="/features" className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-white/40">
                See all features
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
