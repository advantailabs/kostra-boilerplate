'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

import { siteConfig } from '@/app/siteConfig';
import { GoogleSignInButton } from '@/components/molecules/common/GoogleSignInButton';
import { useAuthStore } from '@/store/auth';
import UserProfile from './userProfile';

export function Navigation() {
  const { user } = useAuthStore();

  return (
    <motion.header
      className="bg-white/50 absolute left-0 right-0 top-0 z-50 border-b border-gray-100 backdrop-blur-md backdrop-filter"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <nav className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href={siteConfig.baseLinks.landing} className="text-xl font-bold text-gray-900">
            Next.js Boilerplate
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
            {user && <UserProfile />}

            {!user && <GoogleSignInButton className="text-blue-500" />}
          </div>
        </div>
      </nav>
    </motion.header>
  );
}
