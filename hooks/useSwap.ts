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

import { parseUnits, BaseError } from "viem";
import { getWalletClient } from "@/lib/walletClient";
import { publicClient } from "@/lib/publicClient";

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

      txStore.open();
      txStore.setTitle("Confirm Swap");
      txStore.setDescription("Confirm this transaction in your wallet");
      txStore.setStatus("prompting");

      const walletClient = getWalletClient();

      const isNativeIn = fromToken === NATIVE_TOKEN_ADDRESS;
      const isNativeOut = toToken === NATIVE_TOKEN_ADDRESS;

      const inputDecimals = isNativeIn
        ? 18
        : await getDecimals(fromToken);

      const outputDecimals = isNativeOut
        ? 18
        : await getDecimals(toToken);

      const amountIn = parseUnits(fromAmount, inputDecimals);

      const minOut = calculateMinOut({
        quotedAmountOut: toAmount,
        slippage,
        decimals: outputDecimals,
      });

      const deadline = getDeadline(20);

      const path = isNativeIn
        ? [WRAPPED_BNB_ADDRESS, toToken]
        : isNativeOut
        ? [fromToken, WRAPPED_BNB_ADDRESS]
        : [fromToken, toToken];

      const functionName = isNativeIn
        ? "swapExactETHForTokens"
        : isNativeOut
        ? "swapExactTokensForETH"
        : "swapExactTokensForTokens";

      // --------------------------------
      // APPROVAL
      // --------------------------------
      if (!isNativeIn) {
        const currentAllowance = await allowance(
          fromToken,
          address,
          ROUTER_ADDRESS
        );

        if (currentAllowance < amountIn) {
          txStore.setTitle("Approve Token");
          txStore.setDescription("Approve token spending");
          txStore.setStatus("approving");

          const approveHash = await approve(
            fromToken,
            ROUTER_ADDRESS,
            amountIn,
            address
          );

          txStore.setHash(approveHash);
          txStore.setStatus("pending");

          await publicClient.waitForTransactionReceipt({
            hash: approveHash,
          });
        }
      }

      // --------------------------------
      // SIMULATE (REVERT CHECK)
      // --------------------------------
      await publicClient.simulateContract({
        address: ROUTER_ADDRESS,
        abi: FSKRouterV3_ABI,
        functionName,
        args: isNativeIn
          ? [minOut, path, address, deadline]
          : [amountIn, minOut, path, address, deadline],
        value: isNativeIn ? amountIn : undefined,
        account: address,
      });

      // --------------------------------
      // ESTIMATE GAS
      // --------------------------------
      const gas = await publicClient.estimateContractGas({
        address: ROUTER_ADDRESS,
        abi: FSKRouterV3_ABI,
        functionName,
        args: isNativeIn
          ? [minOut, path, address, deadline]
          : [amountIn, minOut, path, address, deadline],
        value: isNativeIn ? amountIn : undefined,
        account: address,
      });

      // --------------------------------
      // SEND TX
      // --------------------------------
      const hash = await walletClient.writeContract({
        address: ROUTER_ADDRESS,
        abi: FSKRouterV3_ABI,
        functionName,
        args: isNativeIn
          ? [minOut, path, address, deadline]
          : [amountIn, minOut, path, address, deadline],
        value: isNativeIn ? amountIn : undefined,
        account: address,
        gas,
      });

      txStore.setHash(hash);
      txStore.setStatus("pending");

      await publicClient.waitForTransactionReceipt({ hash });

      txStore.setStatus("success");
    } catch (err) {
      let message = "Swap failed";

      if (err instanceof BaseError) {
        message = err.shortMessage || message;
      }

      txStore.setError(message);
      txStore.setStatus("error");
    }
  };

  return {
    fetchQuote,
    executeSwap,
  };
}
