import { create } from "zustand";
import { Address } from "viem";

interface LaunchpadState {
  presaleAddress?: Address;
  contributionAmount: string;
  referral?: Address;

  setPresale: (address: Address) => void;
  setContributionAmount: (amount: string) => void;
  setReferral: (address: Address) => void;
}

export const useLaunchpadStore = create<LaunchpadState>((set) => ({
  presaleAddress: undefined,
  contributionAmount: "",
  referral: undefined,

  setPresale: (address) => set({ presaleAddress: address }),
  setContributionAmount: (amount) =>
    set({ contributionAmount: amount }),
  setReferral: (address) => set({ referral: address }),
}));
