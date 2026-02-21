"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui";
import { useWalletStore } from "@/store/walletStore";
import { poolInfo } from "@/services/farmService";
import { calculateAPR } from "@/utils/calculateAPR";

export default function FarmPools() {
  const { connected } = useWalletStore();
  const [pools, setPools] = useState<any[]>([]);

  useEffect(() => {
    async function fetchPools() {
      const loaded: any[] = [];

      for (let pid = 0; pid < 5; pid++) {
        try {
          const info = await poolInfo(pid);

          const apr = calculateAPR(
            info.rewardPerBlock,
            info.accRewardPerShare
          );

          loaded.push({ pid, ...info, apr });
        } catch {
          break;
        }
      }

      setPools(loaded);
    }

    fetchPools();
  }, []);

  if (!connected) return null;

  return (
    <Card className="p-6 space-y-4 w-full max-w-md mx-auto">
      <h2 className="text-lg font-semibold">Farms</h2>

      {pools.map((pool) => (
        <div key={pool.pid} className="flex justify-between">
          <span>Pool #{pool.pid}</span>
          <span>{pool.apr.toFixed(2)}% APR</span>
        </div>
      ))}
    </Card>
  );
}
