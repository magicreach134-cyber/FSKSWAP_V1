"use client";

import { useEffect, useState } from "react";
import { Card, Button } from "@/components/ui";
import { formatUnits } from "viem";
import { publicClient } from "@/lib/publicClient";
import FSKPair_ABI from "@/abi/FSKPair.json";
import { CONTRACTS } from "@/config";
import { useWalletStore } from "@/store/walletStore";

interface Props {
  tokenA: `0x${string}`;
  tokenB: `0x${string}`;
  symbolA: string;
  symbolB: string;
}

export default function LPPositionCard({
  tokenA,
  tokenB,
  symbolA,
  symbolB,
}: Props) {
  const { address } = useWalletStore();

  const [lpAddress, setLpAddress] =
    useState<`0x${string}` | null>(null);

  const [lpBalance, setLpBalance] = useState<bigint>(0n);
  const [totalSupply, setTotalSupply] =
    useState<bigint>(0n);

  const [reserve0, setReserve0] = useState<bigint>(0n);
  const [reserve1, setReserve1] = useState<bigint>(0n);

  // --------------------------------
  // Fetch LP Data
  // --------------------------------
  useEffect(() => {
    async function fetchPosition() {
      if (!tokenA || !tokenB || !address) return;

      const pair = await publicClient.readContract({
        address: CONTRACTS.factory,
        abi: FSKPair_ABI,
        functionName: "getPair",
        args: [tokenA, tokenB],
      });

      if (!pair) return;

      setLpAddress(pair);

      const [balance, supply, reserves] =
        await Promise.all([
          publicClient.readContract({
            address: pair,
            abi: FSKPair_ABI,
            functionName: "balanceOf",
            args: [address],
          }),
          publicClient.readContract({
            address: pair,
            abi: FSKPair_ABI,
            functionName: "totalSupply",
          }),
          publicClient.readContract({
            address: pair,
            abi: FSKPair_ABI,
            functionName: "getReserves",
          }),
        ]);

      setLpBalance(balance);
      setTotalSupply(supply);
      setReserve0(reserves[0]);
      setReserve1(reserves[1]);
    }

    fetchPosition();
  }, [tokenA, tokenB, address]);

  if (!lpBalance || lpBalance === 0n) return null;

  // --------------------------------
  // Calculations
  // --------------------------------
  const share =
    totalSupply > 0n
      ? Number(lpBalance) / Number(totalSupply)
      : 0;

  const tokenAAmount =
    reserve0 * lpBalance / totalSupply;

  const tokenBAmount =
    reserve1 * lpBalance / totalSupply;

  return (
    <Card className="p-6 space-y-4 w-full max-w-md mx-auto">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">
          {symbolA} / {symbolB}
        </h3>
        <span className="text-xs text-muted-foreground">
          { (share * 100).toFixed(2) }% Pool Share
        </span>
      </div>

      <div className="space-y-1 text-sm">
        <div>
          LP Tokens: {formatUnits(lpBalance, 18)}
        </div>
        <div>
          {symbolA}: {formatUnits(tokenAAmount, 18)}
        </div>
        <div>
          {symbolB}: {formatUnits(tokenBAmount, 18)}
        </div>
      </div>

      <div className="flex gap-2">
        <Button fullWidth variant="secondary">
          Add
        </Button>
        <Button fullWidth>
          Remove
        </Button>
      </div>
    </Card>
  );
}
