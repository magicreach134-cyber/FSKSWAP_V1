"use client";

import { useWalletStore } from "@/store/walletStore";
import { getWalletClient } from "@/lib/walletClient";
import { Address } from "viem";

export function useWallet() {
  const {
    setWallet,
    setConnecting,
    disconnect,
    requiredChainId,
  } = useWalletStore();

  const connect = async () => {
    try {
      setConnecting(true);

      const walletClient = getWalletClient();

      const [account] = await walletClient.requestAddresses();
      const chainId = await walletClient.getChainId();

      if (chainId !== requiredChainId) {
        throw new Error("Wrong network");
      }

      setWallet(account as Address, chainId);
    } catch (error) {
      console.error(error);
      setConnecting(false);
    }
  };

  return {
    connect,
    disconnect,
  };
}
