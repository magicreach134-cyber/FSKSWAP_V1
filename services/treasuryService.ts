import { publicClient } from "@/lib";
import { feeCollectorAbi } from "@/abi";
import { CONTRACTS } from "@/config";
import { Address } from "viem";

/* =========================================
   READ — TOTAL PROTOCOL REVENUE
========================================= */

export async function totalRevenue(): Promise<bigint> {
  return publicClient.readContract({
    address: CONTRACTS.feeCollector,
    abi: feeCollectorAbi,
    functionName: "totalRevenue",
  });
}

/* =========================================
   READ — PROTOCOL FEE BALANCE
========================================= */

export async function protocolFeeBalance(
  token: Address
): Promise<bigint> {
  return publicClient.readContract({
    address: CONTRACTS.feeCollector,
    abi: feeCollectorAbi,
    functionName: "protocolFeeBalance",
    args: [token],
  });
}

/* =========================================
   READ — COLLECTED FEES (PER TOKEN)
========================================= */

export async function collectedFees(
  token: Address
): Promise<bigint> {
  return publicClient.readContract({
    address: CONTRACTS.feeCollector,
    abi: feeCollectorAbi,
    functionName: "collectedFees",
    args: [token],
  });
}

/* =========================================
   READ — TREASURY NATIVE BALANCE
========================================= */

export async function treasuryNativeBalance(): Promise<bigint> {
  return publicClient.getBalance({
    address: CONTRACTS.treasury,
  });
}

/* =========================================
   READ — TOKEN BALANCE IN TREASURY
========================================= */

export async function treasuryTokenBalance(
  token: Address
): Promise<bigint> {
  return publicClient.readContract({
    address: token,
    abi: feeCollectorAbi, // if ERC20 ABI differs, replace with erc20Abi
    functionName: "balanceOf",
    args: [CONTRACTS.treasury],
  });
}
