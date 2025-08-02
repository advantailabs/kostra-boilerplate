'use client';

import { SignInButton, useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function CTASection() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <section className="relative -mt-1 bg-black py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gray-800/30" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-purple-950/5 to-black/0" />
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="mx-auto max-w-3xl">
            <h3 className="mb-6 text-3xl font-light text-white md:text-4xl">
              Ready to get started?
            </h3>
            <p className="mb-10 text-xl text-gray-400">
              Join hundreds of organizations already transforming their knowledge management with
              Peon.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              {isLoaded && isSignedIn ? (
                <Link href="/app">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full rounded-lg bg-white px-8 py-4 font-medium text-black transition-all duration-300 hover:bg-gray-100 sm:w-auto"
                  >
                    Go to App
                  </motion.button>
                </Link>
              ) : (
                <SignInButton mode="modal">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full rounded-lg bg-white px-8 py-4 font-medium text-black transition-all duration-300 hover:bg-gray-100 sm:w-auto"
                    onClick={() => {
                      // We'll handle the redirect after sign-in manually
                      localStorage.setItem('redirectAfterSignIn', '/app');
                    }}
                  >
                    Sign In Now
                  </motion.button>
                </SignInButton>
              )}
            </div>

            <p className="mt-6 text-sm text-gray-500">
              No credit card required • 100 Free Credits • Setup in minutes
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
