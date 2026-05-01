import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'T3 Stack vs Kostra: Which Next.js Boilerplate Wins?',
  description:
    'T3 Stack is free and flexible. Kostra is production-ready with billing, auth, and admin built in. Compare both and pick the right fit for your SaaS.',
  keywords:
    'T3 Stack vs Kostra, T3 Stack alternative, create-t3-app vs Kostra, Next.js boilerplate comparison, tRPC vs Kostra',
  openGraph: {
    title: 'T3 Stack vs Kostra: Which Next.js Boilerplate Wins?',
    description:
      'T3 Stack is free and flexible. Kostra is production-ready with billing, auth, and admin. See which fits your project.',
    type: 'article',
    url: 'https://kostra.io/T3-Stack-vs-Kostra',
  },
  alternates: { canonical: 'https://kostra.io/T3-Stack-vs-Kostra' },
  robots: { index: true, follow: true },
};

export default function T3StackVsKostraPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'T3 Stack vs Kostra: Which Next.js Boilerplate Wins?',
            description: 'Detailed comparison of T3 Stack and Kostra for SaaS development.',
            url: 'https://kostra.io/T3-Stack-vs-Kostra',
            isPartOf: { '@type': 'WebSite', name: 'Kostra', url: 'https://kostra.io' },
          }),
        }}
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-400">
              Head-to-head comparison
            </div>
            <h1 className="mb-6 text-4xl font-light tracking-tight text-white sm:text-5xl md:text-6xl">
              T3 Stack vs{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Kostra
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-400 sm:text-xl">
              T3 Stack and Kostra serve very different purposes. T3 is a type-safe framework
              starter — you build every product feature yourself. Kostra is a production SaaS
              kit — auth, billing, file storage, and admin are already built.
            </p>
          </div>

          {/* Quick verdict */}
          <section className="mb-16 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="mb-1 text-lg font-medium text-white">T3 Stack</h2>
              <p className="mb-4 text-xs text-gray-500">create-t3-app | Free, open source</p>
              <p className="mb-4 text-sm text-gray-400">
                The T3 Stack (Next.js + tRPC + Prisma + NextAuth + Tailwind) is an opinionated
                type-safe starting point. It gives you the plumbing — you build everything else.
                No billing, no file management, no admin panel included.
              </p>
              <div className="space-y-1.5">
                {['✓ Fully type-safe via tRPC', '✓ Open source, no cost', '✓ Great for custom full-stack apps', '✗ No billing system', '✗ No file management', '✗ No admin dashboard', '✗ No credit system', '✗ No blog CMS'].map((item) => (
                  <p key={item} className={`text-sm ${item.startsWith('✓') ? 'text-gray-300' : 'text-gray-600'}`}>{item}</p>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-6">
              <h2 className="mb-1 text-lg font-medium text-white">Kostra</h2>
              <p className="mb-4 text-xs text-gray-500">$150 one-time | Full SaaS kit</p>
              <p className="mb-4 text-sm text-gray-400">
                Kostra is a production SaaS boilerplate on Next.js. Auth, Stripe billing, file
                management, email, blog, lead management, and an admin panel — all built,
                tested, and ready. You ship your product, not infrastructure.
              </p>
              <div className="space-y-1.5">
                {['✓ Google OAuth + Email/Password + OTP', '✓ Stripe subscriptions + one-time + webhooks', '✓ S3/R2 file management', '✓ Admin user management panel', '✓ Credit system for usage billing', '✓ Blog CMS with categories', '✓ Lead capture management', '✓ Resend + AWS SES email'].map((item) => (
                  <p key={item} className="text-sm text-gray-300">{item}</p>
                ))}
              </div>
            </div>
          </section>

          {/* Detailed comparison */}
          <section className="mb-16">
            <h2 className="mb-6 text-2xl font-light text-white">Feature-by-feature</h2>
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Feature</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-indigo-300">Kostra</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">T3 Stack</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {[
                    { feature: 'Type safety', kostra: 'TypeScript strict mode throughout', t3: 'tRPC + TypeScript (end-to-end type safety)' },
                    { feature: 'Auth', kostra: 'Custom JWT: Google OAuth + Email/OTP', t3: 'NextAuth (multiple providers)' },
                    { feature: 'API layer', kostra: 'Next.js API route handlers (REST)', t3: 'tRPC (typed RPC)' },
                    { feature: 'Database', kostra: 'Prisma + PostgreSQL', t3: 'Prisma + any DB' },
                    { feature: 'Billing', kostra: 'Full Stripe integration', t3: 'Not included' },
                    { feature: 'File management', kostra: 'S3/R2 with pre-signed URLs', t3: 'Not included' },
                    { feature: 'Admin panel', kostra: 'User management, credits, roles', t3: 'Not included' },
                    { feature: 'Credit system', kostra: 'Credit ledger + Stripe top-ups', t3: 'Not included' },
                    { feature: 'Blog CMS', kostra: 'Rich-text + categories + SEO', t3: 'Not included' },
                    { feature: 'Email', kostra: 'Resend + SES with templates', t3: 'Not included' },
                    { feature: 'Price', kostra: '$150 one-time', t3: 'Free, open source' },
                  ].map((row) => (
                    <tr key={row.feature}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-400">{row.feature}</td>
                      <td className="px-6 py-4 text-sm text-indigo-300">{row.kostra}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{row.t3}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Verdict */}
          <section className="mb-16 rounded-2xl border border-white/10 bg-white/5 p-8">
            <h2 className="mb-4 text-xl font-medium text-white">Our verdict</h2>
            <p className="mb-4 text-gray-400">
              <strong className="text-white">T3 Stack wins</strong> if you're building a custom app where you want to design every layer yourself, you love tRPC's type safety, and you're happy spending weeks implementing billing, file storage, and admin.
            </p>
            <p className="text-gray-400">
              <strong className="text-white">Kostra wins</strong> if you're building a SaaS product and want auth, billing, file management, and admin working on day one — so you can focus on your actual product differentiators.
            </p>
          </section>

          <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 to-black p-8 text-center">
            <h2 className="mb-2 text-xl font-medium text-white">Ready to skip the infrastructure?</h2>
            <p className="mb-6 text-gray-400">Kostra gets you to feature development on day one — $150, full source, no recurring fees.</p>
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
