import { motion } from 'framer-motion';
import React from 'react';

interface SignInButtonProps {
  onClick: () => void;
  className?: string;
  variant?: 'light' | 'dark' | 'link';
  children?: React.ReactNode;
}

export function SignInButton({
  onClick,
  className = '',
  variant = 'light',
  children,
}: SignInButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-offset-2';

  const variantClasses =
    variant === 'light'
      ? 'bg-white text-black border border-gray-200'
      : 'bg-black text-white border border-gray-600';

  return (
    <motion.button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {children || 'Sign in'}
    </motion.button>
  );
}
