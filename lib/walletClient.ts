import { createPublicClient, createWalletClient, custom } from "viem";
import { bscTestnet } from "viem/chains";

export const publicClient = createPublicClient({
  chain: bscTestnet,
  transport: custom(window.ethereum!),
});

export function getWalletClient() {
  if (!window.ethereum) {
    throw new Error("No injected wallet found");
  }

  return createWalletClient({
    chain: bscTestnet,
    transport: custom(window.ethereum),
  });
}
