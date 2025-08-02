'use client';

import { SignInButton, useUser } from '@clerk/nextjs';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export function InnovativeHero() {
  const { isSignedIn, isLoaded } = useUser();
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
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black"
    >
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

      <motion.div className="container relative z-10 mx-auto px-6" style={{ y, opacity }}>
        <div className="mx-auto max-w-5xl text-center">
          {/* Main headline with typing effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-6xl font-light leading-none tracking-tight text-white md:text-8xl">
              Let your{' '}
              <span className="relative">
                <span className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                  Peon
                </span>
                <motion.div
                  className="absolute -right-1 top-0 h-full w-0.5 bg-white"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </span>
              <br />
              manage your files
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-gray-400 md:text-2xl"
          >
            <span className="text-white">Convert your knowledge into intelligence</span> with
            AI-powered research and analysis that goes beyond simple question answering
          </motion.p>

          {/* Interactive CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            {isLoaded && isSignedIn ? (
              <Link href="/app/chat">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative cursor-pointer overflow-hidden rounded-lg border border-white/30 bg-transparent px-8 py-4 text-lg font-medium text-white transition-all duration-300"
                >
                  <span className="relative z-10">Start a new chat</span>
                  <motion.div
                    className="absolute inset-0 bg-white/10"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </Link>
            ) : (
              <SignInButton mode="modal">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative cursor-pointer overflow-hidden rounded-lg border border-white/30 bg-transparent px-8 py-4 text-lg font-medium text-white transition-all duration-300"
                >
                  <span className="relative z-10">Ready to get started?</span>
                  <motion.div
                    className="absolute inset-0 bg-white/10"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </SignInButton>
            )}

            {isLoaded && isSignedIn ? (
              <Link href="/app">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative overflow-hidden rounded-lg bg-white px-8 py-4 text-lg font-medium text-black transition-all duration-300"
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
              <SignInButton mode="modal">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative overflow-hidden rounded-lg bg-white px-8 py-4 text-lg font-medium text-black transition-all duration-300"
                >
                  <span className="relative z-10">Start Asking Now</span>
                  <motion.div
                    className="absolute inset-0 bg-gray-200"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </SignInButton>
            )}
          </motion.div>

          {/* Metrics bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mx-auto mt-20 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3"
          >
            {[
              { value: '100k+', label: 'Documents processed' },
              { value: '50+', label: 'Enterprises' },
              { value: '70%', label: 'Time saved' },
            ].map((metric, index) => (
              <div key={index} className="text-center">
                <div className="mb-2 text-3xl font-light text-white md:text-4xl">
                  {metric.value}
                </div>
                <div className="text-sm uppercase tracking-wide text-gray-500">{metric.label}</div>
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
          className="flex flex-col items-center gap-2 text-gray-500"
        >
          <span className="text-xs uppercase tracking-wide">Scroll</span>
          <div className="flex h-6 w-4 justify-center rounded-full border border-gray-500">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              className="mt-1 h-2 w-0.5 rounded-full bg-gray-500"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
