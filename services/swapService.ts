import { publicClient, walletClient } from "@/lib";
import { routerAbi } from "@/abi";
import { CONTRACTS } from "@/config";
import { Address } from "viem";

/* =========================================
   QUOTE FUNCTIONS
========================================= */

export async function getAmountsOut(
  amountIn: bigint,
  path: Address[]
): Promise<bigint[]> {
  return publicClient.readContract({
    address: CONTRACTS.router,
    abi: routerAbi,
    functionName: "getAmountsOut",
    args: [amountIn, path],
  });
}

export async function getAmountsIn(
  amountOut: bigint,
  path: Address[]
): Promise<bigint[]> {
  return publicClient.readContract({
    address: CONTRACTS.router,
    abi: routerAbi,
    functionName: "getAmountsIn",
    args: [amountOut, path],
  });
}

/* =========================================
   TOKEN ↔ TOKEN
========================================= */

export async function swapExactTokensForTokens(
  amountIn: bigint,
  amountOutMin: bigint,
  path: Address[],
  to: Address,
  deadline: bigint
) {
  const [account] = await walletClient.getAddresses();

  return walletClient.writeContract({
    address: CONTRACTS.router,
    abi: routerAbi,
    functionName: "swapExactTokensForTokens",
    args: [amountIn, amountOutMin, path, to, deadline],
    account,
  });
}

export async function swapExactTokensForTokensSupportingFeeOnTransferTokens(
  amountIn: bigint,
  amountOutMin: bigint,
  path: Address[],
  to: Address,
  deadline: bigint
) {
  const [account] = await walletClient.getAddresses();

  return walletClient.writeContract({
    address: CONTRACTS.router,
    abi: routerAbi,
    functionName:
      "swapExactTokensForTokensSupportingFeeOnTransferTokens",
    args: [amountIn, amountOutMin, path, to, deadline],
    account,
  });
}

/* =========================================
   TOKEN ↔ BNB
========================================= */

export async function swapExactTokensForETH(
  amountIn: bigint,
  amountOutMin: bigint,
  path: Address[],
  to: Address,
  deadline: bigint
) {
  const [account] = await walletClient.getAddresses();

  return walletClient.writeContract({
    address: CONTRACTS.router,
    abi: routerAbi,
    functionName: "swapExactTokensForETH",
    args: [amountIn, amountOutMin, path, to, deadline],
    account,
  });
}

export async function swapExactTokensForETHSupportingFeeOnTransferTokens(
  amountIn: bigint,
  amountOutMin: bigint,
  path: Address[],
  to: Address,
  deadline: bigint
) {
  const [account] = await walletClient.getAddresses();

  return walletClient.writeContract({
    address: CONTRACTS.router,
    abi: routerAbi,
    functionName:
      "swapExactTokensForETHSupportingFeeOnTransferTokens",
    args: [amountIn, amountOutMin, path, to, deadline],
    account,
  });
}

/* =========================================
   BNB ↔ TOKEN
========================================= */

export async function swapExactETHForTokens(
  amountOutMin: bigint,
  path: Address[],
  to: Address,
  deadline: bigint,
  value: bigint
) {
  const [account] = await walletClient.getAddresses();

  return walletClient.writeContract({
    address: CONTRACTS.router,
    abi: routerAbi,
    functionName: "swapExactETHForTokens",
    args: [amountOutMin, path, to, deadline],
    account,
    value,
  });
}

export async function swapExactETHForTokensSupportingFeeOnTransferTokens(
  amountOutMin: bigint,
  path: Address[],
  to: Address,
  deadline: bigint,
  value: bigint
) {
  const [account] = await walletClient.getAddresses();

  return walletClient.writeContract({
    address: CONTRACTS.router,
    abi: routerAbi,
    functionName:
      "swapExactETHForTokensSupportingFeeOnTransferTokens",
    args: [amountOutMin, path, to, deadline],
    account,
    value,
  });
}
