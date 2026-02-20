import { publicClient, walletClient } from "@/lib";
import { vestingAbi } from "@/abi";
import { CONTRACTS } from "@/config";
import { Address } from "viem";

/* =========================================
   WRITE — CLAIM
========================================= */

export async function claim() {
  const [account] = await walletClient.getAddresses();

  return walletClient.writeContract({
    address: CONTRACTS.vesting,
    abi: vestingAbi,
    functionName: "claim",
    args: [],
    account,
  });
}

/* =========================================
   READ — CLAIMABLE
========================================= */

export async function claimable(
  user: Address
): Promise<bigint> {
  return publicClient.readContract({
    address: CONTRACTS.vesting,
    abi: vestingAbi,
    functionName: "claimable",
    args: [user],
  });
}

/* =========================================
   READ — VESTING SCHEDULE
========================================= */

export async function vestingSchedule(
  user: Address
) {
  return publicClient.readContract({
    address: CONTRACTS.vesting,
    abi: vestingAbi,
    functionName: "vestingSchedule",
    args: [user],
  });
}

/* =========================================
   READ — TOTAL RELEASED
========================================= */

export async function totalReleased(
  user: Address
): Promise<bigint> {
  return publicClient.readContract({
    address: CONTRACTS.vesting,
    abi: vestingAbi,
    functionName: "released",
    args: [user],
  });
}

/* =========================================
   READ — START TIME
========================================= */

export async function startTime(): Promise<bigint> {
  return publicClient.readContract({
    address: CONTRACTS.vesting,
    abi: vestingAbi,
    functionName: "start",
  });
}

/* =========================================
   READ — CLIFF
========================================= */

export async function cliff(): Promise<bigint> {
  return publicClient.readContract({
    address: CONTRACTS.vesting,
    abi: vestingAbi,
    functionName: "cliff",
  });
}

/* =========================================
   READ — DURATION
========================================= */

export async function duration(): Promise<bigint> {
  return publicClient.readContract({
    address: CONTRACTS.vesting,
    abi: vestingAbi,
    functionName: "duration",
  });
}
