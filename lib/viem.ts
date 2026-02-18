import { createPublicClient, createWalletClient, http } from "viem";
import { bscTestnet } from "viem/chains";
import { BNB_TESTNET } from "@/config";

export const publicClient = createPublicClient({
  chain: bscTestnet,
  transport: http(BNB_TESTNET.rpcUrl),
});

export const walletClient = createWalletClient({
  chain: bscTestnet,
  transport: http(),
});
