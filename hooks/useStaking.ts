"use client";

import { parseUnits } from "viem";
import { stake, withdraw, claim } from "@/services/stakingService";
import { useWalletStore } from "@/store/walletStore";
import { useTransactionStore } from "@/store/transactionStore";
import { publicClient } from "@/lib/publicClient";

export function useStaking(pid: number, decimals = 18) {
  const { address } = useWalletStore();
  const txStore = useTransactionStore();

  async function handleStake(amountStr: string) {
    if (!address) return;

    const amount = parseUnits(amountStr, decimals);

    txStore.open();
    txStore.setTitle("Stake Tokens");
    txStore.setStatus("prompting");

    const hash = await stake(pid, amount, address);

    txStore.setHash(hash);
    txStore.setStatus("pending");

    await publicClient.waitForTransactionReceipt({ hash });

    txStore.setStatus("success");
  }

  async function handleWithdraw(amountStr: string) {
    if (!address) return;

    const amount = parseUnits(amountStr, decimals);

    txStore.open();
    txStore.setTitle("Withdraw Tokens");
    txStore.setStatus("prompting");

    const hash = await withdraw(pid, amount, address);

    txStore.setHash(hash);
    txStore.setStatus("pending");

    await publicClient.waitForTransactionReceipt({ hash });

    txStore.setStatus("success");
  }

  async function handleClaim() {
    if (!address) return;

    txStore.open();
    txStore.setTitle("Claim Rewards");
    txStore.setStatus("prompting");

    const hash = await claim(pid, address);

    txStore.setHash(hash);
    txStore.setStatus("pending");

    await publicClient.waitForTransactionReceipt({ hash });

    txStore.setStatus("success");
  }

  return {
    handleStake,
    handleWithdraw,
    handleClaim,
  };
}
