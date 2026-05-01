import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Other Next.js Boilerplates vs Kostra | Complete Comparison',
  description:
    'How does Kostra compare to other Next.js boilerplates? We cover create-next-app, SaaS Pegasus, and other popular starters — and show what sets Kostra apart.',
  keywords:
    'Next.js boilerplate comparison, other Next.js starters vs Kostra, create-next-app vs Kostra, Next.js SaaS starter comparison 2026',
  openGraph: {
    title: 'Other Next.js Boilerplates vs Kostra | Complete Comparison',
    description:
      'How Kostra compares to create-next-app, SaaS Pegasus, and other popular Next.js starters — features, pricing, and which to choose.',
    type: 'article',
    url: 'https://kostra.io/other-Nextjs-Boilerplates-vs-Kostra',
  },
  alternates: { canonical: 'https://kostra.io/other-Nextjs-Boilerplates-vs-Kostra' },
  robots: { index: true, follow: true },
};

const others = [
  {
    name: 'create-next-app',
    type: 'Framework starter',
    price: 'Free',
    summary: 'The official Next.js scaffold. Gives you a blank Next.js app with TypeScript and Tailwind options. You build 100% of your product from scratch.',
    kostraWins: ['Billing', 'Auth', 'File management', 'Admin', 'Email', 'Blog', 'Credits', 'Lead management'],
    theyWin: ['Zero cost', 'Maximum flexibility', 'No opinions'],
  },
  {
    name: 'next-saas-stripe-starter',
    type: 'Open source starter',
    price: 'Free (GitHub)',
    summary: 'A community open source Next.js + Stripe starter. Covers auth and basic billing, but lacks file management, admin dashboard, credit system, and email templates.',
    kostraWins: ['File management', 'Credit system', 'Admin dashboard', 'Email templates', 'Blog CMS', 'Lead management'],
    theyWin: ['Free', 'Open source', 'Good starting point'],
  },
  {
    name: 'SaaS Pegasus (Django)',
    type: 'Django SaaS template',
    price: '$249+',
    summary: "A Django-based SaaS boilerplate — not Next.js. If you need a Python backend with Django, Pegasus is excellent. If your stack is Next.js, it's not a match.",
    kostraWins: ['Native Next.js', 'TypeScript end-to-end', 'React ecosystem', 'Vercel deployment'],
    theyWin: ['Python/Django backend', 'Multi-tenancy', 'Mature Django ecosystem'],
  },
  {
    name: 'Divjoy',
    type: 'No-code generator',
    price: '$199 one-time',
    summary: 'A generator that creates a customised Next.js or CRA app via a UI. Quick to start but the generated code is harder to maintain and extend than hand-crafted boilerplate.',
    kostraWins: ['Hand-crafted clean code', 'File management', 'Credit system', 'Admin dashboard', 'Lead management'],
    theyWin: ['Visual customisation before download', 'Multiple framework outputs'],
  },
];

export default function OtherNextjsBoilerplatesVsKostraPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Other Next.js Boilerplates vs Kostra',
            description: 'How Kostra compares to create-next-app, SaaS Pegasus, next-saas-stripe-starter, and Divjoy.',
            url: 'https://kostra.io/other-Nextjs-Boilerplates-vs-Kostra',
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
              Comprehensive comparison
            </div>
            <h1 className="mb-6 text-4xl font-light tracking-tight text-white sm:text-5xl md:text-6xl">
              Other Next.js Boilerplates{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                vs Kostra
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-400 sm:text-xl">
              Beyond Shipfast, T3, and Supastarter — here's how Kostra compares to other
              popular Next.js starters and SaaS templates you might be considering.
            </p>
          </div>

          {/* What Kostra includes (reminder) */}
          <section className="mb-16 rounded-2xl border border-white/10 bg-white/5 p-8">
            <h2 className="mb-6 text-lg font-medium text-white">What Kostra ships</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                '🔐 Google OAuth + Email/Password + OTP auth',
                '💳 Stripe subscriptions + one-time payments + webhooks',
                '📁 S3/R2 file management with pre-signed URL uploads',
                '💰 Credit system with ledger + Stripe top-ups',
                '✍️ Blog CMS with rich-text editor + categories',
                '📬 Lead management with admin inbox + status tracking',
                '👥 Admin user management with roles + soft delete',
                '📧 Email with Resend + AWS SES factory drivers',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-gray-300">
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Individual comparisons */}
          <section className="mb-16 space-y-8">
            <h2 className="text-2xl font-light text-white">Individual comparisons</h2>
            {others.map((other) => (
              <div key={other.name} className="rounded-2xl border border-white/10 bg-white/5 p-8">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-medium text-white">{other.name}</h3>
                    <p className="text-sm text-gray-500">{other.type}</p>
                  </div>
                  <span className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-gray-300">
                    {other.price}
                  </span>
                </div>
                <p className="mb-6 text-sm text-gray-400">{other.summary}</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-emerald-400">
                      Kostra has (they don't)
                    </h4>
                    <ul className="space-y-1">
                      {other.kostraWins.map((w) => (
                        <li key={w} className="flex items-center gap-2 text-sm text-gray-400">
                          <span className="text-emerald-400">+</span> {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                      They have (Kostra doesn't)
                    </h4>
                    <ul className="space-y-1">
                      {other.theyWin.map((w) => (
                        <li key={w} className="flex items-center gap-2 text-sm text-gray-400">
                          <span className="text-gray-500">+</span> {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Summary */}
          <section className="mb-16 rounded-2xl border border-white/10 bg-white/5 p-8">
            <h2 className="mb-4 text-xl font-medium text-white">The pattern across all comparisons</h2>
            <p className="mb-4 text-gray-400">
              Most Next.js boilerplates cover the basics — auth and billing — and leave the rest to you. That means you're spending weeks building file management, email systems, admin dashboards, and credit systems before you can ship your actual product.
            </p>
            <p className="text-gray-400">
              Kostra is built on the assumption that every production SaaS needs all of these layers. We built them once, made them production-grade, and packaged them for $150 — so you can start at feature-complete instead of zero.
            </p>
          </section>

          <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 to-black p-8 text-center">
            <h2 className="mb-2 text-xl font-medium text-white">Start at feature-complete.</h2>
            <p className="mb-6 text-gray-400">$150 one-time — auth, billing, storage, email, blog, leads, and admin. No subscriptions. You own the code.</p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90">
                Get Kostra →
              </Link>
              <Link href="/best-nextjs-boilerplates" className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-white/40">
                See our full boilerplate comparison
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
