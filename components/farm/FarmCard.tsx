"use client";

import { useEffect, useState } from "react";
import { Card, Button, Spinner } from "@/components/ui";
import { formatUnits } from "viem";
import { publicClient } from "@/lib/publicClient";
import { allowance, approve } from "@/services/erc20Service";
import { useWalletStore } from "@/store/walletStore";
import { useTransactionStore } from "@/store/transactionStore";
import { useFarm } from "@/hooks/useFarm";
import { CONTRACTS } from "@/config";
import FSKPair_ABI from "@/abi/FSKPair.json";

interface Props {
  pid: number;
  lpToken: `0x${string}`;
  lpSymbol: string;
  rewardSymbol: string;
  lpDecimals?: number;
}

export default function FarmCard({
  pid,
  lpToken,
  lpSymbol,
  rewardSymbol,
  lpDecimals = 18,
}: Props) {
  const { address, connected } = useWalletStore();
  const txStore = useTransactionStore();
  const { stake, unstake, harvest } = useFarm(pid);

  const [lpBalance, setLpBalance] = useState<bigint>(0n);
  const [totalStaked, setTotalStaked] = useState<bigint>(0n);
  const [loading, setLoading] = useState(false);

  // --------------------------------
  // Fetch LP Balance + Total Staked
  // --------------------------------
  useEffect(() => {
    async function load() {
      if (!address) return;

      setLoading(true);

      const [userBal, total] = await Promise.all([
        publicClient.readContract({
          address: lpToken,
          abi: FSKPair_ABI,
          functionName: "balanceOf",
          args: [address],
        }),
        publicClient.readContract({
          address: lpToken,
          abi: FSKPair_ABI,
          functionName: "balanceOf",
          args: [CONTRACTS.staking],
        }),
      ]);

      setLpBalance(userBal);
      setTotalStaked(total);

      setLoading(false);
    }

    load();
  }, [address]);

  // --------------------------------
  // Stake Handler
  // --------------------------------
  async function handleStake() {
    if (!address) return;

    try {
      txStore.open();
      txStore.setTitle("Stake LP");
      txStore.setStatus("prompting");

      const currentAllowance = await allowance(
        lpToken,
        address,
        CONTRACTS.staking
      );

      if (currentAllowance < lpBalance) {
        txStore.setStatus("approving");

        const approveHash = await approve(
          lpToken,
          CONTRACTS.staking,
          lpBalance,
          address
        );

        await publicClient.waitForTransactionReceipt({
          hash: approveHash,
        });
      }

      await stake();
    } catch (err: any) {
      txStore.setError(err?.message);
      txStore.setStatus("error");
    }
  }

  const disabled =
    !connected ||
    loading ||
    lpBalance === 0n;

  return (
    <Card className="p-6 space-y-5 w-full max-w-md mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">
          {lpSymbol}
        </h3>
        <span className="text-xs text-muted-foreground">
          PID #{pid}
        </span>
      </div>

      {loading && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}

      {/* Stats */}
      <div className="text-sm space-y-1">
        <div>
          Your LP Balance: {formatUnits(lpBalance, lpDecimals)}
        </div>
        <div>
          Total Staked: {formatUnits(totalStaked, lpDecimals)}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          fullWidth
          disabled={disabled}
          onClick={handleStake}
        >
          Stake All
        </Button>

        <Button
          fullWidth
          variant="secondary"
          disabled={!connected}
          onClick={unstake}
        >
          Unstake
        </Button>
      </div>

      <Button
        fullWidth
        variant="outline"
        disabled={!connected}
        onClick={harvest}
      >
        Claim {rewardSymbol}
      </Button>
    </Card>
  );
}
