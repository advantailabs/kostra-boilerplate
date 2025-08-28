'use client';

import { Button } from '@/components/atom/Button';
import Image from 'next/image';
import React from 'react';
import { GoogleSignInButton } from './common/GoogleSignInButton';

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

  if (!isOpen) return null;

  return (
    <div
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
        <Button
          onClick={onClose}
          variant="ghost"
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
        </Button>

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

          <GoogleSignInButton className="w-full" />

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
    </div>
  );
}

export { SignInModal };
