'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { siteConfig } from '@/app/siteConfig';
import { SignInButton } from '@/components/atom/SignInButton';
import { useSignInModalContext } from '@/providers/SignInModalProvider';
import { useAuthStore } from '@/store/auth';

export function InnovativeHero() {
  const { user } = useAuthStore();
  const { openModal } = useSignInModalContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-[calc(100vh-3rem)] items-center justify-center overflow-hidden bg-black md:min-h-screen"
    >
      {/* Subtle fade to next section */}
      <div className="from-gray-950/20 via-gray-950/10 pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t to-transparent" />
      {/* Animated grid background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
          }}
        />
      </div>

      {/* Interactive spotlight effect */}
      <div
        className="pointer-events-none absolute h-96 w-96 rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          transition: 'all 0.3s ease',
        }}
      />

      <motion.div className="container relative z-10 mx-auto px-4 sm:px-6" style={{ y, opacity }}>
        <div className="mx-auto max-w-5xl text-center">
          {/* Main headline with typing effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-6 sm:mb-8"
          >
            <h1 className="text-4xl font-light leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
              Best{' '}
              <span className="relative">
                <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                  Next.js
                </span>
                <motion.div
                  className="absolute -right-1 top-0 h-full w-0.5 bg-white"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </span>
              <br />
              boilerplate
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-white sm:mb-12 sm:text-xl md:text-2xl"
          >
            <span className="text-primary">A comprehensive Next.js boilerplate</span> with modern
            features, authentication, and scalable architecture to accelerate your development
          </motion.p>

          {/* Interactive CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
          >
            {user ? (
              <Link href={siteConfig.baseLinks.home}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative overflow-hidden rounded-lg bg-white px-6 py-3 text-base font-medium text-black transition-all duration-300 sm:px-8 sm:py-4 sm:text-lg"
                >
                  <span className="relative z-10">Go to App</span>
                  <motion.div
                    className="absolute inset-0 bg-gray-200"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </Link>
            ) : (
              <SignInButton
                onClick={openModal}
                variant="light"
                className="group relative overflow-hidden rounded-lg bg-white px-6 py-3 text-base font-medium text-black transition-all duration-300 sm:px-8 sm:py-4 sm:text-lg"
              >
                <span className="relative z-10">Get Started</span>
              </SignInButton>
            )}
          </motion.div>

          {/* Metrics bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-6 sm:mt-20 sm:gap-8 md:grid-cols-3"
          >
            {[
              { value: '100+', label: 'Components included' },
              { value: '50+', label: 'Features ready' },
              { value: '90%', label: 'Time saved' },
            ].map((metric, index) => (
              <div key={index} className="text-center">
                <div className="mb-2 text-2xl font-light text-white sm:text-3xl md:text-4xl">
                  {metric.value}
                </div>
                <div className="text-xs uppercase tracking-wide text-primary sm:text-sm">
                  {metric.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-gray-400"
        >
          <span className="text-xs uppercase tracking-wide">Scroll</span>
          <div className="flex h-6 w-4 justify-center rounded-full border border-gray-500">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              className="mt-1 h-2 w-0.5 rounded-full bg-gray-400"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
