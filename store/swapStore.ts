import { create } from "zustand";
import type { Address } from "viem";

interface SwapState {
  fromToken?: Address;
  toToken?: Address;
  fromAmount: string;
  toAmount: string;

  slippage: number;

  setFromToken: (token: Address) => void;
  setToToken: (token: Address) => void;
  setFromAmount: (amount: string) => void;
  setToAmount: (amount: string) => void;
  setSlippage: (value: number) => void;

  reset: () => void;
}

export const useSwapStore = create<SwapState>((set) => ({
  fromToken: undefined,
  toToken: undefined,
  fromAmount: "",
  toAmount: "",
  slippage: 0.5,

  setFromToken: (token) => set({ fromToken: token }),
  setToToken: (token) => set({ toToken: token }),
  setFromAmount: (amount) => set({ fromAmount: amount }),
  setToAmount: (amount) => set({ toAmount: amount }),
  setSlippage: (value) => set({ slippage: value }),

  reset: () =>
    set({
      fromToken: undefined,
      toToken: undefined,
      fromAmount: "",
      toAmount: "",
    }),
}));
