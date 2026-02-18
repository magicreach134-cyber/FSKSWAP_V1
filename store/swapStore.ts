import { create } from "zustand";

interface SwapStore {
  tokenIn?: `0x${string}`;
  tokenOut?: `0x${string}`;
  amountIn: string;
  slippage: number;

  setTokenIn: (address: `0x${string}`) => void;
  setTokenOut: (address: `0x${string}`) => void;
  setAmountIn: (amount: string) => void;
  setSlippage: (value: number) => void;
}

export const useSwapStore = create<SwapStore>((set) => ({
  tokenIn: undefined,
  tokenOut: undefined,
  amountIn: "",
  slippage: 50, // 0.5% default (basis points)

  setTokenIn: (address) => set({ tokenIn: address }),
  setTokenOut: (address) => set({ tokenOut: address }),
  setAmountIn: (amount) => set({ amountIn: amount }),
  setSlippage: (value) => set({ slippage: value }),
}));
