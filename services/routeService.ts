import { getPairAddress } from "./pairService";
import { WRAPPED_BNB_ADDRESS } from "@/config/native";
import type { Address } from "viem";

export async function resolveBestPath(
  tokenIn: Address,
  tokenOut: Address
): Promise<Address[] | null> {
  // 1️⃣ Direct pair
  const directPair = await getPairAddress(tokenIn, tokenOut);

  if (directPair) {
    return [tokenIn, tokenOut];
  }

  // 2️⃣ Multi-hop via WBNB
  const pair1 = await getPairAddress(tokenIn, WRAPPED_BNB_ADDRESS);
  const pair2 = await getPairAddress(WRAPPED_BNB_ADDRESS, tokenOut);

  if (pair1 && pair2) {
    return [tokenIn, WRAPPED_BNB_ADDRESS, tokenOut];
  }

  // 3️⃣ No liquidity
  return null;
}
