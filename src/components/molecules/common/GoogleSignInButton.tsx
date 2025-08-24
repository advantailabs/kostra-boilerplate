'use client';

import { Button } from '@/components/atom/Button';
import React from 'react';

interface GoogleSignInButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function GoogleSignInButton({
  className,
  children = 'Sign in with Google',
}: GoogleSignInButtonProps) {
  const handleSignIn = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <Button onClick={handleSignIn} className={className} variant="secondary">
      <svg
        className="mr-2 h-4 w-4"
        aria-hidden="true"
        focusable="false"
        data-prefix="fab"
        data-icon="google"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 488 512"
      >
        <path
          fill="currentColor"
          d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h240z"
        />
      </svg>
      {children}
    </Button>
  );
}
