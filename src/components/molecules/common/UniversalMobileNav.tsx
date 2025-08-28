'use client';

import { SignInButton } from '@/components/atom/SignInButton';
import UserProfile from '@/components/branding/UserProfile';
import { useSignInModalContext } from '@/providers/SignInModalProvider';
import { useAuthStore } from '@/store/auth';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface NavItem {
  name: string;
  href: string;
  section?: string;
}

interface UniversalMobileNavProps {
  navItems: NavItem[];
  logoSrc?: string;
  showUserProfile?: boolean;
  className?: string;
}

export function UniversalMobileNav({
  navItems,
  logoSrc = '/logos/light-logo.svg',
  showUserProfile = true,
  className = '',
}: UniversalMobileNavProps) {
  const { user } = useAuthStore();
  const { openModal } = useSignInModalContext();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection] = useState('');

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const isActive = (item: NavItem) => {
    if (item.href.startsWith('/#')) {
      // For anchor links on landing page, check if this section is currently in view
      if (pathname === '/' && item.section) {
        return activeSection === item.section;
      }
      return false;
    }

    // For regular routes
    if (item.href === '/') {
      return pathname === '/';
    }

    return pathname === item.href || pathname.startsWith(item.href);
  };

  const handleLogoClick = () => {
    if (pathname === '/') {
      // If already on homepage, scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.pushState(null, '', '/');
    } else {
      // If on different page, navigate to homepage
      router.push('/');
    }
  };

  return (
    <>
      {/* Mobile menu button - Fixed positioned for universal access */}
      <div className={`fixed right-3 top-3 z-50 md:hidden ${className}`}>
        <motion.button
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-black/80 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-black/90"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </motion.button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <motion.div
        className={`fixed left-0 top-0 z-50 h-[100dvh] w-80 max-w-[85vw] border-r border-white/10 bg-black/95 shadow-2xl backdrop-blur-md md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        initial={{ x: '-100%' }}
        animate={{ x: isMobileMenuOpen ? 0 : '-100%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{ maxHeight: '100dvh' }}
      >
        <div className="flex h-full flex-col overflow-hidden">
          {/* Sidebar Header */}
          <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
            <motion.button
              onClick={() => {
                handleLogoClick();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="h-8">
                <Image
                  src={logoSrc}
                  alt="Peon Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <span className="text-lg font-semibold text-white">Menu</span>
            </motion.button>
            <motion.button
              className="p-2 text-gray-400 transition-colors hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>
          </div>

          {/* Sidebar Navigation */}
          <div className="min-h-0 flex-1 overflow-y-auto py-4">
            <div className="flex flex-col gap-2 px-4">
              {navItems.map(item => {
                const active = isActive(item);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'bg-white/10 text-white'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Sidebar Footer - Fixed at bottom */}
          {showUserProfile && (
            <div className="flex-shrink-0 border-t border-white/10 bg-black/95 p-6 pb-12">
              {user ? (
                <div className="flex items-center justify-center py-4">
                  <UserProfile />
                </div>
              ) : (
                <div onClick={() => setIsMobileMenuOpen(false)} role="button" tabIndex={0}>
                  <SignInButton
                    onClick={openModal}
                    variant="light"
                    className="w-full rounded-lg bg-white px-4 py-3 text-center text-sm font-medium text-black transition-all duration-200 hover:bg-gray-100"
                  >
                    Sign In Now
                  </SignInButton>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
