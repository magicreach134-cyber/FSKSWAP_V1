"use client";

import { useEffect, useState } from "react";
import { formatUnits } from "viem";

import { useLiquidityStore } from "@/store/useLiquidityStore";
import { useWalletStore } from "@/store/useWalletStore";

import {
  getPairAddress,
  getAlignedReserves,
  getTotalSupply,
  getLPBalance,
} from "@/services/pairService";

export default function LPTokenBreakdown() {
  const { tokenA, tokenB } = useLiquidityStore();
  const { address } = useWalletStore();

  const [tokenAAmount, setTokenAAmount] = useState<bigint>(0n);
  const [tokenBAmount, setTokenBAmount] = useState<bigint>(0n);

  useEffect(() => {
    async function calculateBreakdown() {
      if (!tokenA || !tokenB || !address) return;

      const pair = await getPairAddress(tokenA, tokenB);
      if (!pair) return;

      const [reserves, totalSupply, userLP] = await Promise.all([
        getAlignedReserves(pair, tokenA),
        getTotalSupply(pair),
        getLPBalance(pair, address),
      ]);

      if (totalSupply === 0n || userLP === 0n) {
        setTokenAAmount(0n);
        setTokenBAmount(0n);
        return;
      }

      // token share = (reserve * userLP) / totalSupply
      const amountA = (reserves.reserveIn * userLP) / totalSupply;
      const amountB = (reserves.reserveOut * userLP) / totalSupply;

      setTokenAAmount(amountA);
      setTokenBAmount(amountB);
    }

    calculateBreakdown();
  }, [tokenA, tokenB, address]);

  if (!tokenA || !tokenB) return null;

  return (
    <div className="text-sm space-y-1 border-t pt-3">
      <div className="flex justify-between">
        <span>Pooled Token A</span>
        <span>{formatUnits(tokenAAmount, 18)}</span>
      </div>

      <div className="flex justify-between">
        <span>Pooled Token B</span>
        <span>{formatUnits(tokenBAmount, 18)}</span>
      </div>
    </div>
  );
}
