import { create } from "zustand";
import { Address } from "viem";

interface WalletState {
  address?: Address;
  chainId?: number;
  connected: boolean;
  connecting: boolean;
  isOpen: boolean;

  requiredChainId: number;

  open: () => void;
  close: () => void;

  setConnecting: (value: boolean) => void;
  setWallet: (address: Address, chainId: number) => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  address: undefined,
  chainId: undefined,
  connected: false,
  connecting: false,
  isOpen: false,

  // BNB Testnet (change to 56 for mainnet later)
  requiredChainId: 97,

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),

  setConnecting: (value) => set({ connecting: value }),

  setWallet: (address, chainId) =>
    set({
      address,
      chainId,
      connected: true,
      connecting: false,
      isOpen: false,
    }),

  disconnect: () =>
    set({
      address: undefined,
      chainId: undefined,
      connected: false,
    }),
}));
