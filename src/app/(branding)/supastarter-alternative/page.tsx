import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Supastarter Alternative: Kostra Next.js Boilerplate',
  description:
    'Compare Kostra vs Supastarter. Get a production-ready Next.js SaaS boilerplate with full Stripe billing, authentication, and file management built in.',
  keywords:
    'Supastarter alternative, alternative to Supastarter, Kostra vs Supastarter, Next.js boilerplate without Supabase',
  openGraph: {
    title: 'Supastarter Alternative: Kostra Next.js Boilerplate',
    description:
      'Kostra vs Supastarter — full Stripe billing, multi-auth, file management, and admin dashboard without Supabase lock-in.',
    type: 'article',
    url: 'https://kostra.io/supastarter-alternative',
  },
  alternates: { canonical: 'https://kostra.io/supastarter-alternative' },
  robots: { index: true, follow: true },
};

const comparison = [
  { feature: 'Database', kostra: 'Any PostgreSQL provider (Prisma)', supastarter: 'Supabase only' },
  { feature: 'Auth', kostra: 'Google OAuth + Email/Password + OTP (custom JWT)', supastarter: 'Supabase Auth (RLS-based)' },
  { feature: 'File management', kostra: 'S3/Cloudflare R2 with pre-signed URLs', supastarter: 'Supabase Storage' },
  { feature: 'Stripe billing', kostra: 'Subscriptions + one-time + webhooks + portal', supastarter: 'Subscriptions' },
  { feature: 'Credit system', kostra: 'Full credit ledger + Stripe top-ups', supastarter: 'Not included' },
  { feature: 'Admin dashboard', kostra: 'User management, roles, credits, soft delete', supastarter: 'Basic admin' },
  { feature: 'Blog CMS', kostra: 'Rich-text editor + categories + SEO slugs', supastarter: 'Not included' },
  { feature: 'Lead management', kostra: 'Contact forms + admin inbox + status tracking', supastarter: 'Not included' },
  { feature: 'Multi-tenancy', kostra: 'Single-tenant (extendable)', supastarter: 'Built-in org support' },
  { feature: 'i18n', kostra: 'Not included (easy to add)', supastarter: 'Built-in' },
  { feature: 'Price', kostra: '$150 one-time', supastarter: '€149+ one-time' },
];

export default function SupastarterAlternativePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Supastarter Alternative: Kostra Next.js Boilerplate',
            description: 'Comparison of Kostra and Supastarter as Next.js SaaS boilerplates.',
            url: 'https://kostra.io/supastarter-alternative',
            isPartOf: { '@type': 'WebSite', name: 'Kostra', url: 'https://kostra.io' },
          }),
        }}
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16">
            <div className="mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-400">
              Supastarter Alternative
            </div>
            <h1 className="mb-6 text-4xl font-light tracking-tight text-white sm:text-5xl md:text-6xl">
              Looking for a{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Supastarter alternative?
              </span>
            </h1>
            <p className="max-w-2xl text-lg text-gray-400 sm:text-xl">
              Supastarter is excellent if you're committed to the Supabase ecosystem. But if you
              want to host your own PostgreSQL, use any cloud provider, have file management on
              S3/R2, and a credit system — Kostra is the better fit.
            </p>
          </div>

          {/* Key difference */}
          <section className="mb-16">
            <h2 className="mb-8 text-2xl font-light text-white">The fundamental difference</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="mb-3 font-medium text-white">Supastarter</h3>
                <p className="text-sm text-gray-400">
                  Tightly coupled to Supabase for auth (RLS policies), storage (Supabase Storage), and database (Supabase Postgres). Excellent if Supabase is your long-term platform — migration away from Supabase requires significant rework.
                </p>
              </div>
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6">
                <h3 className="mb-3 font-medium text-white">Kostra</h3>
                <p className="text-sm text-gray-400">
                  Uses standard PostgreSQL via Prisma — host on Railway, Supabase, PlanetScale, Neon, or your own server. Auth uses custom JWT with HttpOnly cookies. Storage goes to any S3-compatible provider. No platform lock-in.
                </p>
              </div>
            </div>
          </section>

          {/* Key advantages */}
          <section className="mb-16">
            <h2 className="mb-8 text-2xl font-light text-white">Where Kostra has the edge</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: '🔓', title: 'No Supabase dependency', desc: 'Bring your own PostgreSQL. Kostra works with any provider — Supabase, Neon, Railway, self-hosted.' },
                { icon: '📁', title: 'S3/R2 file management', desc: 'Full file lifecycle with pre-signed URL uploads. Supastarter uses Supabase Storage.' },
                { icon: '💰', title: 'Credit system', desc: 'Usage-based billing out of the box. Supastarter doesn\'t include a credit ledger.' },
                { icon: '✍️', title: 'Blog CMS', desc: 'Rich-text blog with categories and SEO slugs. Supastarter doesn\'t include a blog module.' },
                { icon: '📬', title: 'Lead management', desc: 'Contact form, status tracking, admin notes. Supastarter doesn\'t include CRM features.' },
                { icon: '📧', title: 'Flexible email', desc: 'Resend or AWS SES via factory-pattern drivers — one env var swap.' },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="mb-2 text-2xl">{item.icon}</div>
                  <h3 className="mb-1 font-medium text-white">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* When to choose Supastarter */}
          <section className="mb-16 rounded-2xl border border-white/10 bg-white/5 p-8">
            <h2 className="mb-4 text-lg font-medium text-white">When Supastarter is the better choice</h2>
            <ul className="space-y-3">
              {[
                'You\'re all-in on Supabase and want native RLS-based security at the row level',
                'You need built-in multi-tenancy with organization support',
                'You need i18n (internationalization) from day one',
                'Your team already knows Supabase and wants to move fast on that stack',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-400">
                  <span className="mt-1 text-gray-500">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Comparison table */}
          <section className="mb-16">
            <h2 className="mb-6 text-2xl font-light text-white">Full comparison</h2>
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Feature</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-emerald-300">Kostra</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Supastarter</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {comparison.map((row) => (
                    <tr key={row.feature}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-400">{row.feature}</td>
                      <td className="px-6 py-4 text-sm text-emerald-300">{row.kostra}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{row.supastarter}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 to-black p-8 text-center">
            <h2 className="mb-2 text-xl font-medium text-white">No lock-in. Full stack. $150.</h2>
            <p className="mb-6 text-gray-400">Kostra gives you a complete SaaS foundation with your own database and storage — no platform dependency.</p>
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
