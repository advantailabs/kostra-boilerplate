'use client';

import { motion } from 'framer-motion';

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="bg-gradient-radial absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 from-blue-500/10 via-purple-500/5 to-transparent blur-3xl" />
        <div className="bg-gradient-radial absolute right-0 top-1/3 h-96 w-96 translate-x-1/2 from-purple-500/10 via-pink-500/5 to-transparent blur-3xl" />
      </div>

      {/* Content */}
      <div className="container relative mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl"
        >
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">Privacy Policy</h1>
            <p className="text-lg text-gray-400">
              Last updated:{' '}
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-invert mx-auto max-w-none">
            <div className="space-y-8 text-gray-300">
              <section>
                <h2 className="mb-4 text-2xl font-semibold text-white">1. Introduction</h2>
                <p>
                  At Peon, we are committed to protecting your privacy and ensuring the security of
                  your personal information. This Privacy Policy explains how we collect, use,
                  process, and protect your information when you use our AI-powered knowledge
                  management platform.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold text-white">
                  2. Information We Collect
                </h2>

                <div className="space-y-4">
                  <h3 className="text-xl font-medium text-white">2.1 Information You Provide</h3>
                  <ul className="list-disc space-y-2 pl-6">
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

                  <h3 className="text-xl font-medium text-white">
                    2.2 Information We Collect Automatically
                  </h3>
                  <ul className="list-disc space-y-2 pl-6">
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

                  <h3 className="text-xl font-medium text-white">
                    2.3 Information from Third Parties
                  </h3>
                  <ul className="list-disc space-y-2 pl-6">
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
                <h2 className="mb-4 text-2xl font-semibold text-white">
                  3. How We Use Your Information
                </h2>
                <div className="space-y-4">
                  <p>We use your information to:</p>
                  <ul className="list-disc space-y-2 pl-6">
                    <li>
                      Provide, maintain, and improve our AI-powered knowledge management services
                    </li>
                    <li>Process and analyze your content to deliver personalized AI assistance</li>
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
                <h2 className="mb-4 text-2xl font-semibold text-white">
                  4. AI Processing and Data Use
                </h2>
                <div className="space-y-4">
                  <p>
                    <strong>Content Processing:</strong> Your uploaded content may be processed by
                    AI systems (including large language models) to provide knowledge management,
                    search, and assistance features. This processing occurs within secure,
                    controlled environments.
                  </p>
                  <p>
                    <strong>Training Data:</strong> We do not use your personal content to train AI
                    models. Our AI processing is limited to providing services to you and your
                    organization.
                  </p>
                  <p>
                    <strong>Data Retention:</strong> AI processing results are retained only as long
                    as necessary to provide services and are automatically deleted according to our
                    retention policies.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold text-white">
                  5. Information Sharing and Disclosure
                </h2>
                <div className="space-y-4">
                  <p>We may share your information in the following circumstances:</p>

                  <h3 className="text-xl font-medium text-white">5.1 With Your Consent</h3>
                  <p>We share information when you explicitly consent to such sharing.</p>

                  <h3 className="text-xl font-medium text-white">5.2 Service Providers</h3>
                  <p>
                    We work with trusted third-party service providers who assist us in providing
                    our services, including:
                  </p>
                  <ul className="list-disc space-y-2 pl-6">
                    <li>Cloud infrastructure providers (AWS, Google Cloud, Azure)</li>
                    <li>AI and machine learning service providers</li>
                    <li>Payment processors and billing services</li>
                    <li>Customer support and communication platforms</li>
                    <li>Analytics and monitoring services</li>
                  </ul>

                  <h3 className="text-xl font-medium text-white">5.3 Legal Requirements</h3>
                  <p>
                    We may disclose information when required by law, court order, or legal process,
                    or to protect our rights, property, or safety.
                  </p>

                  <h3 className="text-xl font-medium text-white">5.4 Business Transfers</h3>
                  <p>
                    In the event of a merger, acquisition, or sale of assets, your information may
                    be transferred as part of the transaction.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold text-white">6. Data Security</h2>
                <div className="space-y-4">
                  <p>We implement comprehensive security measures to protect your information:</p>
                  <ul className="list-disc space-y-2 pl-6">
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
                <h2 className="mb-4 text-2xl font-semibold text-white">
                  7. Your Rights and Choices
                </h2>
                <div className="space-y-4">
                  <p>You have the following rights regarding your personal information:</p>

                  <h3 className="text-xl font-medium text-white">7.1 Access and Portability</h3>
                  <p>
                    You can access, download, and export your personal data at any time through your
                    account settings.
                  </p>

                  <h3 className="text-xl font-medium text-white">7.2 Correction and Updates</h3>
                  <p>
                    You can update and correct your personal information through your account
                    settings.
                  </p>

                  <h3 className="text-xl font-medium text-white">7.3 Deletion</h3>
                  <p>
                    You can request deletion of your account and personal data. Some data may be
                    retained for legal or operational purposes.
                  </p>

                  <h3 className="text-xl font-medium text-white">7.4 Communication Preferences</h3>
                  <p>
                    You can opt out of non-essential communications through your account settings or
                    unsubscribe links.
                  </p>

                  <h3 className="text-xl font-medium text-white">7.5 Cookie Controls</h3>
                  <p>
                    You can manage cookie preferences through your browser settings or our cookie
                    preference center.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold text-white">8. Data Retention</h2>
                <div className="space-y-4">
                  <p>
                    We retain your information for as long as necessary to provide services and
                    fulfill legal obligations:
                  </p>
                  <ul className="list-disc space-y-2 pl-6">
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
                <h2 className="mb-4 text-2xl font-semibold text-white">
                  9. International Data Transfers
                </h2>
                <p>
                  Your information may be processed and stored in countries other than your own. We
                  ensure appropriate safeguards are in place for international transfers, including
                  standard contractual clauses and adequacy decisions.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold text-white">10. Children's Privacy</h2>
                <p>
                  Our services are not designed for or directed to children under 13 years of age.
                  We do not knowingly collect personal information from children under 13. If we
                  learn that we have collected such information, we will delete it immediately.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold text-white">
                  11. Changes to This Privacy Policy
                </h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of
                  significant changes via email or through our platform. Your continued use of our
                  services after such modifications constitutes acceptance of the updated Privacy
                  Policy.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold text-white">
                  12. Compliance and Regulations
                </h2>
                <div className="space-y-4">
                  <p>We comply with applicable privacy laws and regulations, including:</p>
                  <ul className="list-disc space-y-2 pl-6">
                    <li>General Data Protection Regulation (GDPR)</li>
                    <li>California Consumer Privacy Act (CCPA)</li>
                    <li>Children's Online Privacy Protection Act (COPPA)</li>
                    <li>Other applicable local and international privacy laws</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold text-white">13. Contact Information</h2>
                <p>
                  If you have any questions about this Privacy Policy or our privacy practices,
                  please contact us:
                </p>
                <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-6">
                  <p>
                    <strong>Email:</strong> hi@peon.sh
                  </p>
                </div>
              </section>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
