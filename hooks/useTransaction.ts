"use client";

import { useCallback } from "react";
import { useTransactionStore } from "@/store/transactionStore";

export type TransactionStatus =
  | "idle"
  | "prompting"
  | "pending"
  | "success"
  | "error";

interface ExecuteTransactionParams<T> {
  title: string;
  description?: string;
  action: () => Promise<T>;
  onSuccess?: (result: T) => void;
  onError?: (error: unknown) => void;
}

export function useTransaction() {
  const {
    status,
    hash,
    error,
    title,
    description,
    setStatus,
    setHash,
    setError,
    setTitle,
    setDescription,
    reset,
    open,
    close,
  } = useTransactionStore();

  const execute = useCallback(
    async <T>({
      title,
      description,
      action,
      onSuccess,
      onError,
    }: ExecuteTransactionParams<T>) => {
      try {
        setTitle(title);
        setDescription(description || "");
        setError(undefined);
        setHash(undefined);

        open();
        setStatus("prompting");

        const result = await action();

        setStatus("pending");

        if (
          typeof result === "object" &&
          result !== null &&
          "hash" in result
        ) {
          setHash((result as any).hash);
        }

        setStatus("success");

        if (onSuccess) onSuccess(result);

        return result;
      } catch (err: any) {
        const message =
          err?.shortMessage ||
          err?.message ||
          "Transaction failed";

        setError(message);
        setStatus("error");

        if (onError) onError(err);

        throw err;
      }
    },
    [
      setStatus,
      setHash,
      setError,
      setTitle,
      setDescription,
      open,
    ]
  );

  const clear = useCallback(() => {
    reset();
    close();
  }, [reset, close]);

  return {
    status,
    hash,
    error,
    title,
    description,
    execute,
    clear,
    close,
  };
}
