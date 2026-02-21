"use client";

import { useEffect, useState } from "react";
import { Card, Button } from "@/components/ui";
import { useWalletStore } from "@/store/walletStore";
import { publicClient } from "@/lib/publicClient";
import { CONTRACTS } from "@/config";

import FSKFactory_ABI from "@/abi/FSKFactoryV2.json";
import FSKPair_ABI from "@/abi/FSKPair.json";

export default function MyLiquidityPositions() {
  const { address, connected } = useWalletStore();
  const [pairs, setPairs] = useState<`0x${string}`[]>([]);

  useEffect(() => {
    async function fetchPairs() {
      if (!address) return;

      const totalPairs = await publicClient.readContract({
        address: CONTRACTS.factory,
        abi: FSKFactory_ABI,
        functionName: "allPairsLength",
      });

      const ownedPairs: `0x${string}`[] = [];

      for (let i = 0n; i < totalPairs; i++) {
        const pair = await publicClient.readContract({
          address: CONTRACTS.factory,
          abi: FSKFactory_ABI,
          functionName: "allPairs",
          args: [i],
        });

        const balance = await publicClient.readContract({
          address: pair,
          abi: FSKPair_ABI,
          functionName: "balanceOf",
          args: [address],
        });

        if (balance > 0n) {
          ownedPairs.push(pair);
        }
      }

      setPairs(ownedPairs);
    }

    fetchPairs();
  }, [address]);

  if (!connected) return null;

  return (
    <Card className="p-6 space-y-4 w-full max-w-md mx-auto">
      <h2 className="text-lg font-semibold">My Liquidity</h2>

      {pairs.length === 0 && (
        <div className="text-sm text-muted-foreground">
          No liquidity positions found
        </div>
      )}

      {pairs.map((pair) => (
        <div
          key={pair}
          className="flex justify-between items-center"
        >
          <span className="text-xs break-all">
            {pair}
          </span>
          <Button size="sm">Manage</Button>
        </div>
      ))}
    </Card>
  );
}
