import { create } from "zustand";

interface FarmStore {
  selectedPid?: number;
  stakeAmount: string;

  setSelectedPid: (pid: number) => void;
  setStakeAmount: (amount: string) => void;
}

export const useFarmStore = create<FarmStore>((set) => ({
  selectedPid: undefined,
  stakeAmount: "",

  setSelectedPid: (pid) => set({ selectedPid: pid }),
  setStakeAmount: (amount) => set({ stakeAmount: amount }),
}));
