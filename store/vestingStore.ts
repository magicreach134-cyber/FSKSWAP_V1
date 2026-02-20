import { create } from "zustand";

interface VestingState {
  claimable?: bigint;
  setClaimable: (amount: bigint) => void;
}

export const useVestingStore = create<VestingState>((set) => ({
  claimable: undefined,
  setClaimable: (amount) => set({ claimable: amount }),
}));
