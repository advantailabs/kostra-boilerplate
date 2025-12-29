import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Kostra',
  description:
    'Terms of Service for Kostra - Modern Next.js SaaS Boilerplate. Read our terms and conditions for using our SaaS boilerplate platform.',
  openGraph: {
    title: 'Terms of Service - Kostra',
    description:
      'Terms of Service for Kostra - Modern Next.js SaaS Boilerplate. Read our terms and conditions for using our SaaS boilerplate platform.',
    type: 'article',
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

export default function TermsOfServicePage() {
  const lastUpdated = getLastUpdatedDate();

  return (
    <>
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
            <h1 className="mb-3 text-3xl font-bold text-text sm:mb-4 sm:text-4xl md:text-5xl">
              Terms of Service
            </h1>
            <p className="text-base text-text-muted sm:text-lg">Last updated: {lastUpdated}</p>
          </div>

          {/* Content */}
          <div className="prose prose-invert mx-auto max-w-none">
            <div className="space-y-6 text-text-muted sm:space-y-8">
              <section>
                <h2 className="mb-3 text-xl font-semibold text-text sm:mb-4 sm:text-2xl">
                  1. Acceptance of Terms
                </h2>
                <p className="text-sm sm:text-base">
                  By accessing and using Kostra (&quot;the Service&quot;), you accept and agree to be bound by
                  the terms and provision of this agreement. If you do not agree to abide by the
                  above, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="mb-3 text-xl font-semibold text-text sm:mb-4 sm:text-2xl">
                  2. Description of Service
                </h2>
                <p className="text-sm sm:text-base">
                  Kostra is a modern Next.js SaaS boilerplate that provides a comprehensive
                  foundation for building scalable web applications with authentication, file
                  management, billing integration, and modern development practices.
                </p>
              </section>

              <section>
                <h2 className="mb-3 text-xl font-semibold text-text sm:mb-4 sm:text-2xl">
                  3. User Accounts
                </h2>
                <div className="space-y-4">
                  <p className="text-sm sm:text-base">
                    To access certain features of the Service, you must register for an account. You
                    are responsible for:
                  </p>
                  <ul className="list-disc space-y-2 pl-4 text-sm sm:pl-6 sm:text-base">
                    <li>Maintaining the confidentiality of your account credentials</li>
                    <li>All activities that occur under your account</li>
                    <li>Notifying us immediately of any unauthorized use of your account</li>
                    <li>Providing accurate and complete information during registration</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="mb-3 text-xl font-semibold text-text sm:mb-4 sm:text-2xl">
                  4. Acceptable Use
                </h2>
                <div className="space-y-4">
                  <p className="text-sm sm:text-base">You agree not to use the Service to:</p>
                  <ul className="list-disc space-y-2 pl-4 text-sm sm:pl-6 sm:text-base">
                    <li>
                      Upload, transmit, or distribute any content that is illegal, harmful, or
                      violates third-party rights
                    </li>
                    <li>
                      Attempt to gain unauthorized access to our systems or other users&apos; accounts
                    </li>
                    <li>
                      Use the Service for any commercial purpose without our explicit written
                      consent
                    </li>
                    <li>
                      Interfere with or disrupt the Service or servers connected to the Service
                    </li>
                    <li>Use automated scripts or bots to access the Service</li>
                    <li>
                      Reverse engineer, decompile, or attempt to extract source code from the
                      Service
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="mb-3 text-xl font-semibold text-text sm:mb-4 sm:text-2xl">
                  5. Content and Data
                </h2>
                <div className="space-y-4">
                  <p className="text-sm sm:text-base">
                    <strong>Your Content:</strong> You retain ownership of all content and data you
                    upload to the Service. By uploading content, you grant us a limited license to
                    process, store, and analyze your content solely for the purpose of providing the
                    Service.
                  </p>
                  <p className="text-sm sm:text-base">
                    <strong>AI Processing:</strong> Your content may be processed by AI systems to
                    provide knowledge management and assistance features. We implement appropriate
                    safeguards to protect your data during processing.
                  </p>
                  <p className="text-sm sm:text-base">
                    <strong>Data Security:</strong> We implement industry-standard security measures
                    to protect your data, but no system is 100% secure. You use the Service at your
                    own risk.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="mb-3 text-xl font-semibold text-text sm:mb-4 sm:text-2xl">
                  6. Intellectual Property
                </h2>
                <p className="text-sm sm:text-base">
                  The Service, including its design, functionality, and underlying technology, is
                  owned by Kostra and protected by copyright, trademark, and other intellectual
                  property laws. You may not copy, modify, distribute, or create derivative works
                  based on the Service without our explicit written permission.
                </p>
              </section>

              <section>
                <h2 className="mb-3 text-xl font-semibold text-text sm:mb-4 sm:text-2xl">
                  7. Privacy
                </h2>
                <p className="text-sm sm:text-base">
                  Your privacy is important to us. Our collection and use of personal information is
                  governed by our Privacy Policy, which is incorporated into these Terms by
                  reference.
                </p>
              </section>

              <section>
                <h2 className="mb-3 text-xl font-semibold text-text sm:mb-4 sm:text-2xl">
                  8. Service Availability
                </h2>
                <p className="text-sm sm:text-base">
                  We strive to maintain high availability of the Service but cannot guarantee
                  uninterrupted access. We may temporarily suspend the Service for maintenance,
                  updates, or other operational reasons with reasonable notice when possible.
                </p>
              </section>

              <section>
                <h2 className="mb-3 text-xl font-semibold text-text sm:mb-4 sm:text-2xl">
                  9. Limitation of Liability
                </h2>
                <p className="text-sm sm:text-base">
                  To the maximum extent permitted by law, Kostra shall not be liable for any
                  indirect, incidental, special, consequential, or punitive damages, or any loss of
                  profits or revenues, whether incurred directly or indirectly, or any loss of data,
                  use, goodwill, or other intangible losses resulting from your use of the Service.
                </p>
              </section>

              <section>
                <h2 className="mb-3 text-xl font-semibold text-text sm:mb-4 sm:text-2xl">
                  10. Termination
                </h2>
                <div className="space-y-4">
                  <p className="text-sm sm:text-base">
                    Either party may terminate this agreement at any time. Upon termination:
                  </p>
                  <ul className="list-disc space-y-2 pl-4 text-sm sm:pl-6 sm:text-base">
                    <li>Your access to the Service will be immediately suspended</li>
                    <li>You may request deletion of your data within 30 days of termination</li>
                    <li>
                      We may delete your data after the retention period specified in our Privacy
                      Policy
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="mb-3 text-xl font-semibold text-text sm:mb-4 sm:text-2xl">
                  11. Governing Law
                </h2>
                <p className="text-sm sm:text-base">
                  These Terms shall be governed by and construed in accordance with the laws of
                  [Your Jurisdiction], without regard to its conflict of law provisions. Any
                  disputes arising from these Terms shall be resolved in the courts of [Your
                  Jurisdiction].
                </p>
              </section>

              <section>
                <h2 className="mb-3 text-xl font-semibold text-text sm:mb-4 sm:text-2xl">
                  12. Changes to Terms
                </h2>
                <p className="text-sm sm:text-base">
                  We reserve the right to modify these Terms at any time. We will notify users of
                  significant changes via email or through the Service. Your continued use of the
                  Service after such modifications constitutes acceptance of the updated Terms.
                </p>
              </section>

              <section>
                <h2 className="mb-3 text-xl font-semibold text-text sm:mb-4 sm:text-2xl">
                  13. Contact Information
                </h2>
                <p className="text-sm sm:text-base">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="mt-4 rounded-lg border border-border bg-background-light p-4 sm:p-6">
                  <p className="text-sm sm:text-base">Email: hi@kostra.io</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
