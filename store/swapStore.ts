import { create } from "zustand";
import type { Address } from "viem";

interface SwapState {
  fromToken?: Address;
  toToken?: Address;

  fromAmount: string;
  toAmount: string;

  slippage: number;

  // 🔥 New Professional Fields
  priceImpact: number;
  route: Address[];
  hasLiquidity: boolean;
  isQuoting: boolean;

  // Actions
  setFromToken: (token: Address) => void;
  setToToken: (token: Address) => void;
  setFromAmount: (amount: string) => void;
  setToAmount: (amount: string) => void;
  setSlippage: (value: number) => void;

  setPriceImpact: (impact: number) => void;
  setRoute: (route: Address[]) => void;
  setHasLiquidity: (value: boolean) => void;
  setIsQuoting: (value: boolean) => void;

  reset: () => void;
}

export const useSwapStore = create<SwapState>((set) => ({
  fromToken: undefined,
  toToken: undefined,

  fromAmount: "",
  toAmount: "",

  slippage: 0.5,

  // 🔥 New Defaults
  priceImpact: 0,
  route: [],
  hasLiquidity: true,
  isQuoting: false,

  // -----------------------------
  // Basic setters
  // -----------------------------
  setFromToken: (token) =>
    set({ fromToken: token, toAmount: "", priceImpact: 0 }),

  setToToken: (token) =>
    set({ toToken: token, toAmount: "", priceImpact: 0 }),

  setFromAmount: (amount) =>
    set({ fromAmount: amount }),

  setToAmount: (amount) =>
    set({ toAmount: amount }),

  setSlippage: (value) =>
    set({ slippage: value }),

  // -----------------------------
  // Advanced setters
  // -----------------------------
  setPriceImpact: (impact) =>
    set({ priceImpact: impact }),

  setRoute: (route) =>
    set({ route }),

  setHasLiquidity: (value) =>
    set({ hasLiquidity: value }),

  setIsQuoting: (value) =>
    set({ isQuoting: value }),

  // -----------------------------
  // Reset
  // -----------------------------
  reset: () =>
    set({
      fromToken: undefined,
      toToken: undefined,
      fromAmount: "",
      toAmount: "",
      priceImpact: 0,
      route: [],
      hasLiquidity: true,
      isQuoting: false,
    }),
}));
