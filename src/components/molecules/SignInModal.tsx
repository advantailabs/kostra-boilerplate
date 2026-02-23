'use client';

import { Button } from '@/components/atom/Button';
import { EmailSignInForm } from '@/components/molecules/form/EmailSignInForm';
import { EmailSignUpForm } from '@/components/molecules/form/EmailSignUpForm';
import { ForgotPasswordForm } from '@/components/molecules/form/ForgotPasswordForm';
import { OTPVerificationForm } from '@/components/molecules/form/OTPVerificationForm';
import { ResetPasswordForm } from '@/components/molecules/form/ResetPasswordForm';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { GoogleSignInButton } from './common/GoogleSignInButton';

type AuthMode = 'signin' | 'signup' | 'otp-verification' | 'forgot-password' | 'reset-password';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [signupData, setSignupData] = useState<{ name: string; email: string } | null>(null);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState<string>('');

  // Resets state and closes
  const handleOnClose = useCallback(() => {
    setAuthMode('signin');
    setSignupData(null);
    setForgotPasswordEmail('');
    onClose();
  }, [onClose]);


  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleOnClose();
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
  }, [isOpen, handleOnClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={e => {
        if (e.target === e.currentTarget) {
          handleOnClose();
        }
      }}
      onKeyDown={e => {
        if (e.key === 'Escape') {
          handleOnClose();
        }
      }}
      className="bg-black/50 fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-md"
      aria-label="Close modal backdrop"
      role="button"
      tabIndex={0}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative mx-4 w-full max-w-sm overflow-hidden rounded-2xl border border-neutral-900 bg-[#080a0c] shadow-2xl transition-all duration-300"
      >
        {/* Close button */}
        <Button
          onClick={handleOnClose}
          variant="ghost"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#080a0c] text-gray-50 transition-colors hover:bg-neutral-900 hover:text-gray-100 p-0"
          aria-label="Close modal"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
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
                src="/logos/dark-logo.png"
                alt="Kostra Logo"
                width={52}
                height={52}
                className="drop-shadow-xs"
              />
            </div>
            <h1 id="modal-title" className="mb-2 text-2xl font-bold text-gray-100">
              {authMode === 'signin' && 'Welcome to Kostra'}
              {authMode === 'signup' && 'Sign Up'}
              {authMode === 'otp-verification' && 'Verify Your Email'}
              {authMode === 'forgot-password' && 'Reset Password'}
              {authMode === 'reset-password' && 'Enter New Password'}
            </h1>
            <p className="text-center text-xs text-gray-400">
              {authMode === 'signin' && 'Join thousands of teams already using Kostra'}
              {authMode === 'signup' && 'Start your journey with us'}
              {authMode === 'otp-verification' && 'Complete your account setup'}
              {authMode === 'forgot-password' && 'Enter your email to receive a reset code'}
              {authMode === 'reset-password' && 'Enter the code and your new password'}
            </p>
          </div>

          {/* Render appropriate form based on auth mode */}
          {authMode === 'signin' && (
            <>
              <EmailSignInForm
                onSuccess={() => handleOnClose()}
                onSwitchToSignUp={() => setAuthMode('signup')}
                onForgotPassword={() => setAuthMode('forgot-password')}
              />

              <div className="mt-3 flex items-center justify-center gap-2">
                <div className="h-px flex-1 bg-gray-500" />
                <span className="text-sm text-gray-400">or</span>
                <div className="h-px flex-1 bg-gray-500" />
              </div>

              <div className="mt-3">
                <GoogleSignInButton className="w-full" />
              </div>
            </>
          )}

          {authMode === 'signup' && (
            <EmailSignUpForm
              onSuccess={data => {
                setSignupData(data);
                setAuthMode('otp-verification');
              }}
              onSwitchToSignIn={() => setAuthMode('signin')}
            />
          )}

          {authMode === 'otp-verification' && signupData && (
            <OTPVerificationForm
              email={signupData.email}
              name={signupData.name}
              onSuccess={() => handleOnClose()}
              onResendOTP={() => {
                // Resend OTP is handled by the OTPVerificationForm component
              }}
            />
          )}

          {authMode === 'forgot-password' && (
            <ForgotPasswordForm
              onSuccess={email => {
                setForgotPasswordEmail(email);
                setAuthMode('reset-password');
              }}
              onBackToSignIn={() => setAuthMode('signin')}
            />
          )}

          {authMode === 'reset-password' && forgotPasswordEmail && (
            <ResetPasswordForm
              email={forgotPasswordEmail}
              onSuccess={() => handleOnClose()}
              onBackToSignIn={() => setAuthMode('signin')}
            />
          )}

          <div className="mt-6 flex items-center justify-center gap-2 border-t border-gray-500 pt-6 text-center">
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
              <span className="text-sm text-gray-400">
                Secured by{' '}
                <Image
                  src="/logos/dark-logo.png"
                  alt="Kostra Logo"
                  width={50}
                  height={50}
                  className="inline-block h-4 w-auto object-contain"
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
