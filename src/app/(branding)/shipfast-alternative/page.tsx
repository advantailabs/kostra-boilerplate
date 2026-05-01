import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Shipfast Alternative: Why Developers Choose Kostra',
  description:
    'Looking for a Shipfast alternative? Kostra offers production-ready Next.js boilerplate with Stripe, auth, file uploads, and admin dashboard at $150.',
  keywords:
    'Shipfast alternative, alternative to Shipfast, Kostra vs Shipfast, Next.js SaaS boilerplate alternative',
  openGraph: {
    title: 'Shipfast Alternative: Why Developers Choose Kostra',
    description:
      'Kostra vs Shipfast — compare features, pricing, and architecture. Get production-ready Next.js with Stripe, auth, file management, and admin at $150.',
    type: 'article',
    url: 'https://kostra.io/shipfast-alternative',
  },
  alternates: { canonical: 'https://kostra.io/shipfast-alternative' },
  robots: { index: true, follow: true },
};

const comparison = [
  { feature: 'Auth providers', kostra: 'Google OAuth + Email/Password + OTP', shipfast: 'Google + Magic Link' },
  { feature: 'Database', kostra: 'PostgreSQL via Prisma', shipfast: 'MongoDB or Supabase' },
  { feature: 'Stripe billing', kostra: 'Subscriptions + one-time + webhooks + portal', shipfast: 'Subscriptions + one-time' },
  { feature: 'File management', kostra: 'S3/R2 with pre-signed URLs + drag-and-drop UI', shipfast: 'Not included' },
  { feature: 'Credit system', kostra: 'Full credit ledger + Stripe top-ups', shipfast: 'Not included' },
  { feature: 'Blog CMS', kostra: 'Rich-text editor + categories + SEO slugs', shipfast: 'Basic MDX blog component' },
  { feature: 'Lead management', kostra: 'Contact forms + admin inbox + status tracking', shipfast: 'Not included' },
  { feature: 'Admin dashboard', kostra: 'User management, credit grants, role control', shipfast: 'Not included' },
  { feature: 'Email system', kostra: 'Resend + AWS SES with factory-pattern drivers', shipfast: 'Mailgun' },
  { feature: 'Price', kostra: '$150 one-time', shipfast: '$169–$299 one-time' },
];

export default function ShipfastAlternativePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Shipfast Alternative: Why Developers Choose Kostra',
            description:
              'Comparison of Kostra and Shipfast as Next.js SaaS boilerplates.',
            url: 'https://kostra.io/shipfast-alternative',
            isPartOf: { '@type': 'WebSite', name: 'Kostra', url: 'https://kostra.io' },
          }),
        }}
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16">
            <div className="mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-400">
              Shipfast Alternative
            </div>
            <h1 className="mb-6 text-4xl font-light tracking-tight text-white sm:text-5xl md:text-6xl">
              Looking for a{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Shipfast alternative?
              </span>
            </h1>
            <p className="max-w-2xl text-lg text-gray-400 sm:text-xl">
              Shipfast is a solid starting point — but it uses MongoDB by default, lacks file
              management, has no admin dashboard, and doesn't include a credit system. Kostra
              gives you all of that, built on PostgreSQL, for $150.
            </p>
          </div>

          {/* Key differences */}
          <section className="mb-16">
            <h2 className="mb-8 text-2xl font-light text-white">Where Kostra goes further</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                { icon: '🗃️', title: 'PostgreSQL, not MongoDB', desc: 'Kostra uses Prisma + PostgreSQL — relational data, type-safe queries, and migrations. No NoSQL schema flexibility traps.' },
                { icon: '📁', title: 'File management built in', desc: 'S3/R2 file storage with pre-signed URL uploads, drag-and-drop UI, and a file browser — Shipfast doesn\'t include this.' },
                { icon: '💰', title: 'Credit system', desc: 'Usage-based billing with credit ledger, Stripe top-ups, and transaction history — not in Shipfast.' },
                { icon: '👥', title: 'Admin dashboard', desc: 'Manage users, adjust credits, change plans, and soft-delete accounts from a built-in admin panel.' },
                { icon: '📬', title: 'Lead management', desc: 'Contact form with admin inbox, status tracking, and internal notes — a lightweight CRM out of the box.' },
                { icon: '📧', title: 'Dual email drivers', desc: 'Resend or AWS SES — swap providers via a single env var. Shipfast is locked to Mailgun.' },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="mb-3 text-2xl">{item.icon}</div>
                  <h3 className="mb-2 font-medium text-white">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Comparison table */}
          <section className="mb-16">
            <h2 className="mb-6 text-2xl font-light text-white">Feature comparison</h2>
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Feature</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-indigo-300">Kostra</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Shipfast</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {comparison.map((row) => (
                    <tr key={row.feature}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-400">{row.feature}</td>
                      <td className="px-6 py-4 text-sm text-emerald-300">{row.kostra}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{row.shipfast}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Who should choose Kostra */}
          <section className="mb-16 rounded-2xl border border-white/10 bg-white/5 p-8">
            <h2 className="mb-4 text-lg font-medium text-white">Choose Kostra if you need:</h2>
            <ul className="space-y-3">
              {[
                'PostgreSQL with Prisma ORM for relational data integrity',
                'File upload and management without integrating a third-party service',
                'A credit/usage billing system alongside subscriptions',
                'An admin dashboard to manage users, credits, and plans',
                'Email provider flexibility (Resend or SES) without vendor lock-in',
                'A full contact/lead management system built in',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-400">
                  <span className="mt-1 text-indigo-400">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 to-black p-8 text-center">
            <h2 className="mb-2 text-xl font-medium text-white">More features. Lower price.</h2>
            <p className="mb-6 text-gray-400">Kostra is $150 — less than Shipfast's starting price, with file management, admin, and credits included.</p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90">
                Get Kostra — $150 →
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
