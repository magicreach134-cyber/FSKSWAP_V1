"use client";

import { useSwapStore } from "@/store/swapStore";
import { useWalletStore } from "@/store/walletStore";
import { useTransactionStore } from "@/store/transactionStore";

import { getQuote } from "@/services/swapService";
import {
  allowance,
  approve,
  decimals as getDecimals,
} from "@/services/erc20Service";

import { calculateMinOut } from "@/utils/calculateMinOut";
import { getDeadline } from "@/utils/deadline";

import { parseUnits } from "viem";
import { getWalletClient } from "@/lib/walletClient";

import FSKRouterV3_ABI from "@/abi/FSKRouterV3.json";
import { ROUTER_ADDRESS } from "@/config/contracts";
import {
  NATIVE_TOKEN_ADDRESS,
  WRAPPED_BNB_ADDRESS,
} from "@/config/native";

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

    const inputDecimals =
      fromToken === NATIVE_TOKEN_ADDRESS
        ? 18
        : await getDecimals(fromToken);

    const outputDecimals =
      toToken === NATIVE_TOKEN_ADDRESS
        ? 18
        : await getDecimals(toToken);

    const path =
      fromToken === NATIVE_TOKEN_ADDRESS
        ? [WRAPPED_BNB_ADDRESS, toToken]
        : toToken === NATIVE_TOKEN_ADDRESS
        ? [fromToken, WRAPPED_BNB_ADDRESS]
        : [fromToken, toToken];

    const amountOut = await getQuote({
      routerAddress: ROUTER_ADDRESS,
      amountIn: fromAmount,
      path,
      inputDecimals,
      outputDecimals,
    });

    setToAmount(amountOut);
  };

  // --------------------------------
  // EXECUTE SWAP
  // --------------------------------
  const executeSwap = async () => {
    try {
      if (!address) throw new Error("Wallet not connected");
      if (!fromToken || !toToken)
        throw new Error("Token selection incomplete");

      txStore.setStatus("pending");

      const walletClient = getWalletClient();

      const inputDecimals =
        fromToken === NATIVE_TOKEN_ADDRESS
          ? 18
          : await getDecimals(fromToken);

      const outputDecimals =
        toToken === NATIVE_TOKEN_ADDRESS
          ? 18
          : await getDecimals(toToken);

      const amountIn = parseUnits(fromAmount, inputDecimals);

      const minOut = calculateMinOut({
        quotedAmountOut: toAmount,
        slippage,
        decimals: outputDecimals,
      });

      const deadline = getDeadline(20);

      // --------------------------------
      // NATIVE → TOKEN
      // --------------------------------
      if (fromToken === NATIVE_TOKEN_ADDRESS) {
        const hash = await walletClient.writeContract({
          address: ROUTER_ADDRESS,
          abi: FSKRouterV3_ABI,
          functionName: "swapExactETHForTokens",
          args: [
            minOut,
            [WRAPPED_BNB_ADDRESS, toToken],
            address,
            deadline,
          ],
          value: amountIn,
          account: address,
        });

        txStore.setHash(hash);
        txStore.setStatus("success");
        return;
      }

      // --------------------------------
      // TOKEN → NATIVE
      // --------------------------------
      if (toToken === NATIVE_TOKEN_ADDRESS) {
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

        const hash = await walletClient.writeContract({
          address: ROUTER_ADDRESS,
          abi: FSKRouterV3_ABI,
          functionName: "swapExactTokensForETH",
          args: [
            amountIn,
            minOut,
            [fromToken, WRAPPED_BNB_ADDRESS],
            address,
            deadline,
          ],
          account: address,
        });

        txStore.setHash(hash);
        txStore.setStatus("success");
        return;
      }

      // --------------------------------
      // TOKEN → TOKEN
      // --------------------------------
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

      const hash = await walletClient.writeContract({
        address: ROUTER_ADDRESS,
        abi: FSKRouterV3_ABI,
        functionName: "swapExactTokensForTokens",
        args: [
          amountIn,
          minOut,
          [fromToken, toToken],
          address,
          deadline,
        ],
        account: address,
      });

      txStore.setHash(hash);
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
