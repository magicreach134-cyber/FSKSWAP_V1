import { create } from "zustand";

interface TreasuryState {
  revenue?: bigint;
  setRevenue: (amount: bigint) => void;
}

export const useTreasuryStore = create<TreasuryState>((set) => ({
  revenue: undefined,
  setRevenue: (amount) => set({ revenue: amount }),
}));
