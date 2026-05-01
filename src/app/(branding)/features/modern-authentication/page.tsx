import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Modern Authentication | Kostra Next.js Boilerplate',
  description:
    'Kostra ships with production-ready authentication: Google OAuth, email/password with OTP verification, JWT sessions, and secure HttpOnly cookie management. Zero configuration needed.',
  keywords:
    'Next.js authentication, Google OAuth, OTP verification, JWT sessions, email password login, SaaS boilerplate auth',
  openGraph: {
    title: 'Modern Authentication | Kostra Next.js Boilerplate',
    description:
      'Google OAuth, email/password with OTP, JWT sessions, and secure cookie management — authentication fully built into Kostra.',
    type: 'article',
    url: 'https://kostra.io/features/modern-authentication',
  },
  alternates: { canonical: 'https://kostra.io/features/modern-authentication' },
  robots: { index: true, follow: true },
};

export default function ModernAuthenticationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: 'Modern Authentication in Kostra',
            description:
              'How Kostra implements Google OAuth, email/password auth, OTP verification, JWT sessions, and secure cookies.',
            url: 'https://kostra.io/features/modern-authentication',
            isPartOf: { '@type': 'WebSite', name: 'Kostra', url: 'https://kostra.io' },
          }),
        }}
      />

      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-[400px] w-[600px] -translate-y-1/4 rounded-full bg-gradient-to-br from-indigo-500/10 via-blue-500/5 to-transparent blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/features" className="hover:text-gray-300 transition-colors">Features</Link>
            <span>/</span>
            <span className="text-gray-300">Modern Authentication</span>
          </nav>

          {/* Hero */}
          <div className="mb-16">
            <div className="mb-4 inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300">
              Authentication
            </div>
            <h1 className="mb-6 text-4xl font-light tracking-tight text-white sm:text-5xl md:text-6xl">
              Modern{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
                Authentication
              </span>
            </h1>
            <p className="max-w-2xl text-lg text-gray-400 sm:text-xl">
              Kostra ships with a complete, production-ready authentication system. Google OAuth and
              email/password are both supported out of the box — with OTP verification, JWT-based
              sessions, and secure HttpOnly cookie management.
            </p>
          </div>

          {/* How it works */}
          <section className="mb-16">
            <h2 className="mb-8 text-2xl font-light text-white sm:text-3xl">How it works</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                {
                  title: 'Google OAuth',
                  description:
                    'One-click sign-in via Google. Kostra handles the OAuth flow, retrieves the user profile, and creates or updates a Prisma user record automatically. Session is issued as a signed JWT stored in an HttpOnly cookie.',
                  detail: 'Uses Next.js API routes at /api/auth/google to handle the OAuth callback.',
                },
                {
                  title: 'Email / Password',
                  description:
                    'Traditional sign-up with bcrypt-hashed passwords and a 6-digit OTP email verification step. OTPs expire after 10 minutes and are stored against the user record in PostgreSQL.',
                  detail: 'POST /api/auth/signup → OTP email → POST /api/auth/verify-otp → session issued.',
                },
                {
                  title: 'JWT Sessions',
                  description:
                    'On successful authentication, the server signs a JWT containing userId, email, and role. The token is placed in a Secure, HttpOnly, SameSite=Lax cookie — no client-side token storage.',
                  detail: 'Token verification runs in Next.js middleware on every protected request.',
                },
                {
                  title: 'Password Reset',
                  description:
                    'Forgot-password flow sends a time-limited reset link via email. The link contains a signed token that maps to the user record. After reset, all existing sessions are invalidated.',
                  detail: 'POST /api/auth/forgot-password → email link → POST /api/auth/reset-password.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <h3 className="mb-2 font-medium text-white">{item.title}</h3>
                  <p className="mb-3 text-sm text-gray-400">{item.description}</p>
                  <p className="rounded-lg bg-black/40 px-3 py-2 font-mono text-xs text-gray-500">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Key capabilities */}
          <section className="mb-16">
            <h2 className="mb-8 text-2xl font-light text-white sm:text-3xl">Key capabilities</h2>
            <ul className="space-y-4">
              {[
                'HttpOnly, Secure, SameSite cookies — immune to XSS token theft',
                'Middleware-level route protection across the entire /app directory',
                'Role-based access control (user / admin) baked into the JWT payload',
                'Zustand auth store keeps client-side UI in sync with session state',
                'OTP expiry and rate limiting prevent brute-force verification attempts',
                'Prisma schema includes a User model with provider, role, and onboarding fields',
                'Server-side session validation via jwt.ts utility in src/lib/auth/',
                'Sign-out clears both the cookie and local Zustand store in one action',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-400">
                  <span className="mt-1 text-indigo-400">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Tech stack */}
          <section className="mb-16 rounded-2xl border border-white/10 bg-white/5 p-8">
            <h2 className="mb-6 text-xl font-medium text-white">Implementation stack</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Token format', value: 'JSON Web Tokens (JWT)' },
                { label: 'Password hashing', value: 'bcrypt (12 rounds)' },
                { label: 'Cookie flags', value: 'HttpOnly · Secure · SameSite=Lax' },
                { label: 'OTP storage', value: 'PostgreSQL via Prisma' },
                { label: 'OAuth provider', value: 'Google Identity Platform' },
                { label: 'State management', value: 'Zustand auth store' },
              ].map((item) => (
                <div key={item.label}>
                  <dt className="text-xs text-gray-500">{item.label}</dt>
                  <dd className="mt-1 text-sm font-medium text-white">{item.value}</dd>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-950/40 to-black p-8 text-center">
            <h2 className="mb-2 text-xl font-medium text-white">
              Skip months of auth boilerplate
            </h2>
            <p className="mb-6 text-gray-400">
              Get the complete Kostra codebase — auth, billing, and storage — for a one-time payment.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90"
            >
              Get Kostra →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
