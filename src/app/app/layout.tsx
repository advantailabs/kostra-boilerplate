'use client';

import { ThemeProvider } from 'next-themes';
import React from 'react';

import { CreditPurchaseModal } from '@/components/molecules/common/CreditPurchaseModal';
import { Sidebar } from '@/components/organisms/shared/navigation/Sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useUiModalsStore } from '@/store/ui/modals';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const creditPurchaseOpen = useUiModalsStore(state => state.creditPurchaseOpen);
  const closeCreditPurchase = useUiModalsStore(state => state.closeCreditPurchase);
  return (
    // <div className="selection:bg-primary/20 mx-auto scroll-auto bg-background antialiased selection:text-primary">
    <ThemeProvider defaultTheme="system" attribute="class">
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <Sidebar />
        <SidebarInset>
          <div className="bg-muted/40 flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 md:gap-6">
                {children}
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
      <CreditPurchaseModal isOpen={creditPurchaseOpen} onClose={closeCreditPurchase} />
    </ThemeProvider>
    // </div>
  );
}
