"use client";

import { parseUnits } from "viem";
import {
  addLiquidity,
  addLiquidityETH,
} from "@/services/liquidityService";
import {
  allowance,
  approve,
  decimals as getDecimals,
} from "@/services/erc20Service";

import {
  useLiquidityStore,
  useWalletStore,
  useTransactionStore,
} from "@/store";

import { CONTRACTS } from "@/config";
import { getDeadline } from "@/utils";
import { publicClient } from "@/lib/publicClient";
import { NATIVE_TOKEN_ADDRESS } from "@/config/native";

export function useLiquidity() {
  const {
    tokenA,
    tokenB,
    amountA,
    amountB,
    slippage,
  } = useLiquidityStore();

  const { address } = useWalletStore();
  const txStore = useTransactionStore();

  async function provide() {
    if (!tokenA || !tokenB || !amountA || !amountB || !address) return;

    try {
      txStore.open();
      txStore.setTitle("Add Liquidity");
      txStore.setDescription("Confirm transaction in wallet");
      txStore.setStatus("prompting");

      const isNativeA = tokenA === NATIVE_TOKEN_ADDRESS;
      const isNativeB = tokenB === NATIVE_TOKEN_ADDRESS;

      const decimalsA = isNativeA ? 18 : await getDecimals(tokenA);
      const decimalsB = isNativeB ? 18 : await getDecimals(tokenB);

      const amountAWei = parseUnits(amountA, decimalsA);
      const amountBWei = parseUnits(amountB, decimalsB);

      const slippageBps = BigInt(Math.floor(slippage * 100));
      const denominator = 10000n;

      const amountAMin =
        (amountAWei * (denominator - slippageBps)) / denominator;

      const amountBMin =
        (amountBWei * (denominator - slippageBps)) / denominator;

      const deadline = BigInt(getDeadline(20));

      // --------------------------------
      // TOKEN ↔ TOKEN
      // --------------------------------
      if (!isNativeA && !isNativeB) {
        const allowanceA = await allowance(
          tokenA,
          address,
          CONTRACTS.router
        );

        if (allowanceA < amountAWei) {
          txStore.setStatus("approving");
          const approveHash = await approve(
            tokenA,
            CONTRACTS.router,
            amountAWei,
            address
          );
          await publicClient.waitForTransactionReceipt({ hash: approveHash });
        }

        const allowanceB = await allowance(
          tokenB,
          address,
          CONTRACTS.router
        );

        if (allowanceB < amountBWei) {
          txStore.setStatus("approving");
          const approveHash = await approve(
            tokenB,
            CONTRACTS.router,
            amountBWei,
            address
          );
          await publicClient.waitForTransactionReceipt({ hash: approveHash });
        }

        const txHash = await addLiquidity(
          tokenA,
          tokenB,
          amountAWei,
          amountBWei,
          amountAMin,
          amountBMin,
          address,
          deadline
        );

        txStore.setHash(txHash);
        txStore.setStatus("pending");

        await publicClient.waitForTransactionReceipt({ hash: txHash });

        txStore.setStatus("success");
        return;
      }

      // --------------------------------
      // TOKEN ↔ BNB
      // --------------------------------
      const token = isNativeA ? tokenB : tokenA;
      const tokenAmountWei = isNativeA ? amountBWei : amountAWei;
      const tokenAmountMin = isNativeA ? amountBMin : amountAMin;
      const ethAmountWei = isNativeA ? amountAWei : amountBWei;
      const ethAmountMin = isNativeA ? amountAMin : amountBMin;

      const allowanceToken = await allowance(
        token,
        address,
        CONTRACTS.router
      );

      if (allowanceToken < tokenAmountWei) {
        txStore.setStatus("approving");
        const approveHash = await approve(
          token,
          CONTRACTS.router,
          tokenAmountWei,
          address
        );
        await publicClient.waitForTransactionReceipt({ hash: approveHash });
      }

      const txHash = await addLiquidityETH(
        token,
        tokenAmountWei,
        tokenAmountMin,
        ethAmountMin,
        address,
        deadline,
        ethAmountWei
      );

      txStore.setHash(txHash);
      txStore.setStatus("pending");

      await publicClient.waitForTransactionReceipt({ hash: txHash });

      txStore.setStatus("success");
    } catch (err: any) {
      txStore.setError(err?.message || "Liquidity failed");
      txStore.setStatus("error");
    }
  }

  return { provide };
}
