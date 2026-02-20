import { create } from "zustand";

interface FlashswapState {
  selectedToken?: `0x${string}`;
  amount: string;

  setToken: (token: `0x${string}`) => void;
  setAmount: (amount: string) => void;
}

export const useFlashswapStore = create<FlashswapState>((set) => ({
  selectedToken: undefined,
  amount: "",

  setToken: (token) => set({ selectedToken: token }),
  setAmount: (amount) => set({ amount }),
}));
