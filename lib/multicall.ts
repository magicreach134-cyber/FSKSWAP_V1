import { publicClient } from "./viem";

export async function multicall(contracts: any[]) {
  return publicClient.multicall({
    contracts,
  });
}
