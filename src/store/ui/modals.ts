'use client';

import { create } from 'zustand';

interface UiModalsState {
  creditPurchaseOpen: boolean;
  openCreditPurchase: () => void;
  closeCreditPurchase: () => void;
}

export const useUiModalsStore = create<UiModalsState>(set => ({
  creditPurchaseOpen: false,
  openCreditPurchase: () => set(() => ({ creditPurchaseOpen: true })),
  closeCreditPurchase: () => set(() => ({ creditPurchaseOpen: false })),
}));

// Convenience global function to open the credit purchase modal without importing the hook in components
export const openCreditPurchase = () => useUiModalsStore.getState().openCreditPurchase();
export const closeCreditPurchase = () => useUiModalsStore.getState().closeCreditPurchase();
