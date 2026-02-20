import { publicClient } from "@/lib";
import { megaLockerAbi } from "@/abi";
import { CONTRACTS } from "@/config";
import { Address } from "viem";

/* =========================================
   READ — LOCK INFO
========================================= */

export async function lockInfo(
  lockId: bigint
) {
  return publicClient.readContract({
    address: CONTRACTS.megaLocker,
    abi: megaLockerAbi,
    functionName: "lockInfo",
    args: [lockId],
  });
}

/* =========================================
   READ — UNLOCK TIME
========================================= */

export async function unlockTime(
  lockId: bigint
): Promise<bigint> {
  return publicClient.readContract({
    address: CONTRACTS.megaLocker,
    abi: megaLockerAbi,
    functionName: "unlockTime",
    args: [lockId],
  });
}

/* =========================================
   READ — LOCKED AMOUNT
========================================= */

export async function lockedAmount(
  lockId: bigint
): Promise<bigint> {
  return publicClient.readContract({
    address: CONTRACTS.megaLocker,
    abi: megaLockerAbi,
    functionName: "lockedAmount",
    args: [lockId],
  });
}

/* =========================================
   READ — LOCK OWNER
========================================= */

export async function lockOwner(
  lockId: bigint
): Promise<Address> {
  return publicClient.readContract({
    address: CONTRACTS.megaLocker,
    abi: megaLockerAbi,
    functionName: "ownerOf",
    args: [lockId],
  });
}

/* =========================================
   READ — IS LOCK ACTIVE
========================================= */

export async function isLockActive(
  lockId: bigint
): Promise<boolean> {
  return publicClient.readContract({
    address: CONTRACTS.megaLocker,
    abi: megaLockerAbi,
    functionName: "isLockActive",
    args: [lockId],
  });
}

/* =========================================
   READ — TOTAL LOCKS
========================================= */

export async function totalLocks(): Promise<bigint> {
  return publicClient.readContract({
    address: CONTRACTS.megaLocker,
    abi: megaLockerAbi,
    functionName: "totalLocks",
  });
}
