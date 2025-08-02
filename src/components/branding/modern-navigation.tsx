'use client';

import { SignInButton, useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import UserProfile from './UserProfile';

export function ModernNavigation() {
  const { isSignedIn, isLoaded } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Only track sections when on landing page
      if (pathname === '/') {
        const sections = ['product', 'features', 'security', 'integrations', 'cta'];
        const scrollPosition = window.scrollY + 100; // Offset for fixed header

        let currentSection = '';

        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const { offsetTop, offsetHeight } = element;
            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
              currentSection = section;
              break;
            }
          }
        }

        setActiveSection(currentSection);
      } else {
        setActiveSection('');
      }
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const navItems = [
    { name: 'Product', href: '/#product', section: 'product' },
    { name: 'Features', href: '/#features', section: 'features' },
    { name: 'Security', href: '/#security', section: 'security' },
    { name: 'Customizations', href: '/customizations', section: 'customizations' },
  ];

  const isActive = (item: { href: string; section: string }) => {
    if (item.href === '/customizations') {
      return pathname === '/customizations';
    }
    // For anchor links on landing page, check if this section is currently in view
    if (pathname === '/' && item.section) {
      return activeSection === item.section;
    }
    return false;
  };

  return (
    <motion.nav
      className={`fixed left-0 right-0 top-0 z-50 border-b transition-all duration-300 ${
        isScrolled
          ? 'border-white/10 bg-black/80 backdrop-blur-md'
          : 'border-transparent bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.button
            onClick={() => {
              if (pathname === '/') {
                // If already on homepage, scroll to home section and update URL
                const homeElement = document.getElementById('home');
                if (homeElement) {
                  homeElement.scrollIntoView({ behavior: 'smooth' });
                  // Update URL to reflect home section
                  window.history.pushState(null, '', '/#home');
                }
              } else {
                // If on different page, navigate to homepage then scroll to home
                router.push('/#home');
              }
            }}
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="h-8">
              <Image
                src="/logos/light-logo.svg"
                alt="Peon Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
          </motion.button>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {navItems.map(item => {
              const active = isActive(item);
              return (
                <Link key={item.name} href={item.href}>
                  <motion.span
                    className={`cursor-pointer text-sm font-medium transition-colors duration-200 ${
                      active ? 'text-white' : 'text-gray-400 hover:text-white'
                    }`}
                    whileHover={{ y: -1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.name}
                  </motion.span>
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-4 md:flex">
            {isLoaded && isSignedIn ? (
              <UserProfile />
            ) : (
              <SignInButton mode="modal">
                <motion.button
                  className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-all duration-200 hover:bg-gray-100"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Sign in
                </motion.button>
              </SignInButton>
            )}
          </div>

          {/* Mobile menu button */}
          <motion.button
            className="p-2 text-gray-400 transition-colors hover:text-white md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            className="border-t border-white/10 py-4 md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col gap-4">
              {navItems.map(item => {
                const active = isActive(item);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`py-2 text-sm font-medium transition-colors duration-200 ${
                      active ? 'text-white' : 'text-gray-400 hover:text-white'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <div className="flex flex-col gap-3 border-t border-white/10 pt-4">
                {isLoaded && isSignedIn ? (
                  <div className="px-2 py-2">
                    <UserProfile />
                  </div>
                ) : (
                  <SignInButton mode="modal">
                    <button
                      className="w-full rounded-lg bg-white px-4 py-3 text-center text-sm font-medium text-black transition-all duration-200 hover:bg-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </button>
                  </SignInButton>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
