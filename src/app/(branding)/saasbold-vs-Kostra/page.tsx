import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'SaaSBold vs Kostra: Best Next.js SaaS Boilerplate',
  description:
    'SaaSBold vs Kostra compared. Both are Next.js SaaS boilerplates — see which one gives you more built-in features, better architecture, and faster shipping.',
  keywords:
    'SaaSBold vs Kostra, SaaSBold alternative, Kostra vs SaaSBold, Next.js SaaS boilerplate comparison 2026',
  openGraph: {
    title: 'SaaSBold vs Kostra: Best Next.js SaaS Boilerplate',
    description:
      'SaaSBold vs Kostra — which Next.js SaaS boilerplate has more built-in features and gets you to market faster?',
    type: 'article',
    url: 'https://kostra.io/saasbold-vs-Kostra',
  },
  alternates: { canonical: 'https://kostra.io/saasbold-vs-Kostra' },
  robots: { index: true, follow: true },
};

export default function SaasboldVsKostraPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'SaaSBold vs Kostra: Best Next.js SaaS Boilerplate',
            description: 'Comparison of SaaSBold and Kostra as Next.js SaaS boilerplates.',
            url: 'https://kostra.io/saasbold-vs-Kostra',
            isPartOf: { '@type': 'WebSite', name: 'Kostra', url: 'https://kostra.io' },
          }),
        }}
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/3 top-0 h-[500px] w-[800px] -translate-y-1/4 rounded-full bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-400">
              Head-to-head comparison
            </div>
            <h1 className="mb-6 text-4xl font-light tracking-tight text-white sm:text-5xl md:text-6xl">
              SaaSBold vs{' '}
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Kostra
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-400 sm:text-xl">
              Both SaaSBold and Kostra target Next.js SaaS development. The difference is in
              depth — Kostra ships a fuller backend stack including file management, a credit
              system, lead management, and an email driver system.
            </p>
          </div>

          {/* Side-by-side */}
          <section className="mb-16 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="mb-1 text-lg font-medium text-white">SaaSBold</h2>
              <p className="mb-4 text-xs text-gray-500">Next.js SaaS template</p>
              <p className="mb-4 text-sm text-gray-400">
                SaaSBold provides a Next.js SaaS starter with authentication, Stripe billing, and
                a polished UI. Useful for getting a front-end heavy SaaS off the ground quickly,
                but lighter on backend infrastructure features.
              </p>
              <div className="space-y-1.5">
                {['✓ Next.js App Router', '✓ Authentication', '✓ Stripe billing', '✓ Polished landing page UI', '✗ No file management', '✗ No credit system', '✗ No lead management CRM', '✗ Limited admin features'].map((item) => (
                  <p key={item} className={`text-sm ${item.startsWith('✓') ? 'text-gray-300' : 'text-gray-600'}`}>{item}</p>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-6">
              <h2 className="mb-1 text-lg font-medium text-white">Kostra</h2>
              <p className="mb-4 text-xs text-gray-500">$150 one-time | Complete SaaS stack</p>
              <p className="mb-4 text-sm text-gray-400">
                Kostra is built for production from day one — every layer of a real SaaS product
                is implemented: auth, billing, cloud file storage, email system, blog, lead
                management, credit system, and a full admin dashboard.
              </p>
              <div className="space-y-1.5">
                {['✓ Multi-auth: Google + Email/OTP', '✓ Stripe: subscriptions + one-time + webhooks', '✓ S3/R2 file management', '✓ Credit system + transaction history', '✓ Blog CMS + categories', '✓ Lead management + admin inbox', '✓ Resend/SES email with templates', '✓ Full admin user management'].map((item) => (
                  <p key={item} className="text-sm text-gray-300">{item}</p>
                ))}
              </div>
            </div>
          </section>

          {/* Comparison table */}
          <section className="mb-16">
            <h2 className="mb-6 text-2xl font-light text-white">Feature-by-feature</h2>
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Feature</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-blue-300">Kostra</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">SaaSBold</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {[
                    { feature: 'Auth providers', kostra: 'Google OAuth + Email/Password + OTP', saasbold: 'Google + GitHub + Email' },
                    { feature: 'Session management', kostra: 'Custom JWT in HttpOnly cookies', saasbold: 'NextAuth sessions' },
                    { feature: 'Stripe', kostra: 'Subscriptions + one-time + webhooks + portal', saasbold: 'Subscriptions + one-time' },
                    { feature: 'File management', kostra: 'S3/R2 with pre-signed URLs + UI', saasbold: 'Not included' },
                    { feature: 'Credit system', kostra: 'Full ledger + Stripe top-ups', saasbold: 'Not included' },
                    { feature: 'Blog CMS', kostra: 'Rich-text + categories + SEO slugs', saasbold: 'Basic blog component' },
                    { feature: 'Lead management', kostra: 'Contact forms + admin inbox + status', saasbold: 'Contact form only' },
                    { feature: 'Admin dashboard', kostra: 'User management, credits, roles, soft delete', saasbold: 'Limited admin view' },
                    { feature: 'Email system', kostra: 'Resend + AWS SES factory drivers', saasbold: 'Nodemailer' },
                    { feature: 'Price', kostra: '$150 one-time', saasbold: 'One-time (varies)' },
                  ].map((row) => (
                    <tr key={row.feature}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-400">{row.feature}</td>
                      <td className="px-6 py-4 text-sm text-blue-300">{row.kostra}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{row.saasbold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Verdict */}
          <section className="mb-16 rounded-2xl border border-white/10 bg-white/5 p-8">
            <h2 className="mb-4 text-xl font-medium text-white">The verdict</h2>
            <p className="mb-4 text-gray-400">
              SaaSBold gives you a clean UI starter with basic auth and billing. If that's all you need and you're planning to add file management, email, and admin features yourself — it's a reasonable option.
            </p>
            <p className="text-gray-400">
              If you want <strong className="text-white">all those layers already built</strong> — cloud file storage, a credit system, lead management CRM, a blog CMS, and an admin user panel — Kostra delivers significantly more for a comparable one-time price.
            </p>
          </section>

          <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-950/40 to-black p-8 text-center">
            <h2 className="mb-2 text-xl font-medium text-white">The fuller stack. The same price range.</h2>
            <p className="mb-6 text-gray-400">Kostra ships more infrastructure so you ship your product faster — $150, one-time.</p>
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
