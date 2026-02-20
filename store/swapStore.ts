import { create } from "zustand";
import { Address } from "viem";

interface SwapState {
  tokenIn?: Address;
  tokenOut?: Address;
  amountIn: string;
  slippageBps: number;
  feeOnTransfer: boolean;

  setTokenIn: (address: Address) => void;
  setTokenOut: (address: Address) => void;
  setAmountIn: (amount: string) => void;
  setSlippage: (bps: number) => void;
  setFeeOnTransfer: (enabled: boolean) => void;
}

export const useSwapStore = create<SwapState>((set) => ({
  tokenIn: undefined,
  tokenOut: undefined,
  amountIn: "",
  slippageBps: 50,
  feeOnTransfer: false,

  setTokenIn: (address) => set({ tokenIn: address }),
  setTokenOut: (address) => set({ tokenOut: address }),
  setAmountIn: (amount) => set({ amountIn: amount }),
  setSlippage: (bps) => set({ slippageBps: bps }),
  setFeeOnTransfer: (enabled) => set({ feeOnTransfer: enabled }),
}));
