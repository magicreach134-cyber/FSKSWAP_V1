"use client";

import { publicClient } from "@/lib/publicClient";
import { getWalletClient } from "@/lib/walletClient";
import STAKING_ABI from "@/abi/Staking.json";
import { CONTRACTS } from "@/config";
import type { Address } from "viem";

export async function stake(
  pid: number,
  amount: bigint,
  account: Address
) {
  const walletClient = getWalletClient();

  return walletClient.writeContract({
    address: CONTRACTS.staking,
    abi: STAKING_ABI,
    functionName: "deposit",
    args: [BigInt(pid), amount],
    account,
  });
}

export async function withdraw(
  pid: number,
  amount: bigint,
  account: Address
) {
  const walletClient = getWalletClient();

  return walletClient.writeContract({
    address: CONTRACTS.staking,
    abi: STAKING_ABI,
    functionName: "withdraw",
    args: [BigInt(pid), amount],
    account,
  });
}

export async function claim(
  pid: number,
  account: Address
) {
  const walletClient = getWalletClient();

  // MasterChef style: deposit 0 to claim
  return walletClient.writeContract({
    address: CONTRACTS.staking,
    abi: STAKING_ABI,
    functionName: "deposit",
    args: [BigInt(pid), 0n],
    account,
  });
}

export async function pendingReward(
  pid: number,
  user: Address
) {
  return publicClient.readContract({
    address: CONTRACTS.staking,
    abi: STAKING_ABI,
    functionName: "pendingReward",
    args: [BigInt(pid), user],
  });
}

export async function poolInfo(pid: number) {
  return publicClient.readContract({
    address: CONTRACTS.staking,
    abi: STAKING_ABI,
    functionName: "poolInfo",
    args: [BigInt(pid)],
  });
}

export async function userInfo(
  pid: number,
  user: Address
) {
  return publicClient.readContract({
    address: CONTRACTS.staking,
    abi: STAKING_ABI,
    functionName: "userInfo",
    args: [BigInt(pid), user],
  });
}
