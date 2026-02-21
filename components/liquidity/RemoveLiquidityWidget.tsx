"use client";

import { useEffect, useState } from "react";
import { Card, Button, Spinner } from "@/components/ui";
import { useLiquidityStore } from "@/store/liquidityStore";
import { useWalletStore } from "@/store/walletStore";
import { useTransactionStore } from "@/store/transactionStore";
import { formatUnits, parseUnits } from "viem";
import { publicClient } from "@/lib/publicClient";
import { allowance, approve } from "@/services/erc20Service";
import {
  removeLiquidity,
  removeLiquidityETH,
} from "@/services/liquidityService";
import { CONTRACTS } from "@/config";
import { getDeadline } from "@/utils";
import { NATIVE_TOKEN_ADDRESS } from "@/config/native";
import FSKPair_ABI from "@/abi/FSKPair.json";

export default function RemoveLiquidityWidget() {
  const { tokenA, tokenB, slippage } = useLiquidityStore();
  const { address, connected } = useWalletStore();
  const txStore = useTransactionStore();

  const [lpAddress, setLpAddress] = useState<`0x${string}` | null>(null);
  const [lpBalance, setLpBalance] = useState<bigint>(0n);
  const [removePercent, setRemovePercent] = useState(0);
  const [loading, setLoading] = useState(false);

  // --------------------------------
  // Fetch LP address + balance
  // --------------------------------
  useEffect(() => {
    async function fetchLP() {
      if (!tokenA || !tokenB || !address) return;

      const pair = await publicClient.readContract({
        address: CONTRACTS.factory,
        abi: FSKPair_ABI,
        functionName: "getPair",
        args: [tokenA, tokenB],
      });

      if (!pair) return;

      setLpAddress(pair);

      const balance = await publicClient.readContract({
        address: pair,
        abi: FSKPair_ABI,
        functionName: "balanceOf",
        args: [address],
      });

      setLpBalance(balance);
    }

    fetchLP();
  }, [tokenA, tokenB, address]);

  const liquidityToRemove =
    (lpBalance * BigInt(removePercent)) / 100n;

  const disabled =
    !connected ||
    !tokenA ||
    !tokenB ||
    !lpAddress ||
    removePercent === 0 ||
    loading;

  async function handleRemove() {
    if (!lpAddress || !address) return;

    try {
      setLoading(true);

      txStore.open();
      txStore.setTitle("Remove Liquidity");
      txStore.setStatus("prompting");

      const allowanceLP = await allowance(
        lpAddress,
        address,
        CONTRACTS.router
      );

      if (allowanceLP < liquidityToRemove) {
        txStore.setStatus("approving");
        const approveHash = await approve(
          lpAddress,
          CONTRACTS.router,
          liquidityToRemove,
          address
        );
        await publicClient.waitForTransactionReceipt({
          hash: approveHash,
        });
      }

      const slippageBps = BigInt(Math.floor(slippage * 100));
      const denominator = 10000n;

      const amountAMin =
        (liquidityToRemove *
          (denominator - slippageBps)) /
        denominator;

      const amountBMin =
        (liquidityToRemove *
          (denominator - slippageBps)) /
        denominator;

      const deadline = BigInt(getDeadline(20));

      const isNative =
        tokenA === NATIVE_TOKEN_ADDRESS ||
        tokenB === NATIVE_TOKEN_ADDRESS;

      const txHash = isNative
        ? await removeLiquidityETH(
            tokenA === NATIVE_TOKEN_ADDRESS
              ? tokenB
              : tokenA,
            liquidityToRemove,
            amountAMin,
            amountBMin,
            address,
            deadline
          )
        : await removeLiquidity(
            tokenA,
            tokenB,
            liquidityToRemove,
            amountAMin,
            amountBMin,
            address,
            deadline
          );

      txStore.setHash(txHash);
      txStore.setStatus("pending");

      await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });

      txStore.setStatus("success");
    } catch (err: any) {
      txStore.setError(err?.message || "Remove failed");
      txStore.setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-6 space-y-6 w-full max-w-md mx-auto">
      <h2 className="text-lg font-semibold">
        Remove Liquidity
      </h2>

      {/* LP Balance */}
      <div className="text-xs text-muted-foreground">
        LP Balance: {formatUnits(lpBalance, 18)}
      </div>

      {/* Percentage Selector */}
      <div className="flex gap-2">
        {[25, 50, 75, 100].map((percent) => (
          <button
            key={percent}
            onClick={() => setRemovePercent(percent)}
            className={`flex-1 py-2 rounded-lg text-sm ${
              removePercent === percent
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800"
            }`}
          >
            {percent}%
          </button>
        ))}
      </div>

      <Button
        fullWidth
        disabled={disabled}
        onClick={handleRemove}
      >
        {!connected
          ? "Connect Wallet"
          : loading
          ? "Processing..."
          : "Remove"}
      </Button>
    </Card>
  );
}
