import { publicClient, walletClient } from "@/lib";
import { CONTRACTS } from "@/config";
import { parseAbi } from "viem";

const routerAbi = parseAbi([
  "function getAmountsOut(uint amountIn, address[] memory path) view returns (uint[] memory)",
  "function swapExactTokensForTokens(uint amountIn,uint amountOutMin,address[] calldata path,address to,uint deadline)"
]);

export async function getAmountsOut(
  amountIn: bigint,
  path: `0x${string}`[]
) {
  return publicClient.readContract({
    address: CONTRACTS.router,
    abi: routerAbi,
    functionName: "getAmountsOut",
    args: [amountIn, path],
  });
}

export async function swapExactTokensForTokens(
  amountIn: bigint,
  amountOutMin: bigint,
  path: `0x${string}`[],
  user: `0x${string}`,
  deadline: number
) {
  const [account] = await walletClient.getAddresses();

  return walletClient.writeContract({
    address: CONTRACTS.router,
    abi: routerAbi,
    functionName: "swapExactTokensForTokens",
    args: [amountIn, amountOutMin, path, user, deadline],
    account,
  });
}
