import { publicClient, walletClient } from "@/lib";
import { routerAbi } from "@/abi";
import { CONTRACTS } from "@/config";
import { Address } from "viem";

/* =========================================
   ADD LIQUIDITY (TOKEN ↔ TOKEN)
========================================= */

export async function addLiquidity(
  tokenA: Address,
  tokenB: Address,
  amountADesired: bigint,
  amountBDesired: bigint,
  amountAMin: bigint,
  amountBMin: bigint,
  to: Address,
  deadline: bigint
) {
  const [account] = await walletClient.getAddresses();

  return walletClient.writeContract({
    address: CONTRACTS.router,
    abi: routerAbi,
    functionName: "addLiquidity",
    args: [
      tokenA,
      tokenB,
      amountADesired,
      amountBDesired,
      amountAMin,
      amountBMin,
      to,
      deadline,
    ],
    account,
  });
}

/* =========================================
   ADD LIQUIDITY (TOKEN ↔ BNB)
========================================= */

export async function addLiquidityETH(
  token: Address,
  amountTokenDesired: bigint,
  amountTokenMin: bigint,
  amountETHMin: bigint,
  to: Address,
  deadline: bigint,
  value: bigint
) {
  const [account] = await walletClient.getAddresses();

  return walletClient.writeContract({
    address: CONTRACTS.router,
    abi: routerAbi,
    functionName: "addLiquidityETH",
    args: [
      token,
      amountTokenDesired,
      amountTokenMin,
      amountETHMin,
      to,
      deadline,
    ],
    account,
    value,
  });
}

/* =========================================
   REMOVE LIQUIDITY (TOKEN ↔ TOKEN)
========================================= */

export async function removeLiquidity(
  tokenA: Address,
  tokenB: Address,
  liquidity: bigint,
  amountAMin: bigint,
  amountBMin: bigint,
  to: Address,
  deadline: bigint
) {
  const [account] = await walletClient.getAddresses();

  return walletClient.writeContract({
    address: CONTRACTS.router,
    abi: routerAbi,
    functionName: "removeLiquidity",
    args: [
      tokenA,
      tokenB,
      liquidity,
      amountAMin,
      amountBMin,
      to,
      deadline,
    ],
    account,
  });
}

/* =========================================
   REMOVE LIQUIDITY (TOKEN ↔ BNB)
========================================= */

export async function removeLiquidityETH(
  token: Address,
  liquidity: bigint,
  amountTokenMin: bigint,
  amountETHMin: bigint,
  to: Address,
  deadline: bigint
) {
  const [account] = await walletClient.getAddresses();

  return walletClient.writeContract({
    address: CONTRACTS.router,
    abi: routerAbi,
    functionName: "removeLiquidityETH",
    args: [
      token,
      liquidity,
      amountTokenMin,
      amountETHMin,
      to,
      deadline,
    ],
    account,
  });
}

/* =========================================
   REMOVE LIQUIDITY WITH PERMIT (TOKEN ↔ TOKEN)
========================================= */

export async function removeLiquidityWithPermit(
  tokenA: Address,
  tokenB: Address,
  liquidity: bigint,
  amountAMin: bigint,
  amountBMin: bigint,
  to: Address,
  deadline: bigint,
  approveMax: boolean,
  v: number,
  r: `0x${string}`,
  s: `0x${string}`
) {
  const [account] = await walletClient.getAddresses();

  return walletClient.writeContract({
    address: CONTRACTS.router,
    abi: routerAbi,
    functionName: "removeLiquidityWithPermit",
    args: [
      tokenA,
      tokenB,
      liquidity,
      amountAMin,
      amountBMin,
      to,
      deadline,
      approveMax,
      v,
      r,
      s,
    ],
    account,
  });
}

/* =========================================
   REMOVE LIQUIDITY ETH WITH PERMIT
========================================= */

export async function removeLiquidityETHWithPermit(
  token: Address,
  liquidity: bigint,
  amountTokenMin: bigint,
  amountETHMin: bigint,
  to: Address,
  deadline: bigint,
  approveMax: boolean,
  v: number,
  r: `0x${string}`,
  s: `0x${string}`
) {
  const [account] = await walletClient.getAddresses();

  return walletClient.writeContract({
    address: CONTRACTS.router,
    abi: routerAbi,
    functionName: "removeLiquidityETHWithPermit",
    args: [
      token,
      liquidity,
      amountTokenMin,
      amountETHMin,
      to,
      deadline,
      approveMax,
      v,
      r,
      s,
    ],
    account,
  });
}
