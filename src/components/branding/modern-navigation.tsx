'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { siteConfig } from '@/app/siteConfig';
import { SignInButton } from '@/components/atom/SignInButton';
import { useSignInModalContext } from '@/providers/SignInModalProvider';
import { useAuthStore } from '@/store/auth';
import UserProfile from './userProfile';

export function ModernNavigation() {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [hasInitialized, setHasInitialized] = useState(false);
  const { openModal } = useSignInModalContext();

  // Ensure we start at top on page load
  if (pathname === '/' && !hasInitialized) {
    setActiveSection('home');
    setHasInitialized(true);
  }

  useEffect(() => {
    // Force scroll to top on initial load and clear any hash
    window.scrollTo({ top: 0 });
    window.history.replaceState(null, '', '/');
  }, [pathname, hasInitialized]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Only track sections when on landing page and after initialization
      if (pathname === '/' && hasInitialized) {
        const sections = ['home', 'product', 'features', 'architecture', 'pricing', 'cta'];
        const scrollPosition = window.scrollY + 100; // Offset for fixed header

        let currentSection = '';

        // Check if we're at the very top (hero section)
        if (window.scrollY < 100) {
          currentSection = 'home';
        } else {
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
        }

        setActiveSection(currentSection);
      } else if (pathname !== '/') {
        setActiveSection('');
      }
    };

    // Only run scroll handler after initialization for homepage
    if (pathname !== '/' || hasInitialized) {
      handleScroll();
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }

    // Return empty cleanup function for cases where no event listener is added
    return () => { };
  }, [pathname, hasInitialized]);

  const navItems = [
    { name: 'Home', href: '/', section: 'home' },
    { name: 'Features', href: '/#features', section: 'features' },
    { name: 'Why Kostra', href: '/#architecture', section: 'architecture' },
    { name: 'Blog', href: '/blog', section: '' },
    { name: 'Pricing', href: '/#pricing', section: 'pricing' },]

  const isActive = (item: { href: string; section: string }) => {
    // For anchor links on landing page, check if this section is currently in view
    if (pathname === '/' && item.section) {
      return activeSection === item.section;
    }
    return false;
  };

  return (
    <motion.nav
      className={`fixed left-0 right-0 top-0 z-50 border-b transition-all duration-300 ${isScrolled
        ? 'border-gray-500/20  bg-black/80 backdrop-blur-md'
        : 'border-transparent bg-transparent'
        }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-12 items-center justify-between md:h-16">
          {/* Logo */}
          <motion.button
            onClick={() => {
              if (pathname === '/') {
                // If already on homepage, scroll to top (home section)
                window.scrollTo({ top: 0, behavior: 'smooth' });
                // Update URL to remove any hash or set to home
                window.history.pushState(null, '', '/');
              } else {
                // If on different page, navigate to homepage
                router.push(siteConfig.baseLinks.landing);
              }
            }}
            className="flex items-center gap-2 sm:gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="h-6 w-6 sm:h-8 sm:w-8">
              <Image
                src="/logos/light-logo.png"
                alt="Next.js Boilerplate Logo"
                width={32}
                height={32}
                className="h-full w-full object-contain"
              />
            </div>
          </motion.button>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex lg:gap-8">
            {navItems.map(item => {
              const active = isActive(item);
              return (
                <Link key={item.name} href={item.href}>
                  <motion.span
                    className={`cursor-pointer text-sm font-medium transition-colors duration-200 ${active ? 'text-primary' : 'text-gray-50 hover:text-primary-hover'
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
            {user ? <UserProfile /> : <SignInButton onClick={openModal} variant="light" />}
          </div>

          {/* Mobile menu button */}
          <motion.button
            className="hover:bg-white/5 flex h-10 w-10 items-center justify-center rounded-lg p-2 text-gray-200 transition-colors hover:text-white md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle mobile menu"
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
            className="border-gray-500/20  bg-black/95 border-t backdrop-blur-md md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col gap-1 py-4">
              {navItems.map(item => {
                const active = isActive(item);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-4 py-3 text-sm font-medium transition-colors duration-200 ${active
                      ? 'bg-white/10 text-white'
                      : 'hover:bg-white/5 text-gray-200 hover:text-white'
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}

              {/* Legal Links */}
              <div className="border-gray-500/20  flex flex-col gap-1 border-t px-4 pt-4">
                <Link
                  href={siteConfig.baseLinks.privacy}
                  className="py-2 text-xs font-medium text-gray-200 underline transition-colors duration-200 hover:text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Privacy Policy
                </Link>
                <Link
                  href={siteConfig.baseLinks.terms}
                  className="py-2 text-xs font-medium text-gray-200 underline transition-colors duration-200 hover:text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Terms of Service
                </Link>
              </div>

              <div className="border-gray-500/20  flex flex-col gap-3 border-t px-4 pt-4">
                {user ? (
                  <div className="py-2">
                    <UserProfile />
                  </div>
                ) : (
                  <div className="py-2">
                    <SignInButton onClick={openModal} variant="light" className="w-full" />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
