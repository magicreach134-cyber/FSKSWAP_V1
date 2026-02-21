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

import {
  getPairAddress,
  getAlignedReserves,
} from "@/services/pairService";

import { resolveBestPath } from "@/services/routeService";

import { calculateMinOut } from "@/utils/calculateMinOut";
import { calculatePriceImpact } from "@/utils/calculatePriceImpact";
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
    setPriceImpact,
    setRoute,
    setHasLiquidity,
    setIsQuoting,
  } = useSwapStore();

  const { address } = useWalletStore();
  const txStore = useTransactionStore();

  // --------------------------------
  // QUOTE (Multi-hop Enabled)
  // --------------------------------
  const fetchQuote = async () => {
    if (!fromToken || !toToken || !fromAmount) return;

    try {
      setIsQuoting(true);

      const isNativeIn = fromToken === NATIVE_TOKEN_ADDRESS;
      const isNativeOut = toToken === NATIVE_TOKEN_ADDRESS;

      const tokenIn = isNativeIn
        ? WRAPPED_BNB_ADDRESS
        : fromToken;

      const tokenOut = isNativeOut
        ? WRAPPED_BNB_ADDRESS
        : toToken;

      const inputDecimals = isNativeIn
        ? 18
        : await getDecimals(fromToken);

      const outputDecimals = isNativeOut
        ? 18
        : await getDecimals(toToken);

      // Resolve best path (direct or via WBNB)
      const resolvedPath = await resolveBestPath(
        tokenIn,
        tokenOut
      );

      if (!resolvedPath) {
        setHasLiquidity(false);
        setPriceImpact(0);
        setToAmount("");
        return;
      }

      setRoute(resolvedPath);
      setHasLiquidity(true);

      const amountOut = await getQuote({
        routerAddress: ROUTER_ADDRESS,
        amountIn: fromAmount,
        path: resolvedPath,
        inputDecimals,
        outputDecimals,
      });

      setToAmount(amountOut);

      // Price impact only for direct pools
      if (resolvedPath.length === 2) {
        const amountInParsed = parseUnits(
          fromAmount,
          inputDecimals
        );

        const pair = await getPairAddress(
          resolvedPath[0],
          resolvedPath[1]
        );

        if (pair) {
          const { reserveIn, reserveOut } =
            await getAlignedReserves(
              pair,
              resolvedPath[0]
            );

          const impact = calculatePriceImpact(
            amountInParsed,
            reserveIn,
            reserveOut
          );

          setPriceImpact(impact);
        }
      } else {
        setPriceImpact(0);
      }
    } catch {
      setHasLiquidity(false);
      setPriceImpact(0);
      setToAmount("");
    } finally {
      setIsQuoting(false);
    }
  };

  // --------------------------------
  // EXECUTE SWAP
  // --------------------------------
  const executeSwap = async () => {
    try {
      if (!address) throw new Error("Wallet not connected");

      const {
        fromToken,
        toToken,
        route,
      } = useSwapStore.getState();

      if (!fromToken || !toToken || route.length === 0)
        throw new Error("Invalid swap route");

      txStore.open();
      txStore.setTitle("Confirm Swap");
      txStore.setDescription(
        "Confirm this transaction in your wallet"
      );
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

      const functionName = isNativeIn
        ? "swapExactETHForTokens"
        : isNativeOut
        ? "swapExactTokensForETH"
        : "swapExactTokensForTokens";

      // --------------------------------
      // APPROVAL (if needed)
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
      // SIMULATE
      // --------------------------------
      await publicClient.simulateContract({
        address: ROUTER_ADDRESS,
        abi: FSKRouterV3_ABI,
        functionName,
        args: isNativeIn
          ? [minOut, route, address, deadline]
          : [amountIn, minOut, route, address, deadline],
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
          ? [minOut, route, address, deadline]
          : [amountIn, minOut, route, address, deadline],
        value: isNativeIn ? amountIn : undefined,
        account: address,
      });

      // --------------------------------
      // SEND TRANSACTION
      // --------------------------------
      const hash = await walletClient.writeContract({
        address: ROUTER_ADDRESS,
        abi: FSKRouterV3_ABI,
        functionName,
        args: isNativeIn
          ? [minOut, route, address, deadline]
          : [amountIn, minOut, route, address, deadline],
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
