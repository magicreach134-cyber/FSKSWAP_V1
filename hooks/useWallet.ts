"use client";

import { useEffect } from "react";
import { useWalletStore } from "@/store/walletStore";
import { createWalletClient, custom } from "viem";
import { bscTestnet } from "viem/chains";
import type { Address } from "viem";

export function useWallet() {
  const {
    setWallet,
    disconnect,
    setConnecting,
    requiredChainId,
  } = useWalletStore();

  const connect = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("No injected wallet found");
      }

      setConnecting(true);

      const walletClient = createWalletClient({
        chain: bscTestnet,
        transport: custom(window.ethereum),
      });

      const [account] = await walletClient.requestAddresses();
      const chainId = await walletClient.getChainId();

      // Do NOT throw on wrong network
      // Let UI handle mismatch state
      setWallet(account as Address, chainId);
    } catch (err) {
      console.error(err);
      setConnecting(false);
    }
  };

  const switchNetwork = async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${requiredChainId.toString(16)}` }],
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = async (accounts: string[]) => {
      if (!accounts.length) {
        disconnect();
        return;
      }

      const walletClient = createWalletClient({
        chain: bscTestnet,
        transport: custom(window.ethereum),
      });

      const chainId = await walletClient.getChainId();

      setWallet(accounts[0] as Address, chainId);
    };

    const handleChainChanged = async (chainIdHex: string) => {
      const chainId = parseInt(chainIdHex, 16);

      const { address } = useWalletStore.getState();

      if (!address) return;

      setWallet(address, chainId);
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener(
        "accountsChanged",
        handleAccountsChanged
      );
      window.ethereum.removeListener(
        "chainChanged",
        handleChainChanged
      );
    };
  }, [disconnect, requiredChainId, setWallet]);

  return {
    connect,
    disconnect,
    switchNetwork,
  };
}
