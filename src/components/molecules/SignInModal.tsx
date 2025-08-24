'use client';

import Image from 'next/image';
import React from 'react';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function SignInModal({ isOpen, onClose }: SignInModalProps) {
  // Handle escape key to close modal
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleGoogleSignIn = () => {
    try {
      window.location.href = '/api/auth/google';
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <button
      type="button"
      onClick={e => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-md"
      aria-label="Close modal backdrop"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative mx-4 w-full max-w-sm overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl transition-all duration-300"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          aria-label="Close modal"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Content */}
        <div className="p-8">
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <Image
                src="/logos/dark-logo.svg"
                alt="Peon Logo"
                width={52}
                height={52}
                className="drop-shadow-sm"
              />
            </div>
            <h1 id="modal-title" className="mb-2 text-2xl font-bold text-gray-900">
              Welcome to Peon
            </h1>
            <p className="text-center text-xs text-gray-500">
              Join thousands of teams already using Peon
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:text-gray-900"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 border-t border-gray-100 pt-6 text-center">
            <div className="flex items-center justify-center gap-1">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-400"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <circle cx="12" cy="16" r="1" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span className="text-xs text-gray-500">
                Secured by{' '}
                <Image
                  src="/logos/dark-full-logo.svg"
                  alt="Peon Logo"
                  width={50}
                  height={50}
                  className="inline-block h-3 w-auto object-contain"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

export { SignInModal };
