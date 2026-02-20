import { publicClient, walletClient } from "@/lib";
import { launchpadFactoryAbi, presaleAbi } from "@/abi";
import { CONTRACTS } from "@/config";
import { Address } from "viem";

/* =========================================
   FACTORY — CREATE PRESALE
========================================= */

export async function createPresale(
  token: Address,
  softCap: bigint,
  hardCap: bigint,
  presaleRate: bigint,
  listingRate: bigint,
  startTime: bigint,
  endTime: bigint,
  minBuy: bigint,
  maxBuy: bigint,
  liquidityPercent: bigint
) {
  const [account] = await walletClient.getAddresses();

  return walletClient.writeContract({
    address: CONTRACTS.launchpadFactory,
    abi: launchpadFactoryAbi,
    functionName: "createPresale",
    args: [
      token,
      softCap,
      hardCap,
      presaleRate,
      listingRate,
      startTime,
      endTime,
      minBuy,
      maxBuy,
      liquidityPercent,
    ],
    account,
  });
}

/* =========================================
   FACTORY — GET PRESALE ADDRESS
========================================= */

export async function getPresale(
  index: bigint
): Promise<Address> {
  return publicClient.readContract({
    address: CONTRACTS.launchpadFactory,
    abi: launchpadFactoryAbi,
    functionName: "allPresales",
    args: [index],
  });
}

/* =========================================
   PRESALE — CONTRIBUTE
========================================= */

export async function contribute(
  presaleAddress: Address,
  amount: bigint
) {
  const [account] = await walletClient.getAddresses();

  return walletClient.writeContract({
    address: presaleAddress,
    abi: presaleAbi,
    functionName: "contribute",
    args: [],
    account,
    value: amount,
  });
}

/* =========================================
   PRESALE — CLAIM TOKENS
========================================= */

export async function claim(
  presaleAddress: Address
) {
  const [account] = await walletClient.getAddresses();

  return walletClient.writeContract({
    address: presaleAddress,
    abi: presaleAbi,
    functionName: "claim",
    args: [],
    account,
  });
}

/* =========================================
   PRESALE — REFUND
========================================= */

export async function refund(
  presaleAddress: Address
) {
  const [account] = await walletClient.getAddresses();

  return walletClient.writeContract({
    address: presaleAddress,
    abi: presaleAbi,
    functionName: "refund",
    args: [],
    account,
  });
}

/* =========================================
   PRESALE — FINALIZE
========================================= */

export async function finalize(
  presaleAddress: Address
) {
  const [account] = await walletClient.getAddresses();

  return walletClient.writeContract({
    address: presaleAddress,
    abi: presaleAbi,
    functionName: "finalize",
    args: [],
    account,
  });
}

/* =========================================
   PRESALE — READ INFO
========================================= */

export async function presaleInfo(
  presaleAddress: Address
) {
  return publicClient.readContract({
    address: presaleAddress,
    abi: presaleAbi,
    functionName: "presaleInfo",
  });
}

export async function userInfo(
  presaleAddress: Address,
  user: Address
) {
  return publicClient.readContract({
    address: presaleAddress,
    abi: presaleAbi,
    functionName: "userInfo",
    args: [user],
  });
}

export async function isWhitelisted(
  presaleAddress: Address,
  user: Address
): Promise<boolean> {
  return publicClient.readContract({
    address: presaleAddress,
    abi: presaleAbi,
    functionName: "whitelist",
    args: [user],
  });
}
