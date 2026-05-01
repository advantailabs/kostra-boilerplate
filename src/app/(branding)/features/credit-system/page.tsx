import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Credit System | Kostra Next.js Boilerplate',
  description:
    'Kostra includes a built-in usage-based billing credit system: credit ledger, balance tracking, transaction history, and Stripe-powered top-ups. Perfect for AI APIs and metered SaaS products.',
  keywords:
    'credit system Next.js, usage-based billing, credit ledger, SaaS credits, Stripe credits, metered billing boilerplate',
  openGraph: {
    title: 'Credit System | Kostra Next.js Boilerplate',
    description:
      'Usage-based billing with credit ledger, balance tracking, transaction history, and Stripe top-ups — built into Kostra.',
    type: 'article',
    url: 'https://kostra.io/features/credit-system',
  },
  alternates: { canonical: 'https://kostra.io/features/credit-system' },
  robots: { index: true, follow: true },
};

export default function CreditSystemPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: 'Credit System in Kostra',
            description:
              'How Kostra implements usage-based billing with a credit ledger, Stripe top-ups, and transaction history.',
            url: 'https://kostra.io/features/credit-system',
            isPartOf: { '@type': 'WebSite', name: 'Kostra', url: 'https://kostra.io' },
          }),
        }}
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-[400px] w-[600px] -translate-y-1/4 rounded-full bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/features" className="hover:text-gray-300 transition-colors">Features</Link>
            <span>/</span>
            <span className="text-gray-300">Credit System</span>
          </nav>

          <div className="mb-16">
            <div className="mb-4 inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-300">
              Billing
            </div>
            <h1 className="mb-6 text-4xl font-light tracking-tight text-white sm:text-5xl md:text-6xl">
              Credit{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                System
              </span>
            </h1>
            <p className="max-w-2xl text-lg text-gray-400 sm:text-xl">
              Usage-based billing without the complexity. Kostra's credit system gives users a
              balance they spend on your product features — topped up via Stripe, tracked in a
              Prisma ledger, and visible in a transaction history dashboard.
            </p>
          </div>

          {/* How it works */}
          <section className="mb-16">
            <h2 className="mb-8 text-2xl font-light text-white">How it works</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                {
                  icon: '💰',
                  title: 'Credit balance',
                  description:
                    'Each user has a credits field on their Prisma User record. Credits are an integer representing units your product defines — API calls, exports, generations, etc.',
                },
                {
                  icon: '📋',
                  title: 'Transaction ledger',
                  description:
                    'Every credit change — purchase, spend, refund, or admin grant — writes a CreditTransaction record with amount, type, description, and timestamp.',
                },
                {
                  icon: '💳',
                  title: 'Stripe top-ups',
                  description:
                    'Users purchase credit bundles via Stripe one-time payments. On payment_intent.succeeded, the webhook handler credits the user\'s balance atomically.',
                },
                {
                  icon: '🔍',
                  title: 'Transaction history',
                  description:
                    'A paginated transaction history page lets users see every credit movement. Admins can also view and adjust balances from the admin dashboard.',
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

          {/* Capabilities */}
          <section className="mb-16">
            <h2 className="mb-8 text-2xl font-light text-white">Capabilities</h2>
            <ul className="space-y-4">
              {[
                'Atomic credit deduction with balance checks — no negative balances by default',
                'Admin credit grant from the user management panel without touching the DB',
                'Zustand credits store keeps the UI balance in sync without extra API calls',
                'GET /api/credits returns current balance and recent transaction slice',
                'Credit history page at /app/credit-history with pagination and filters',
                'Transaction types: PURCHASE, SPEND, REFUND, ADMIN_GRANT, BONUS',
                'Stripe webhook maps payment intent metadata to the correct user credit bundle',
                'Easily extensible — add new spend events by calling the credit service in your API routes',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-400">
                  <span className="mt-1 text-emerald-400">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Use cases */}
          <section className="mb-16">
            <h2 className="mb-6 text-2xl font-light text-white">Built for these products</h2>
            <div className="flex flex-wrap gap-3">
              {['AI generation tools', 'API access platforms', 'Document processing SaaS', 'Image editing apps', 'Data export tools', 'Content generation', 'SMS/Email send platforms', 'Video processing'].map((uc) => (
                <span key={uc} className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-400">
                  {uc}
                </span>
              ))}
            </div>
          </section>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-950/40 to-black p-8 text-center">
            <h2 className="mb-2 text-xl font-medium text-white">
              Usage-based billing, ready on day one
            </h2>
            <p className="mb-6 text-gray-400">
              The credit system is one piece of Kostra's complete SaaS stack — auth, billing, storage, and admin included.
            </p>
            <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90">
              Get Kostra →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
