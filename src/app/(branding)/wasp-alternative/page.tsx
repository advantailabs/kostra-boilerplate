import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Wasp Alternative for Next.js SaaS Development | Kostra',
  description:
    'Need a Wasp alternative? Kostra is a production-ready Next.js boilerplate with authentication, Stripe billing, and 50+ built-in features ready to ship.',
  keywords:
    'Wasp alternative, alternative to Wasp framework, Kostra vs Wasp, Next.js alternative to Wasp, SaaS boilerplate without Wasp',
  openGraph: {
    title: 'Wasp Alternative for Next.js SaaS Development | Kostra',
    description:
      'Kostra vs Wasp — production-ready Next.js boilerplate with auth, Stripe billing, file management, and admin. No custom language, no framework lock-in.',
    type: 'article',
    url: 'https://kostra.io/wasp-alternative',
  },
  alternates: { canonical: 'https://kostra.io/wasp-alternative' },
  robots: { index: true, follow: true },
};

export default function WaspAlternativePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Wasp Alternative for Next.js SaaS Development | Kostra',
            description: 'Comparison of Kostra and Wasp for Next.js SaaS development.',
            url: 'https://kostra.io/wasp-alternative',
            isPartOf: { '@type': 'WebSite', name: 'Kostra', url: 'https://kostra.io' },
          }),
        }}
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-transparent blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16">
            <div className="mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-400">
              Wasp Alternative
            </div>
            <h1 className="mb-6 text-4xl font-light tracking-tight text-white sm:text-5xl md:text-6xl">
              Looking for a{' '}
              <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                Wasp alternative?
              </span>
            </h1>
            <p className="max-w-2xl text-lg text-gray-400 sm:text-xl">
              Wasp is a novel full-stack framework with its own DSL — which means learning a
              new language and being tied to Wasp's ecosystem. Kostra gives you a complete SaaS
              foundation using standard Next.js — no new language, no lock-in, full control.
            </p>
          </div>

          {/* Core difference */}
          <section className="mb-16">
            <h2 className="mb-8 text-2xl font-light text-white">The core difference</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="mb-3 font-medium text-white">Wasp</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• Custom declarative DSL language (.wasp files)</li>
                  <li>• Compiles to a React + Node.js app</li>
                  <li>• Abstracts routing, auth, and queries via the DSL</li>
                  <li>• Open source, free to use</li>
                  <li>• Smaller ecosystem, fewer learning resources</li>
                  <li>• You must learn Wasp before you can ship</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-violet-500/30 bg-violet-950/20 p-6">
                <h3 className="mb-3 font-medium text-white">Kostra</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• Standard Next.js App Router — nothing new to learn</li>
                  <li>• TypeScript throughout with strict mode</li>
                  <li>• Auth, billing, storage, email, blog — all built in</li>
                  <li>• You own the code — fork and extend freely</li>
                  <li>• Huge Next.js ecosystem and community</li>
                  <li>• Deploy anywhere: Vercel, Railway, Docker, AWS</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Feature comparison */}
          <section className="mb-16">
            <h2 className="mb-8 text-2xl font-light text-white">Feature comparison</h2>
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Feature</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-violet-300">Kostra</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Wasp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {[
                    { feature: 'Framework', kostra: 'Next.js 14 App Router', wasp: 'Custom Wasp DSL → React + Node' },
                    { feature: 'Learning curve', kostra: 'Standard Next.js (familiar)', wasp: 'Must learn Wasp DSL first' },
                    { feature: 'Auth', kostra: 'Google OAuth + Email/OTP + JWT', wasp: 'Email/password + social (via DSL)' },
                    { feature: 'Stripe billing', kostra: 'Subscriptions + one-time + webhooks', wasp: 'Not included by default' },
                    { feature: 'File management', kostra: 'S3/R2 with full UI', wasp: 'Not included' },
                    { feature: 'Admin dashboard', kostra: 'Full user management panel', wasp: 'Not included' },
                    { feature: 'Credit system', kostra: 'Credit ledger + Stripe top-ups', wasp: 'Not included' },
                    { feature: 'Blog CMS', kostra: 'Rich-text editor + categories', wasp: 'Not included' },
                    { feature: 'Price', kostra: '$150 one-time', wasp: 'Free & open source' },
                    { feature: 'Deployment', kostra: 'Vercel, Railway, Docker, any', wasp: 'Fly.io, Railway (Wasp-specific deployment)' },
                  ].map((row) => (
                    <tr key={row.feature}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-400">{row.feature}</td>
                      <td className="px-6 py-4 text-sm text-violet-300">{row.kostra}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{row.wasp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* When Wasp is fine */}
          <section className="mb-16">
            <h2 className="mb-8 text-2xl font-light text-white">When Wasp makes sense</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="mb-3 font-medium text-white">Consider Wasp if:</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• You enjoy learning new frameworks and DSLs</li>
                  <li>• Budget is zero (Wasp is free)</li>
                  <li>• You're happy building billing, storage, and admin yourself</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-violet-500/30 bg-violet-950/20 p-6">
                <h3 className="mb-3 font-medium text-white">Choose Kostra if:</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• You already know Next.js and want to ship fast</li>
                  <li>• You need billing, file management, and admin on day one</li>
                  <li>• You want full code ownership without framework abstraction</li>
                </ul>
              </div>
            </div>
          </section>

          <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-950/40 to-black p-8 text-center">
            <h2 className="mb-2 text-xl font-medium text-white">Standard Next.js. Complete SaaS. Ship today.</h2>
            <p className="mb-6 text-gray-400">Kostra is $150 — no new language, no lock-in, production-ready on day one.</p>
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
