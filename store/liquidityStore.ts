import { create } from "zustand";
import { Address } from "viem";

interface LiquidityState {
  tokenA?: Address;
  tokenB?: Address;
  amountA: string;
  amountB: string;

  setTokenA: (address: Address) => void;
  setTokenB: (address: Address) => void;
  setAmountA: (value: string) => void;
  setAmountB: (value: string) => void;
}

export const useLiquidityStore = create<LiquidityState>((set) => ({
  tokenA: undefined,
  tokenB: undefined,
  amountA: "",
  amountB: "",

  setTokenA: (address) => set({ tokenA: address }),
  setTokenB: (address) => set({ tokenB: address }),
  setAmountA: (value) => set({ amountA: value }),
  setAmountB: (value) => set({ amountB: value }),
}));
