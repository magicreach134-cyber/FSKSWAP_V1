"use client";

import { useWalletStore } from "@/store/walletStore";
import { useTransactionStore } from "@/store/transactionStore";
import {
  deposit,
  withdraw,
  pendingReward,
  userInfo,
} from "@/services/farmService";
import { publicClient } from "@/lib/publicClient";

export function useFarm(pid: number) {
  const { address } = useWalletStore();
  const txStore = useTransactionStore();

  async function refresh() {
    if (!address) return;

    const [user, pending] = await Promise.all([
      userInfo(pid, address),
      pendingReward(pid, address),
    ]);

    return {
      staked: user.amount,
      rewardDebt: user.rewardDebt,
      pending,
    };
  }

  async function stake(amount: bigint) {
    if (!address) return;

    try {
      txStore.open();
      txStore.setTitle("Stake LP");
      txStore.setStatus("prompting");

      const hash = await deposit(pid, amount);

      txStore.setHash(hash);
      txStore.setStatus("pending");

      await publicClient.waitForTransactionReceipt({ hash });

      txStore.setStatus("success");
    } catch (err: any) {
      txStore.setError(err?.message);
      txStore.setStatus("error");
    }
  }

  async function unstake(amount: bigint) {
    if (!address) return;

    try {
      txStore.open();
      txStore.setTitle("Unstake LP");
      txStore.setStatus("prompting");

      const hash = await withdraw(pid, amount);

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

    // In MasterChef contracts, harvest = deposit(pid, 0)
    await stake(0n);
  }

  return {
    refresh,
    stake,
    unstake,
    harvest,
  };
}
