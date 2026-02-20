"use client";

import { useSwapStore } from "@/store/swapStore";
import { useWalletStore } from "@/store/walletStore";
import { useTransactionStore } from "@/store/transactionStore";
import { getQuote } from "@/services/swapService";
import { parseUnits } from "viem";
import { getWalletClient } from "@/lib/walletClient";

export function useSwap() {
  const {
    fromToken,
    toToken,
    fromAmount,
    setToAmount,
    slippage,
  } = useSwapStore();

  const { address } = useWalletStore();
  const txStore = useTransactionStore();

  const fetchQuote = async () => {
    if (!fromToken || !toToken || !fromAmount) return;

    const amountOut = await getQuote({
      routerAddress: ROUTER_ADDRESS,
      amountIn: fromAmount,
      path: [fromToken, toToken],
    });

    setToAmount(amountOut);
  };

  const executeSwap = async () => {
    try {
      if (!address) throw new Error("Wallet not connected");

      txStore.setStatus("pending");

      const walletClient = getWalletClient();

      const amountIn = parseUnits(fromAmount, 18);

      const hash = await walletClient.writeContract({
        address: ROUTER_ADDRESS,
        abi: ROUTER_ABI,
        functionName: "swapExactTokensForTokens",
        args: [
          amountIn,
          0, // minOut calculated later
          [fromToken!, toToken!],
          address,
          Math.floor(Date.now() / 1000) + 60 * 20,
        ],
      });

      txStore.setHash(hash);
      txStore.setStatus("success");
    } catch (err: any) {
      txStore.setError(err.message);
      txStore.setStatus("error");
    }
  };

  return {
    fetchQuote,
    executeSwap,
  };
}
