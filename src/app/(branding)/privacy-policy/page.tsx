import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Kostra',
  description:
    'Privacy Policy for Kostra - Modern Next.js SaaS Boilerplate. Learn how we collect, use, and protect your personal information.',
  openGraph: {
    title: 'Privacy Policy - Kostra',
    description:
      'Privacy Policy for Kostra - Modern Next.js SaaS Boilerplate. Learn how we collect, use, and protect your personal information.',
    type: 'article',
    url: 'https://kostra.io/privacy-policy',
  },
  alternates: {
    canonical: 'https://kostra.io/privacy-policy',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Static generation - this page will be pre-rendered at build time
export async function generateStaticParams() {
  return [{}]; // Empty array means this page will be statically generated
}

// Get the current date at build time for consistent SSG
function getLastUpdatedDate(): string {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function PrivacyPolicyPage() {
  const lastUpdated = getLastUpdatedDate();

  return (
    <>
      {/* Structured Data for Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Privacy Policy',
            description: 'Privacy Policy for Kostra - Modern Next.js SaaS Boilerplate',
            url: 'https://kostra.io/privacy-policy',
            dateModified: lastUpdated,
            isPartOf: {
              '@type': 'WebSite',
              name: 'Kostra',
              url: 'https://kostra.io',
            },
            mainEntity: {
              '@type': 'Article',
              headline: 'Privacy Policy',
              description: 'Learn how we collect, use, and protect your personal information.',
              dateModified: lastUpdated,
              author: {
                '@type': 'Organization',
                name: 'Kostra',
                url: 'https://kostra.io',
              },
            },
          }),
        }}
      />

      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="bg-gradient-radial via-purple-500/5 absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 from-blue-500/10 to-transparent blur-3xl" />
        <div className="bg-gradient-radial from-purple-500/10 absolute right-0 top-1/3 h-96 w-96 translate-x-1/2 via-pink-500/5 to-transparent blur-3xl" />
      </div>

      {/* Content */}
      <div className="container relative mx-auto px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8 text-center sm:mb-12">
            <h1 className="mb-3 text-3xl font-bold text-white sm:mb-4 sm:text-4xl md:text-5xl">
              Privacy Policy
            </h1>
            <p className="text-base text-text-muted sm:text-lg">Last updated: {lastUpdated}</p>
          </div>

          {/* Content */}
          <div className="prose prose-invert mx-auto max-w-none">
            <div className="space-y-6 text-text-muted sm:space-y-8">
              <section>
                <h2 className="mb-3 text-xl font-semibold text-text sm:mb-4 sm:text-2xl">
                  1. Introduction
                </h2>
                <p className="text-sm sm:text-base">
                  At Kostra, we are committed to protecting your privacy and ensuring the security
                  of your personal information. This Privacy Policy explains how we collect, use,
                  process, and protect your information when you use our Next.js SaaS boilerplate
                  platform.
                </p>
              </section>

              <section>
                <h2 className="mb-3 text-xl font-semibold text-text sm:mb-4 sm:text-2xl">
                  2. Information We Collect
                </h2>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-text sm:text-xl">
                    2.1 Information You Provide
                  </h3>
                  <ul className="list-disc space-y-2 pl-4 text-sm sm:pl-6 sm:text-base">
                    <li>
                      <strong>Account Information:</strong> Name, email address, username, and
                      password
                    </li>
                    <li>
                      <strong>Profile Information:</strong> Job title, company name, and other
                      professional details
                    </li>
                    <li>
                      <strong>Content Data:</strong> Documents, files, messages, and other content
                      you upload or create
                    </li>
                    <li>
                      <strong>Communication Data:</strong> Messages you send to us and feedback you
                      provide
                    </li>
                  </ul>

                  <h3 className="text-lg font-medium text-text sm:text-xl">
                    2.2 Information We Collect Automatically
                  </h3>
                  <ul className="list-disc space-y-2 pl-4 text-sm sm:pl-6 sm:text-base">
                    <li>
                      <strong>Usage Data:</strong> How you interact with our platform, features
                      used, and time spent
                    </li>
                    <li>
                      <strong>Device Information:</strong> Device type, operating system, browser
                      type, and IP address
                    </li>
                    <li>
                      <strong>Log Data:</strong> Server logs, error reports, and performance data
                    </li>
                    <li>
                      <strong>Cookies and Similar Technologies:</strong> Data collected through
                      cookies and tracking pixels
                    </li>
                  </ul>

                  <h3 className="text-lg font-medium text-text sm:text-xl">
                    2.3 Information from Third Parties
                  </h3>
                  <ul className="list-disc space-y-2 pl-4 text-sm sm:pl-6 sm:text-base">
                    <li>
                      <strong>Authentication Providers:</strong> Information from OAuth providers
                      (Google, Microsoft, etc.)
                    </li>
                    <li>
                      <strong>Integration Services:</strong> Data from connected third-party
                      services and APIs
                    </li>
                    <li>
                      <strong>Payment Processors:</strong> Billing and payment information from
                      payment providers
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="mb-3 text-xl font-semibold text-text sm:mb-4 sm:text-2xl">
                  3. How We Use Your Information
                </h2>
                <div className="space-y-4">
                  <p className="text-sm sm:text-base">We use your information to:</p>
                  <ul className="list-disc space-y-2 pl-4 text-sm sm:pl-6 sm:text-base">
                    <li>
                      Provide, maintain, and improve our SaaS boilerplate platform and services
                    </li>
                    <li>Process and analyze your content to deliver platform functionality</li>
                    <li>Authenticate your identity and provide secure access to your account</li>
                    <li>Process payments and manage your subscription</li>
                    <li>Send service updates, security alerts, and administrative messages</li>
                    <li>Provide customer support and respond to your inquiries</li>
                    <li>Analyze usage patterns to improve our platform and develop new features</li>
                    <li>Comply with legal obligations and protect against fraud and abuse</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="mb-3 text-xl font-semibold text-text sm:mb-4 sm:text-2xl">
                  4. AI Processing and Data Use
                </h2>
                <div className="space-y-4">
                  <p className="text-sm sm:text-base">
                    <strong>Content Processing:</strong> Your uploaded content may be processed by
                    AI systems (including large language models) to provide knowledge management,
                    search, and assistance features. This processing occurs within secure,
                    controlled environments.
                  </p>
                  <p className="text-sm sm:text-base">
                    <strong>Training Data:</strong> We do not use your personal content to train AI
                    models. Our AI processing is limited to providing services to you and your
                    organization.
                  </p>
                  <p className="text-sm sm:text-base">
                    <strong>Data Retention:</strong> AI processing results are retained only as long
                    as necessary to provide services and are automatically deleted according to our
                    retention policies.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="mb-3 text-xl font-semibold text-text sm:mb-4 sm:text-2xl">
                  5. Information Sharing and Disclosure
                </h2>
                <div className="space-y-4">
                  <p className="text-sm sm:text-base">
                    We may share your information in the following circumstances:
                  </p>

                  <h3 className="text-lg font-medium text-text sm:text-xl">
                    5.1 With Your Consent
                  </h3>
                  <p className="text-sm sm:text-base">
                    We share information when you explicitly consent to such sharing.
                  </p>

                  <h3 className="text-lg font-medium text-text sm:text-xl">
                    5.2 Service Providers
                  </h3>
                  <p className="text-sm sm:text-base">
                    We work with trusted third-party service providers who assist us in providing
                    our services, including:
                  </p>
                  <ul className="list-disc space-y-2 pl-4 text-sm sm:pl-6 sm:text-base">
                    <li>Cloud infrastructure providers (AWS, Google Cloud, Azure)</li>
                    <li>AI and machine learning service providers</li>
                    <li>Payment processors and billing services</li>
                    <li>Customer support and communication platforms</li>
                    <li>Analytics and monitoring services</li>
                  </ul>

                  <h3 className="text-lg font-medium text-text sm:text-xl">
                    5.3 Legal Requirements
                  </h3>
                  <p className="text-sm sm:text-base">
                    We may disclose information when required by law, court order, or legal process,
                    or to protect our rights, property, or safety.
                  </p>

                  <h3 className="text-lg font-medium text-text sm:text-xl">
                    5.4 Business Transfers
                  </h3>
                  <p className="text-sm sm:text-base">
                    In the event of a merger, acquisition, or sale of assets, your information may
                    be transferred as part of the transaction.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="mb-3 text-xl font-semibold text-text sm:mb-4 sm:text-2xl">
                  6. Data Security
                </h2>
                <div className="space-y-4">
                  <p className="text-sm sm:text-base">
                    We implement comprehensive security measures to protect your information:
                  </p>
                  <ul className="list-disc space-y-2 pl-4 text-sm sm:pl-6 sm:text-base">
                    <li>
                      <strong>Encryption:</strong> Data is encrypted in transit and at rest using
                      industry-standard protocols
                    </li>
                    <li>
                      <strong>Access Controls:</strong> Strict access controls and authentication
                      mechanisms
                    </li>
                    <li>
                      <strong>Regular Audits:</strong> Regular security audits and vulnerability
                      assessments
                    </li>
                    <li>
                      <strong>Employee Training:</strong> Regular security training for all
                      employees
                    </li>
                    <li>
                      <strong>Incident Response:</strong> Comprehensive incident response and breach
                      notification procedures
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="mb-3 text-xl font-semibold text-text sm:mb-4 sm:text-2xl">
                  7. Your Rights and Choices
                </h2>
                <div className="space-y-4">
                  <p className="text-sm sm:text-base">
                    You have the following rights regarding your personal information:
                  </p>

                  <h3 className="text-lg font-medium text-text sm:text-xl">
                    7.1 Access and Portability
                  </h3>
                  <p className="text-sm sm:text-base">
                    You can access, download, and export your personal data at any time through your
                    account settings.
                  </p>

                  <h3 className="text-lg font-medium text-text sm:text-xl">
                    7.2 Correction and Updates
                  </h3>
                  <p className="text-sm sm:text-base">
                    You can update and correct your personal information through your account
                    settings.
                  </p>

                  <h3 className="text-lg font-medium text-text sm:text-xl">7.3 Deletion</h3>
                  <p className="text-sm sm:text-base">
                    You can request deletion of your account and personal data. Some data may be
                    retained for legal or operational purposes.
                  </p>

                  <h3 className="text-lg font-medium text-text sm:text-xl">
                    7.4 Communication Preferences
                  </h3>
                  <p className="text-sm sm:text-base">
                    You can opt out of non-essential communications through your account settings or
                    unsubscribe links.
                  </p>

                  <h3 className="text-lg font-medium text-text sm:text-xl">7.5 Cookie Controls</h3>
                  <p className="text-sm sm:text-base">
                    You can manage cookie preferences through your browser settings or our cookie
                    preference center.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="mb-3 text-xl font-semibold text-text sm:mb-4 sm:text-2xl">
                  8. Data Retention
                </h2>
                <div className="space-y-4">
                  <p className="text-sm sm:text-base">
                    We retain your information for as long as necessary to provide services and
                    fulfill legal obligations:
                  </p>
                  <ul className="list-disc space-y-2 pl-4 text-sm sm:pl-6 sm:text-base">
                    <li>
                      <strong>Account Data:</strong> Retained while your account is active and for
                      90 days after closure
                    </li>
                    <li>
                      <strong>Content Data:</strong> Retained according to your subscription plan
                      and deletion requests
                    </li>
                    <li>
                      <strong>Usage Data:</strong> Retained for up to 2 years for analytics and
                      service improvement
                    </li>
                    <li>
                      <strong>Legal Data:</strong> Retained as required by applicable laws and
                      regulations
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="mb-3 text-xl font-semibold text-text sm:mb-4 sm:text-2xl">
                  9. International Data Transfers
                </h2>
                <p className="text-sm sm:text-base">
                  Your information may be processed and stored in countries other than your own. We
                  ensure appropriate safeguards are in place for international transfers, including
                  standard contractual clauses and adequacy decisions.
                </p>
              </section>

              <section>
                <h2 className="mb-3 text-xl font-semibold text-text sm:mb-4 sm:text-2xl">
                  10. Children&apos;s Privacy
                </h2>
                <p className="text-sm sm:text-base">
                  Our services are not designed for or directed to children under 13 years of age.
                  We do not knowingly collect personal information from children under 13. If we
                  learn that we have collected such information, we will delete it immediately.
                </p>
              </section>

              <section>
                <h2 className="mb-3 text-xl font-semibold text-text sm:mb-4 sm:text-2xl">
                  11. Changes to This Privacy Policy
                </h2>
                <p className="text-sm sm:text-base">
                  We may update this Privacy Policy from time to time. We will notify you of
                  significant changes via email or through our platform. Your continued use of our
                  services after such modifications constitutes acceptance of the updated Privacy
                  Policy.
                </p>
              </section>

              <section>
                <h2 className="mb-3 text-xl font-semibold text-text sm:mb-4 sm:text-2xl">
                  12. Compliance and Regulations
                </h2>
                <div className="space-y-4">
                  <p className="text-sm sm:text-base">
                    We comply with applicable privacy laws and regulations, including:
                  </p>
                  <ul className="list-disc space-y-2 pl-4 text-sm sm:pl-6 sm:text-base">
                    <li>General Data Protection Regulation (GDPR)</li>
                    <li>California Consumer Privacy Act (CCPA)</li>
                    <li>Children&apos;s Online Privacy Protection Act (COPPA)</li>
                    <li>Other applicable local and international privacy laws</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="mb-3 text-xl font-semibold text-text sm:mb-4 sm:text-2xl">
                  13. Contact Information
                </h2>
                <p className="text-sm sm:text-base">
                  If you have any questions about this Privacy Policy or our privacy practices,
                  please contact us:
                </p>
                <div className="mt-4 rounded-lg border border-border bg-background-light p-4 sm:p-6">
                  <p className="text-sm sm:text-base">
                    <strong>Email:</strong> hi@kostra.io
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
