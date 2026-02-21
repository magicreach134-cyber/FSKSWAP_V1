"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { parseUnits } from "viem";

import { useLiquidityStore } from "@/store/useLiquidityStore";
import { useWalletStore } from "@/store/useWalletStore";

import {
  allowance,
  approve,
  decimals as getDecimals,
} from "@/services/erc20Service";

import { CONTRACTS } from "@/config";
import { NATIVE_TOKEN_ADDRESS } from "@/config/native";
import { publicClient } from "@/lib/publicClient";

export default function ApproveLiquidityButton() {
  const { tokenA, tokenB, amountA, amountB } = useLiquidityStore();
  const { address } = useWalletStore();

  const [needsApprovalA, setNeedsApprovalA] = useState(false);
  const [needsApprovalB, setNeedsApprovalB] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkAllowances() {
      if (!tokenA || !tokenB || !address) return;

      // Skip native token
      const isNativeA = tokenA === NATIVE_TOKEN_ADDRESS;
      const isNativeB = tokenB === NATIVE_TOKEN_ADDRESS;

      if (!isNativeA && amountA) {
        const decimalsA = await getDecimals(tokenA);
        const amountWeiA = parseUnits(amountA, decimalsA);
        const allowanceA = await allowance(
          tokenA,
          address,
          CONTRACTS.router
        );
        setNeedsApprovalA(allowanceA < amountWeiA);
      } else {
        setNeedsApprovalA(false);
      }

      if (!isNativeB && amountB) {
        const decimalsB = await getDecimals(tokenB);
        const amountWeiB = parseUnits(amountB, decimalsB);
        const allowanceB = await allowance(
          tokenB,
          address,
          CONTRACTS.router
        );
        setNeedsApprovalB(allowanceB < amountWeiB);
      } else {
        setNeedsApprovalB(false);
      }
    }

    checkAllowances();
  }, [tokenA, tokenB, amountA, amountB, address]);

  async function handleApprove(token: `0x${string}`, amount: string) {
    if (!address) return;

    try {
      setLoading(true);

      const decimals = await getDecimals(token);
      const amountWei = parseUnits(amount, decimals);

      const hash = await approve(
        token,
        CONTRACTS.router,
        amountWei,
        address
      );

      await publicClient.waitForTransactionReceipt({ hash });
    } finally {
      setLoading(false);
    }
  }

  if (!needsApprovalA && !needsApprovalB) return null;

  return (
    <div className="space-y-2">
      {needsApprovalA && tokenA && (
        <Button
          fullWidth
          disabled={loading}
          onClick={() => handleApprove(tokenA, amountA)}
        >
          Approve Token A
        </Button>
      )}

      {needsApprovalB && tokenB && (
        <Button
          fullWidth
          disabled={loading}
          onClick={() => handleApprove(tokenB, amountB)}
        >
          Approve Token B
        </Button>
      )}
    </div>
  );
}
