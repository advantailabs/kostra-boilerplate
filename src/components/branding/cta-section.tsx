'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

import { siteConfig } from '@/app/siteConfig';
import { SignInButton } from '@/components/atom/SignInButton';
import { useSignInModalContext } from '@/providers/SignInModalProvider';
import { useAuthStore } from '@/store/auth';

export function CTASection() {
  const { user } = useAuthStore();
  const { openModal } = useSignInModalContext();

  return (
    <section className="relative -mt-1 bg-black py-16 sm:py-20 md:py-24">
      <div className="bg-gray-800/30 absolute inset-x-0 top-0 h-px" />
      <div className="from-purple-950/5 to-black/0 pointer-events-none absolute inset-0 bg-gradient-to-b" />
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="mx-auto max-w-3xl">
            <h3 className="mb-4 text-2xl font-light text-white sm:mb-6 sm:text-3xl md:text-4xl">
              Ready to get started?
            </h3>
            <p className="mb-8 text-lg text-gray-400 sm:mb-10 sm:text-xl">
              Join developers who are building faster with our comprehensive Next.js boilerplate.
            </p>

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              {user ? (
                <Link href={siteConfig.baseLinks.home}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full rounded-lg bg-white px-6 py-3 text-base font-medium text-black transition-all duration-300 sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
                  >
                    Go to App
                  </motion.button>
                </Link>
              ) : (
                <SignInButton
                  onClick={openModal}
                  variant="light"
                  className="w-full rounded-lg bg-white px-6 py-3 text-base font-medium text-black transition-all duration-300 hover:bg-gray-100 sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
                >
                  Sign In Now
                </SignInButton>
              )}
            </div>

            <p className="mt-4 text-xs text-primary sm:mt-6 sm:text-sm">
              No credit card required • Free plan available • Setup in minutes
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
