import { create } from "zustand";
import { Address } from "viem";

interface WalletState {
  address?: Address;
  chainId?: number;
  connected: boolean;

  setWallet: (address: Address, chainId: number) => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  address: undefined,
  chainId: undefined,
  connected: false,

  setWallet: (address, chainId) =>
    set({ address, chainId, connected: true }),

  disconnect: () =>
    set({ address: undefined, chainId: undefined, connected: false }),
}));
