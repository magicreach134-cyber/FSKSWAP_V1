"use client";

import { useSwapStore } from "@/store/swapStore";
import { useWalletStore } from "@/store/walletStore";
import { useTransactionStore } from "@/store/transactionStore";

import { getQuote } from "@/services/swapService";
import { allowance, approve, decimals as getDecimals } from "@/services/erc20Service";

import { calculateMinOut } from "@/utils/calculateMinOut";
import { getDeadline } from "@/utils/deadline";

import { parseUnits } from "viem";
import { getWalletClient } from "@/lib/walletClient";

import FSKRouterV3_ABI from "@/abi/FSKRouterV3.json";
import { ROUTER_ADDRESS } from "@/config/contracts";

export function useSwap() {
  const {
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    setToAmount,
    slippage,
  } = useSwapStore();

  const { address } = useWalletStore();
  const txStore = useTransactionStore();

  // --------------------------------
  // QUOTE
  // --------------------------------
  const fetchQuote = async () => {
    if (!fromToken || !toToken || !fromAmount) return;

    const inputDecimals = await getDecimals(fromToken);
    const outputDecimals = await getDecimals(toToken);

    const amountOut = await getQuote({
      routerAddress: ROUTER_ADDRESS,
      amountIn: fromAmount,
      path: [fromToken, toToken],
      inputDecimals,
      outputDecimals,
    });

    setToAmount(amountOut);
  };

  // --------------------------------
  // SWAP
  // --------------------------------
  const executeSwap = async () => {
    try {
      if (!address) throw new Error("Wallet not connected");
      if (!fromToken || !toToken)
        throw new Error("Token selection incomplete");

      txStore.setStatus("pending");

      const walletClient = getWalletClient();

      const inputDecimals = await getDecimals(fromToken);
      const outputDecimals = await getDecimals(toToken);

      const amountIn = parseUnits(fromAmount, inputDecimals);

      // 1️⃣ Check allowance
      const currentAllowance = await allowance(
        fromToken,
        address,
        ROUTER_ADDRESS
      );

      if (currentAllowance < amountIn) {
        const approveHash = await approve(
          fromToken,
          ROUTER_ADDRESS,
          amountIn,
          address
        );

        txStore.setHash(approveHash);
        txStore.setStatus("pending");
        return;
      }

      // 2️⃣ Calculate minimumOut
      const minOut = calculateMinOut({
        quotedAmountOut: toAmount,
        slippage,
        decimals: outputDecimals,
      });

      // 3️⃣ Execute swap
      const swapHash = await walletClient.writeContract({
        address: ROUTER_ADDRESS,
        abi: FSKRouterV3_ABI,
        functionName: "swapExactTokensForTokens",
        args: [
          amountIn,
          minOut,
          [fromToken, toToken],
          address,
          getDeadline(20),
        ],
        account: address,
      });

      txStore.setHash(swapHash);
      txStore.setStatus("success");
    } catch (err: any) {
      txStore.setError(err.message || "Swap failed");
      txStore.setStatus("error");
    }
  };

  return {
    fetchQuote,
    executeSwap,
  };
}
