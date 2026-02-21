import { publicClient, walletClient } from "@/lib";
import { stakingAbi } from "@/abi";
import { CONTRACTS } from "@/config";
import { Address } from "viem";

/* =========================================
   WRITE
========================================= */

export async function deposit(
  pid: number,
  amount: bigint
) {
  const [account] = await walletClient.getAddresses();

  return walletClient.writeContract({
    address: CONTRACTS.staking,
    abi: stakingAbi,
    functionName: "deposit",
    args: [BigInt(pid), amount],
    account,
  });
}

export async function withdraw(
  pid: number,
  amount: bigint
) {
  const [account] = await walletClient.getAddresses();

  return walletClient.writeContract({
    address: CONTRACTS.staking,
    abi: stakingAbi,
    functionName: "withdraw",
    args: [BigInt(pid), amount],
    account,
  });
}

/* =========================================
   READ
========================================= */

export async function pendingReward(
  pid: number,
  user: Address
) {
  return publicClient.readContract({
    address: CONTRACTS.staking,
    abi: stakingAbi,
    functionName: "pendingReward",
    args: [BigInt(pid), user],
  });
}

export async function userInfo(
  pid: number,
  user: Address
) {
  return publicClient.readContract({
    address: CONTRACTS.staking,
    abi: stakingAbi,
    functionName: "userInfo",
    args: [BigInt(pid), user],
  });
}

export async function poolInfo(pid: number) {
  return publicClient.readContract({
    address: CONTRACTS.staking,
    abi: stakingAbi,
    functionName: "poolInfo",
    args: [BigInt(pid)],
  });
}
