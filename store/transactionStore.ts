import { create } from "zustand";

export type TxStatus =
  | "idle"
  | "prompting"
  | "pending"
  | "success"
  | "error";

interface TransactionState {
  isOpen: boolean;
  status: TxStatus;
  hash?: `0x${string}`;
  error?: string;
  title?: string;
  description?: string;

  open: () => void;
  close: () => void;

  setStatus: (status: TxStatus) => void;
  setHash: (hash?: `0x${string}`) => void;
  setError: (error?: string) => void;
  setTitle: (title?: string) => void;
  setDescription: (description?: string) => void;

  reset: () => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  isOpen: false,
  status: "idle",

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),

  setStatus: (status) => set({ status }),
  setHash: (hash) => set({ hash }),
  setError: (error) => set({ error }),
  setTitle: (title) => set({ title }),
  setDescription: (description) => set({ description }),

  reset: () =>
    set({
      isOpen: false,
      status: "idle",
      hash: undefined,
      error: undefined,
      title: undefined,
      description: undefined,
    }),
}));
