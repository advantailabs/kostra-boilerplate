'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import { siteConfig } from '@/app/siteConfig';
import { useAuthStore } from '@/store/auth';

type FooterLink = {
  name: string;
  href: string;
  isSignIn?: boolean;
  isDashboard?: boolean;
};

type FooterSection = {
  title: string;
  links: FooterLink[];
};

const footerSections: FooterSection[] = [
  {
    title: 'Product',
    links: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Security', href: '#security' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'Contact', href: '/contact' },
      { name: 'Sign In', href: '#', isSignIn: true },
      { name: 'Dashboard', href: '/app', isDashboard: true },
    ],
  },
  {
    title: 'Resources',
    links: [
      { name: 'Security', href: '#security' },
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Terms of Service', href: '/terms-of-services' },
    ],
  },
];

export function MinimalFooter() {
  const { user } = useAuthStore();

  return (
    <footer className="border-gray-500/20 border-t bg-black">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Main footer content */}
        <div className="py-12 sm:py-16">
          <div className="grid gap-8 sm:gap-12 lg:grid-cols-5">
            {/* Brand section */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                {/* Logo */}
                <div className="mb-4 flex items-center sm:mb-6">
                  <div className="h-6 w-6 sm:h-8 sm:w-8">
                    <Image
                      src="/logos/light-logo.png"
                      alt="Next.js Boilerplate Logo"
                      width={80}
                      height={20}
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>

                <p className="mb-6 max-w-md leading-relaxed text-gray-400 sm:mb-8 sm:text-sm">
                  A comprehensive Next.js boilerplate with modern features, authentication, and
                  scalable architecture.
                </p>

                {/* Social links */}
                {/* <div className="flex gap-4">
                  {[
                    {
                      name: 'Twitter',
                      href: '#',
                      icon: (
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                      ),
                    },
                    {
                      name: 'GitHub',
                      href: '#',
                      icon: (
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      ),
                    },
                    {
                      name: 'LinkedIn',
                      href: '#',
                      icon: (
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      ),
                    },
                  ].map(social => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-500/20  bg-white/5 text-gray-400 transition-all duration-200 hover:border-white/20 hover:text-white"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div> */}
              </motion.div>
            </div>

            {/* Footer links */}
            {footerSections.map((section, sectionIndex) => (
              <div key={section.title}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="mb-4 font-medium text-white sm:mb-6 sm:text-sm">
                    {section.title}
                  </h3>
                  <ul className="space-y-3 sm:space-y-4">
                    {section.links.map(link => {
                      // Skip sign-in link if user is already signed in
                      if (link.isSignIn && user) return null;
                      // Skip dashboard link if user is not signed in
                      if (link.isDashboard && !user) return null;

                      return (
                        <li key={link.name}>
                          {(() => {
                            if (link.isDashboard) {
                              return (
                                <Link
                                  href={link.href}
                                  className="text-xs text-gray-400 transition-colors duration-200 hover:text-white sm:text-sm"
                                >
                                  {link.name}
                                </Link>
                              );
                            }
                            return (
                              <Link
                                href={link.href}
                                className={`text-xs transition-colors duration-200 sm:text-sm  text-gray-400 hover:text-white ${link.name === 'Privacy Policy' || link.name === 'Terms of Service'
                                  ? 'font-medium  underline'
                                  : ''
                                  }`}
                              >
                                {link.name}
                              </Link>
                            );
                          })()}
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom section */}
        <motion.div
          className="border-gray-500/20 flex flex-col items-center justify-between gap-4 border-t py-6 sm:py-8 md:flex-row"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400 sm:gap-6 sm:text-sm">
            <span>© {new Date().getFullYear()} Next.js Boilerplate. All rights reserved.</span>
            <Link
              href={siteConfig.baseLinks.privacy}
              className="font-medium text-gray-50 underline transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>
            <Link
              href={siteConfig.baseLinks.terms}
              className="font-medium text-gray-50 underline transition-colors hover:text-white"
            >
              Terms of Service
            </Link>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-50 sm:text-sm">
            <div className="h-2 w-2 rounded-full bg-success" />
            <span>All systems operational</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
