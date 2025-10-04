'use client';

import { ThemeProvider } from 'next-themes';
import React from 'react';

import { CreditPurchaseModal } from '@/components/molecules/common/CreditPurchaseModal';
import { Sidebar } from '@/components/organisms/shared/navigation/Sidebar';
import { useUiModalsStore } from '@/store/ui/modals';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const creditPurchaseOpen = useUiModalsStore(state => state.creditPurchaseOpen);
  const closeCreditPurchase = useUiModalsStore(state => state.closeCreditPurchase);
  return (
    <div className="selection:bg-primary/20 mx-auto scroll-auto bg-background antialiased selection:text-primary">
      <ThemeProvider defaultTheme="system" attribute="class">
        <Sidebar />
        <main className="lg:pl-60">{children}</main>
        <CreditPurchaseModal isOpen={creditPurchaseOpen} onClose={closeCreditPurchase} />
      </ThemeProvider>
    </div>
  );
}
