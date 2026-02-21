"use client";

import { useWalletStore } from "@/store/walletStore";
import { useTransactionStore } from "@/store/transactionStore";
import { deposit, withdraw, claimRewards } from "@/services/farmService";
import { publicClient } from "@/lib/publicClient";

export function useFarm(pid: number) {
  const { address } = useWalletStore();
  const txStore = useTransactionStore();

  async function stake() {
    if (!address) return;

    try {
      txStore.open();
      txStore.setTitle("Stake LP");
      txStore.setStatus("prompting");

      const hash = await deposit(pid);

      txStore.setHash(hash);
      txStore.setStatus("pending");

      await publicClient.waitForTransactionReceipt({ hash });

      txStore.setStatus("success");
    } catch (err: any) {
      txStore.setError(err?.message);
      txStore.setStatus("error");
    }
  }

  async function unstake() {
    if (!address) return;

    try {
      txStore.open();
      txStore.setTitle("Unstake LP");
      txStore.setStatus("prompting");

      const hash = await withdraw(pid);

      txStore.setHash(hash);
      txStore.setStatus("pending");

      await publicClient.waitForTransactionReceipt({ hash });

      txStore.setStatus("success");
    } catch (err: any) {
      txStore.setError(err?.message);
      txStore.setStatus("error");
    }
  }

  async function harvest() {
    if (!address) return;

    try {
      txStore.open();
      txStore.setTitle("Claim Rewards");
      txStore.setStatus("prompting");

      const hash = await claimRewards(pid);

      txStore.setHash(hash);
      txStore.setStatus("pending");

      await publicClient.waitForTransactionReceipt({ hash });

      txStore.setStatus("success");
    } catch (err: any) {
      txStore.setError(err?.message);
      txStore.setStatus("error");
    }
  }

  return { stake, unstake, harvest };
}
