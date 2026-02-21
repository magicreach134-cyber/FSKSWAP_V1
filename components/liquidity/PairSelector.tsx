"use client";

import { useEffect, useState } from "react";
import type { Address } from "viem";

import { useLiquidityStore } from "@/store/useLiquidityStore";
import { getPairAddress } from "@/services/pairService";

import TokenSelector from "@/components/swap/TokenSelector";

export default function PairSelector() {
  const {
    tokenA,
    tokenB,
    setTokenA,
    setTokenB,
    setHasPair,
  } = useLiquidityStore();

  const [checking, setChecking] = useState(false);

  // --------------------------------
  // Detect existing pair
  // --------------------------------
  useEffect(() => {
    async function checkPair() {
      if (!tokenA || !tokenB || tokenA === tokenB) {
        setHasPair(false);
        return;
      }

      try {
        setChecking(true);

        const pair = await getPairAddress(
          tokenA as Address,
          tokenB as Address
        );

        setHasPair(!!pair);
      } catch {
        setHasPair(false);
      } finally {
        setChecking(false);
      }
    }

    checkPair();
  }, [tokenA, tokenB]);

  // --------------------------------
  // Prevent same token selection
  // --------------------------------
  useEffect(() => {
    if (tokenA && tokenB && tokenA === tokenB) {
      setTokenB(undefined as unknown as Address);
    }
  }, [tokenA]);

  return (
    <div className="space-y-4">
      <TokenSelector
        type="liquidityA"
        selected={tokenA}
        onSelect={setTokenA}
      />

      <TokenSelector
        type="liquidityB"
        selected={tokenB}
        onSelect={setTokenB}
      />

      {checking && (
        <div className="text-xs text-muted-foreground">
          Checking pool...
        </div>
      )}
    </div>
  );
}
