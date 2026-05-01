import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Bedrock vs Kostra: Next.js Boilerplate Comparison',
  description:
    'Comparing Bedrock and Kostra for your Next.js SaaS project? See how features, pricing, and architecture stack up so you can make the right call.',
  keywords:
    'Bedrock vs Kostra, Bedrock Next.js alternative, Bedrock boilerplate comparison, Kostra vs Bedrock SaaS',
  openGraph: {
    title: 'Bedrock vs Kostra: Next.js Boilerplate Comparison',
    description:
      'Bedrock vs Kostra — features, pricing, and architecture compared for Next.js SaaS development.',
    type: 'article',
    url: 'https://kostra.io/bedrock-vs-Kostra',
  },
  alternates: { canonical: 'https://kostra.io/bedrock-vs-Kostra' },
  robots: { index: true, follow: true },
};

export default function BedrockVsKostraPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Bedrock vs Kostra: Next.js Boilerplate Comparison',
            description: 'Detailed comparison of Bedrock and Kostra as Next.js SaaS boilerplates.',
            url: 'https://kostra.io/bedrock-vs-Kostra',
            isPartOf: { '@type': 'WebSite', name: 'Kostra', url: 'https://kostra.io' },
          }),
        }}
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-1/3 top-0 h-[500px] w-[800px] -translate-y-1/4 rounded-full bg-gradient-to-bl from-stone-500/10 via-gray-500/5 to-transparent blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-400">
              Head-to-head comparison
            </div>
            <h1 className="mb-6 text-4xl font-light tracking-tight text-white sm:text-5xl md:text-6xl">
              Bedrock vs{' '}
              <span className="bg-gradient-to-r from-gray-300 to-white bg-clip-text text-transparent">
                Kostra
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-400 sm:text-xl">
              Bedrock is a well-structured Next.js boilerplate with a focus on clean architecture.
              Kostra ships more out of the box — file management, a credit system, lead management,
              and a blog CMS — while keeping the codebase equally clean.
            </p>
          </div>

          {/* Side-by-side */}
          <section className="mb-16 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="mb-1 text-lg font-medium text-white">Bedrock</h2>
              <p className="mb-4 text-xs text-gray-500">Next.js boilerplate | Subscription pricing</p>
              <p className="mb-4 text-sm text-gray-400">
                Bedrock offers a clean Next.js foundation with auth, Stripe billing, and a solid
                component library. It's a good starting point but requires you to add file
                management, credit systems, and CMS features separately.
              </p>
              <div className="space-y-1.5">
                {['✓ Clean Next.js architecture', '✓ Stripe billing', '✓ Authentication', '✓ Component library', '✗ No file management', '✗ No credit system', '✗ No blog CMS', '✗ No lead management'].map((item) => (
                  <p key={item} className={`text-sm ${item.startsWith('✓') ? 'text-gray-300' : 'text-gray-600'}`}>{item}</p>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/8 p-6">
              <h2 className="mb-1 text-lg font-medium text-white">Kostra</h2>
              <p className="mb-4 text-xs text-gray-500">$150 one-time | Complete SaaS kit</p>
              <p className="mb-4 text-sm text-gray-400">
                Kostra ships every layer of a production SaaS: auth, billing, file storage, email,
                blog, lead management, and admin dashboard — all in a single clean Next.js codebase
                you own outright.
              </p>
              <div className="space-y-1.5">
                {['✓ Google OAuth + Email/Password + OTP', '✓ Stripe subscriptions + one-time + webhooks', '✓ S3/R2 file management with UI', '✓ Admin user management panel', '✓ Credit system for usage billing', '✓ Blog CMS with rich-text editor', '✓ Lead capture management', '✓ Resend + AWS SES email drivers'].map((item) => (
                  <p key={item} className="text-sm text-gray-300">{item}</p>
                ))}
              </div>
            </div>
          </section>

          {/* Comparison table */}
          <section className="mb-16">
            <h2 className="mb-6 text-2xl font-light text-white">Full comparison</h2>
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Feature</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-200">Kostra</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Bedrock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {[
                    { feature: 'Framework', kostra: 'Next.js 14 App Router', bedrock: 'Next.js (varies by version)' },
                    { feature: 'Auth', kostra: 'Google OAuth + Email/Password + OTP (JWT)', bedrock: 'Authentication included' },
                    { feature: 'Database', kostra: 'PostgreSQL via Prisma', bedrock: 'Prisma (various DB support)' },
                    { feature: 'Stripe billing', kostra: 'Subscriptions + one-time + webhooks + portal', bedrock: 'Subscriptions' },
                    { feature: 'File management', kostra: 'S3/R2 with pre-signed URLs + drag-and-drop', bedrock: 'Not included' },
                    { feature: 'Credit system', kostra: 'Full ledger + Stripe top-ups', bedrock: 'Not included' },
                    { feature: 'Blog CMS', kostra: 'Rich-text editor + categories + SEO slugs', bedrock: 'Not included' },
                    { feature: 'Lead management', kostra: 'Contact forms + admin inbox + status', bedrock: 'Not included' },
                    { feature: 'Admin dashboard', kostra: 'User management, credits, roles, soft delete', bedrock: 'Limited' },
                    { feature: 'Email system', kostra: 'Resend + AWS SES factory drivers', bedrock: 'Email integration' },
                    { feature: 'Pricing model', kostra: '$150 one-time (you own the code)', bedrock: 'Subscription-based access' },
                  ].map((row) => (
                    <tr key={row.feature}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-400">{row.feature}</td>
                      <td className="px-6 py-4 text-sm text-gray-200">{row.kostra}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{row.bedrock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Pricing model difference */}
          <section className="mb-16 rounded-2xl border border-white/10 bg-white/5 p-8">
            <h2 className="mb-4 text-lg font-medium text-white">One-time vs. subscription pricing</h2>
            <p className="mb-4 text-gray-400">
              One key difference beyond features: Kostra is a <strong className="text-white">$150 one-time payment</strong>. You get the full source code with no ongoing cost. Some boilerplates (including some versions of Bedrock) use subscription pricing where you lose access if you stop paying.
            </p>
            <p className="text-gray-400">
              With Kostra, the code is yours. Fork it, modify it, deploy it — no license check, no renewal.
            </p>
          </section>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900 to-black p-8 text-center">
            <h2 className="mb-2 text-xl font-medium text-white">More features. Own the code. $150.</h2>
            <p className="mb-6 text-gray-400">Kostra gives you everything Bedrock offers plus file management, credits, blog, and lead management — with one-time pricing.</p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90">
                Get Kostra →
              </Link>
              <Link href="/best-nextjs-boilerplates" className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-white/40">
                Compare all boilerplates
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
