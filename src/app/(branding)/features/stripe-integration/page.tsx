import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Stripe Integration | Kostra Next.js Boilerplate',
  description:
    'Production-ready Stripe billing in Kostra: subscriptions, one-time payments, customer portal, and webhook event handling — fully type-safe and wired up from day one.',
  keywords:
    'Stripe Next.js integration, SaaS billing, subscription payments, Stripe webhooks, Stripe customer portal, Next.js boilerplate',
  openGraph: {
    title: 'Stripe Integration | Kostra Next.js Boilerplate',
    description:
      'Subscriptions, one-time payments, customer portal, and webhooks — Stripe billing fully built into Kostra.',
    type: 'article',
    url: 'https://kostra.io/features/stripe-integration',
  },
  alternates: { canonical: 'https://kostra.io/features/stripe-integration' },
  robots: { index: true, follow: true },
};

export default function StripeIntegrationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: 'Stripe Integration in Kostra',
            description:
              'How Kostra implements Stripe subscriptions, one-time payments, customer portal, and webhook handling.',
            url: 'https://kostra.io/features/stripe-integration',
            isPartOf: { '@type': 'WebSite', name: 'Kostra', url: 'https://kostra.io' },
          }),
        }}
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/3 top-0 h-[400px] w-[600px] -translate-y-1/4 rounded-full bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-transparent blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/features" className="hover:text-gray-300 transition-colors">Features</Link>
            <span>/</span>
            <span className="text-gray-300">Stripe Integration</span>
          </nav>

          <div className="mb-16">
            <div className="mb-4 inline-flex items-center rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
              Billing
            </div>
            <h1 className="mb-6 text-4xl font-light tracking-tight text-white sm:text-5xl md:text-6xl">
              Stripe{' '}
              <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                Integration
              </span>
            </h1>
            <p className="max-w-2xl text-lg text-gray-400 sm:text-xl">
              Kostra includes a complete Stripe billing layer — subscriptions, one-time payments,
              customer portal, and webhook processing — all connected to your Prisma user records.
              Add your Stripe keys and billing works on day one.
            </p>
          </div>

          {/* Billing modes */}
          <section className="mb-16">
            <h2 className="mb-8 text-2xl font-light text-white">Billing modes</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                {
                  title: 'Subscriptions',
                  icon: '🔁',
                  description:
                    'Create Stripe subscription plans, attach them to users, and track plan status in the Prisma User model. Webhook events keep the database in sync automatically.',
                  endpoints: ['POST /api/billing/create-subscription', 'POST /api/billing/cancel-subscription'],
                },
                {
                  title: 'One-time payments',
                  icon: '💳',
                  description:
                    'Charge users a fixed amount for lifetime access or credit top-ups. Payments create a Stripe PaymentIntent and update user credits or plan status on success.',
                  endpoints: ['POST /api/billing/create-payment-intent', 'POST /api/billing/confirm-payment'],
                },
                {
                  title: 'Customer Portal',
                  icon: '🏦',
                  description:
                    'Redirect users to the Stripe-hosted billing portal for self-service subscription management, invoice history, and payment method updates.',
                  endpoints: ['POST /api/billing/portal-session'],
                },
                {
                  title: 'Webhook handling',
                  icon: '📡',
                  description:
                    'Stripe webhook events (payment_intent.succeeded, customer.subscription.updated, invoice.payment_failed, etc.) are verified by signature and processed in /api/webhooks/stripe.',
                  endpoints: ['POST /api/webhooks/stripe'],
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="mb-3 text-2xl">{item.icon}</div>
                  <h3 className="mb-2 font-medium text-white">{item.title}</h3>
                  <p className="mb-4 text-sm text-gray-400">{item.description}</p>
                  <div className="space-y-1">
                    {item.endpoints.map((ep) => (
                      <p key={ep} className="rounded bg-black/40 px-3 py-1.5 font-mono text-xs text-gray-500">
                        {ep}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* What's included */}
          <section className="mb-16">
            <h2 className="mb-8 text-2xl font-light text-white">What's included</h2>
            <ul className="space-y-4">
              {[
                'Stripe SDK initialised in src/lib/ — imported once, used everywhere',
                'Stripe Customer ID stored on the Prisma User record for lookup efficiency',
                'Webhook signature verification using stripe.webhooks.constructEvent()',
                'Package model in Prisma tracks plans with Stripe price IDs',
                'Admin panel shows user plan, billing status, and last payment date',
                'Credit purchases via Stripe trigger automatic credit ledger updates',
                'Failed payment webhook suspends user access gracefully',
                'Type-safe Stripe responses via the official stripe-node TypeScript SDK',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-400">
                  <span className="mt-1 text-violet-400">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Setup */}
          <section className="mb-16 rounded-2xl border border-white/10 bg-white/5 p-8">
            <h2 className="mb-4 text-lg font-medium text-white">Setup in 3 steps</h2>
            <div className="space-y-3">
              {[
                { step: '1', text: 'Add STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET to .env' },
                { step: '2', text: 'Run your Stripe CLI listener: stripe listen --forward-to localhost:3000/api/webhooks/stripe' },
                { step: '3', text: 'Create products and price IDs in your Stripe dashboard and reference them in your packages data' },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-xs font-medium text-violet-300">
                    {item.step}
                  </span>
                  <p className="text-sm text-gray-400">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-violet-950/40 to-black p-8 text-center">
            <h2 className="mb-2 text-xl font-medium text-white">
              Billing wired up. Ship faster.
            </h2>
            <p className="mb-6 text-gray-400">
              Kostra gives you Stripe billing alongside auth, file storage, and admin — all in one purchase.
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
