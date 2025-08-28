'use client';

import { SignInModal } from '@/components/molecules/SignInModal';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

interface SignInModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const SignInModalContext = createContext<SignInModalContextType | undefined>(undefined);

export function useSignInModalContext() {
  const context = useContext(SignInModalContext);
  if (!context) {
    throw new Error('useSignInModalContext must be used within a SignInModalProvider');
  }
  return context;
}

export function SignInModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      openModal,
      closeModal,
    }),
    [isOpen, openModal, closeModal]
  );

  return (
    <SignInModalContext.Provider value={value}>
      {children}
      <SignInModal isOpen={isOpen} onClose={closeModal} />
    </SignInModalContext.Provider>
  );
}
