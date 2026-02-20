import { create } from "zustand";

export type TxStatus =
  | "idle"
  | "approving"
  | "pending"
  | "success"
  | "error";

interface TransactionState {
  status: TxStatus;
  hash?: `0x${string}`;
  error?: string;

  setStatus: (status: TxStatus) => void;
  setHash: (hash: `0x${string}`) => void;
  setError: (error?: string) => void;
  reset: () => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  status: "idle",

  setStatus: (status) => set({ status }),
  setHash: (hash) => set({ hash }),
  setError: (error) => set({ error }),

  reset: () =>
    set({
      status: "idle",
      hash: undefined,
      error: undefined,
    }),
}));
