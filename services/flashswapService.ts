import { publicClient, walletClient } from "@/lib";
import { flashswapAbi } from "@/abi";
import { CONTRACTS } from "@/config";
import { Address } from "viem";

/* =========================================
   EXECUTE FLASH SWAP
========================================= */

export async function executeFlashSwap(
  token: Address,
  amount: bigint,
  data: `0x${string}`
) {
  const [account] = await walletClient.getAddresses();

  return walletClient.writeContract({
    address: CONTRACTS.flashswap,
    abi: flashswapAbi,
    functionName: "executeFlashSwap",
    args: [token, amount, data],
    account,
  });
}

/* =========================================
   READ — FLASH FEE
========================================= */

export async function flashFee(
  token: Address,
  amount: bigint
): Promise<bigint> {
  return publicClient.readContract({
    address: CONTRACTS.flashswap,
    abi: flashswapAbi,
    functionName: "flashFee",
    args: [token, amount],
  });
}

/* =========================================
   READ — SUPPORTED TOKEN
========================================= */

export async function isTokenSupported(
  token: Address
): Promise<boolean> {
  return publicClient.readContract({
    address: CONTRACTS.flashswap,
    abi: flashswapAbi,
    functionName: "isSupportedToken",
    args: [token],
  });
}
