import { publicClient } from "./viem";

export function subscribeToBlocks(
  callback: (blockNumber: bigint) => void
) {
  return publicClient.watchBlockNumber({
    onBlockNumber: callback,
  });
}
