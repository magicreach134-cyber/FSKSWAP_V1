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

export default function PoolShareDisplay() {
  const { tokenA, tokenB } = useLiquidityStore();
  const { address } = useWalletStore();

  const [poolShare, setPoolShare] = useState<number>(0);
  const [reserveA, setReserveA] = useState<bigint>(0n);
  const [reserveB, setReserveB] = useState<bigint>(0n);
  const [totalSupply, setTotalSupply] = useState<bigint>(0n);
  const [userLP, setUserLP] = useState<bigint>(0n);

  useEffect(() => {
    async function loadPoolData() {
      if (!tokenA || !tokenB || !address) return;

      const pair = await getPairAddress(tokenA, tokenB);
      if (!pair) return;

      const [reserves, supply, balance] = await Promise.all([
        getAlignedReserves(pair, tokenA),
        getTotalSupply(pair),
        getLPBalance(pair, address),
      ]);

      setReserveA(reserves.reserveIn);
      setReserveB(reserves.reserveOut);
      setTotalSupply(supply);
      setUserLP(balance);

      if (supply > 0n && balance > 0n) {
        const share =
          Number((balance * 10000n) / supply) / 100;

        setPoolShare(share);
      } else {
        setPoolShare(0);
      }
    }

    loadPoolData();
  }, [tokenA, tokenB, address]);

  if (!tokenA || !tokenB) return null;

  return (
    <div className="text-sm space-y-1 border-t pt-3">
      <div className="flex justify-between">
        <span>Your Pool Share</span>
        <span>{poolShare.toFixed(4)}%</span>
      </div>

      <div className="flex justify-between">
        <span>Total LP Supply</span>
        <span>{formatUnits(totalSupply, 18)}</span>
      </div>

      <div className="flex justify-between">
        <span>Reserve A</span>
        <span>{formatUnits(reserveA, 18)}</span>
      </div>

      <div className="flex justify-between">
        <span>Reserve B</span>
        <span>{formatUnits(reserveB, 18)}</span>
      </div>
    </div>
  );
}
