'use client';

import { useClerk, useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import Link from 'next/link';

import UserProfile from './UserProfile';

export function Navigation() {
  const clerk = useClerk();
  const { isSignedIn } = useUser();

  const handleSignInClick = () => {
    clerk.openSignIn({
      forceRedirectUrl: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
    });
  };

  return (
    <motion.header
      className="absolute left-0 right-0 top-0 z-50 border-b border-gray-100 bg-white/50 backdrop-blur-md backdrop-filter"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <nav className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Peon
          </Link>

          <div className="hidden items-center space-x-8 md:flex">
            <Link href="#features" className="text-gray-700 hover:text-gray-900">
              Features
            </Link>
            <Link href="#pricing" className="text-gray-700 hover:text-gray-900">
              Pricing
            </Link>
            <Link href="#about" className="text-gray-700 hover:text-gray-900">
              About
            </Link>
            {isSignedIn && <UserProfile />}

            {!isSignedIn && (
              <button onClick={handleSignInClick} className="text-blue-500">
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>
    </motion.header>
  );
}
