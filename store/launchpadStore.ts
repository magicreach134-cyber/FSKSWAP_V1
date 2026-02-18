import { create } from "zustand";

interface LaunchpadStore {
  contributionAmount: string;
  referral?: `0x${string}`;

  setContributionAmount: (amount: string) => void;
  setReferral: (address: `0x${string}`) => void;
}

export const useLaunchpadStore = create<LaunchpadStore>((set) => ({
  contributionAmount: "",
  referral: undefined,

  setContributionAmount: (amount) =>
    set({ contributionAmount: amount }),

  setReferral: (address) => set({ referral: address }),
}));
