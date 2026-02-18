import { create } from "zustand";
import { WalletState } from "@/types";

interface WalletStore extends WalletState {
  setWallet: (address: `0x${string}`, chainId: number) => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  address: undefined,
  chainId: undefined,
  connected: false,

  setWallet: (address, chainId) =>
    set({
      address,
      chainId,
      connected: true,
    }),

  disconnect: () =>
    set({
      address: undefined,
      chainId: undefined,
      connected: false,
    }),
}));
