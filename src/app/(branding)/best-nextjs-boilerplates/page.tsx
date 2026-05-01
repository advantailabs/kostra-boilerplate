import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Best Next.js Boilerplates in 2026 | Kostra',
  description:
    'Compare the best Next.js boilerplates in 2026. We break down features, pricing, and tech stacks so you can pick the right SaaS starter kit for your project.',
  keywords:
    'best Next.js boilerplates 2026, Next.js SaaS starter, Next.js boilerplate comparison, SaaS kit Next.js, Next.js starter template 2026',
  openGraph: {
    title: 'Best Next.js Boilerplates in 2026 | Kostra',
    description:
      'Compare the best Next.js boilerplates in 2026. Features, pricing, and tech stacks compared so you can pick the right SaaS starter.',
    type: 'article',
    url: 'https://kostra.io/best-nextjs-boilerplates',
  },
  alternates: { canonical: 'https://kostra.io/best-nextjs-boilerplates' },
  robots: { index: true, follow: true },
};

const boilerplates = [
  {
    rank: 1,
    name: 'Kostra',
    tagline: 'Production-ready. Everything included.',
    url: 'https://kostra.io',
    price: '$150 one-time',
    stack: 'Next.js 14, Prisma, PostgreSQL, Stripe, S3/R2, Resend/SES',
    verdict: 'Best for founders who want a complete SaaS stack — auth, billing, file storage, email, blog, and admin — without piecing it together themselves.',
    highlights: [
      'Multi-auth: Google OAuth + email/password with OTP',
      'Full Stripe billing (subscriptions + one-time + webhooks)',
      'S3/R2 file management with pre-signed URL uploads',
      'Built-in blog & categories CMS',
      'Lead capture with admin inbox',
      'Credit system for usage-based billing',
      'Admin dashboard with user management',
      'Email system with Resend + AWS SES drivers',
    ],
    badge: '⭐ Editor\'s Pick',
    highlight: true,
  },
  {
    rank: 2,
    name: 'Shipfast',
    tagline: 'Ship fast, opinionated stack.',
    url: 'https://shipfa.st',
    price: '$169–$299',
    stack: 'Next.js, Stripe, MongoDB/Supabase, Mailgun',
    verdict: 'Popular starting point with good documentation, but uses MongoDB by default (not Postgres) and lacks file management and a credit system.',
    highlights: [
      'Google + Magic Link auth',
      'Stripe subscriptions',
      'Basic email with Mailgun',
      'SEO blog component',
      'No file management',
      'No credit/usage system',
    ],
    badge: null,
    highlight: false,
  },
  {
    rank: 3,
    name: 'Supastarter',
    tagline: 'Supabase-native SaaS kit.',
    url: 'https://supastarter.dev',
    price: '€149+',
    stack: 'Next.js, Supabase, Prisma, Stripe',
    verdict: 'Excellent if you\'re committed to Supabase. Tightly coupled to the Supabase ecosystem — switching to a different Postgres provider requires significant rework.',
    highlights: [
      'Supabase auth + RLS',
      'Stripe billing',
      'Multi-tenancy support',
      'i18n built in',
      'Tightly coupled to Supabase',
      'No file management',
    ],
    badge: null,
    highlight: false,
  },
  {
    rank: 4,
    name: 'Makerkit',
    tagline: 'Multi-tenant SaaS foundation.',
    url: 'https://makerkit.dev',
    price: '$149–$299',
    stack: 'Next.js, Supabase or Firebase, Stripe',
    verdict: 'Strong multi-tenancy support. High learning curve due to layered abstractions. Best for teams building team-based SaaS products.',
    highlights: [
      'Multi-tenant orgs',
      'Supabase or Firebase backend',
      'Stripe billing',
      'Extensive documentation',
      'Complex setup',
      'No native file management',
    ],
    badge: null,
    highlight: false,
  },
  {
    rank: 5,
    name: 'T3 Stack',
    tagline: 'Typesafe, bring your own features.',
    url: 'https://create.t3.gg',
    price: 'Free & open source',
    stack: 'Next.js, tRPC, Prisma, Tailwind, NextAuth',
    verdict: 'Great starting point for type-safety. Not a SaaS kit — you build everything above the framework yourself. No billing, file management, or admin included.',
    highlights: [
      'Fully type-safe via tRPC',
      'Open source, free',
      'NextAuth for auth',
      'No billing',
      'No file management',
      'No admin dashboard',
    ],
    badge: null,
    highlight: false,
  },
];

export default function BestNextjsBoilerplatesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Best Next.js Boilerplates in 2026',
            description:
              'Comparison of the best Next.js SaaS boilerplates in 2026 — features, pricing, and tech stacks.',
            url: 'https://kostra.io/best-nextjs-boilerplates',
            datePublished: '2026-01-01',
            dateModified: '2026-05-01',
            author: { '@type': 'Organization', name: 'Kostra' },
            isPartOf: { '@type': 'WebSite', name: 'Kostra', url: 'https://kostra.io' },
          }),
        }}
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl">
          {/* Hero */}
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-400">
              Updated May 2026
            </div>
            <h1 className="mb-6 text-4xl font-light tracking-tight text-white sm:text-5xl md:text-6xl">
              Best Next.js Boilerplates{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                in 2026
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-400 sm:text-xl">
              We compared the top Next.js SaaS starter kits on features, pricing, and architecture.
              Here's the honest breakdown — so you can pick the right one for your project.
            </p>
          </div>

          {/* Quick comparison table */}
          <section className="mb-16">
            <h2 className="mb-6 text-2xl font-light text-white">Quick comparison</h2>
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-4 py-4 text-left text-sm font-medium text-gray-300">Boilerplate</th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-gray-300">Price</th>
                    <th className="px-4 py-4 text-center text-sm font-medium text-gray-300">Auth</th>
                    <th className="px-4 py-4 text-center text-sm font-medium text-gray-300">Billing</th>
                    <th className="px-4 py-4 text-center text-sm font-medium text-gray-300">Files</th>
                    <th className="px-4 py-4 text-center text-sm font-medium text-gray-300">Admin</th>
                    <th className="px-4 py-4 text-center text-sm font-medium text-gray-300">Blog</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {[
                    { name: 'Kostra', price: '$150', auth: true, billing: true, files: true, admin: true, blog: true, highlight: true },
                    { name: 'Shipfast', price: '$169+', auth: true, billing: true, files: false, admin: false, blog: true, highlight: false },
                    { name: 'Supastarter', price: '€149+', auth: true, billing: true, files: false, admin: true, blog: false, highlight: false },
                    { name: 'Makerkit', price: '$149+', auth: true, billing: true, files: false, admin: true, blog: false, highlight: false },
                    { name: 'T3 Stack', price: 'Free', auth: '△', billing: false, files: false, admin: false, blog: false, highlight: false },
                  ].map((row) => (
                    <tr key={row.name} className={row.highlight ? 'bg-indigo-950/20' : ''}>
                      <td className="px-4 py-4 font-medium text-white">
                        {row.name}
                        {row.highlight && <span className="ml-2 text-xs text-indigo-400">← you're here</span>}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-400">{row.price}</td>
                      {(['auth', 'billing', 'files', 'admin', 'blog'] as const).map((key) => (
                        <td key={key} className="px-4 py-4 text-center text-sm">
                          {row[key] === true ? <span className="text-emerald-400">✓</span> : row[key] === '△' ? <span className="text-amber-400">△</span> : <span className="text-gray-600">–</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-gray-600">△ = partial / requires additional setup</p>
          </section>

          {/* Detailed reviews */}
          <section className="mb-16 space-y-8">
            <h2 className="text-2xl font-light text-white">Detailed reviews</h2>
            {boilerplates.map((bp) => (
              <div
                key={bp.name}
                className={`rounded-2xl border p-8 ${bp.highlight ? 'border-indigo-500/40 bg-indigo-950/20' : 'border-white/10 bg-white/5'}`}
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm text-gray-600">#{bp.rank}</span>
                      <h3 className="text-xl font-medium text-white">{bp.name}</h3>
                      {bp.badge && (
                        <span className="rounded-full bg-indigo-500/20 px-3 py-0.5 text-xs text-indigo-300">
                          {bp.badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-400">{bp.tagline}</p>
                  </div>
                  <span className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-gray-300">
                    {bp.price}
                  </span>
                </div>

                <div className="mb-4 rounded-lg bg-black/30 px-4 py-2.5">
                  <span className="text-xs text-gray-500">Stack: </span>
                  <span className="text-xs text-gray-300">{bp.stack}</span>
                </div>

                <p className="mb-4 text-sm text-gray-400">{bp.verdict}</p>

                <div className="flex flex-wrap gap-2">
                  {bp.highlights.map((h) => (
                    <span
                      key={h}
                      className={`rounded-md px-2.5 py-1 text-xs ${h.startsWith('No ') || h.toLowerCase().includes('tightly') || h.toLowerCase().includes('complex') ? 'border border-red-500/20 text-red-400/70' : 'border border-white/10 text-gray-400'}`}
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* Verdict */}
          <section className="mb-16 rounded-2xl border border-white/10 bg-white/5 p-8">
            <h2 className="mb-4 text-xl font-medium text-white">The verdict</h2>
            <p className="mb-4 text-gray-400">
              If you want a <strong className="text-white">complete SaaS kit</strong> — auth, billing, file storage, email, blog, lead management, and admin — without assembling it from multiple starters, Kostra is the strongest option at its price point.
            </p>
            <p className="mb-4 text-gray-400">
              If you're building a <strong className="text-white">team-based multi-tenant</strong> product, Makerkit has more native support for organisations. If you're a Supabase-first shop, Supastarter is worth considering.
            </p>
            <p className="text-gray-400">
              T3 Stack is best when you want full control and are happy to build every product layer yourself — it's a framework foundation, not a SaaS kit.
            </p>
          </section>

          {/* CTA */}
          <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 to-black p-8 text-center">
            <h2 className="mb-2 text-xl font-medium text-white">Ready to start with Kostra?</h2>
            <p className="mb-6 text-gray-400">One-time payment of $150 — full source code, no recurring fees, no vendor lock-in.</p>
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
