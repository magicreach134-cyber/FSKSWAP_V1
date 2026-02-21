"use client";

import { useEffect, useState } from "react";
import { Card, Button, Spinner } from "@/components/ui";
import { formatUnits, parseUnits } from "viem";
import { publicClient } from "@/lib/publicClient";
import { allowance, approve } from "@/services/erc20Service";
import { useWalletStore } from "@/store/walletStore";
import { useTransactionStore } from "@/store/transactionStore";
import { useFarm } from "@/hooks/useFarm";
import { poolInfo } from "@/services/farmService";
import { CONTRACTS } from "@/config";

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
  const { refresh, stake, unstake, harvest } = useFarm(pid);

  const [totalStaked, setTotalStaked] = useState<bigint>(0n);
  const [userStaked, setUserStaked] = useState<bigint>(0n);
  const [pending, setPending] = useState<bigint>(0n);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // --------------------------------
  // Fetch Pool + User Info
  // --------------------------------
  useEffect(() => {
    async function load() {
      if (!address) return;

      setLoading(true);

      const pool = await poolInfo(pid);
      const data = await refresh();

      setTotalStaked(pool.totalDeposit || 0n);
      setUserStaked(data?.staked || 0n);
      setPending(data?.pending || 0n);

      setLoading(false);
    }

    load();
  }, [address]);

  // --------------------------------
  // Stake Handler
  // --------------------------------
  async function handleStake() {
    if (!input || !address) return;

    try {
      const amount = parseUnits(input, lpDecimals);

      txStore.open();
      txStore.setTitle("Stake LP");
      txStore.setStatus("prompting");

      const currentAllowance = await allowance(
        lpToken,
        address,
        CONTRACTS.staking
      );

      if (currentAllowance < amount) {
        txStore.setStatus("approving");
        const approveHash = await approve(
          lpToken,
          CONTRACTS.staking,
          amount,
          address
        );

        await publicClient.waitForTransactionReceipt({
          hash: approveHash,
        });
      }

      await stake(amount);
      setInput("");
    } catch (err: any) {
      txStore.setError(err?.message);
      txStore.setStatus("error");
    }
  }

  // --------------------------------
  // Unstake Handler
  // --------------------------------
  async function handleUnstake() {
    if (!input) return;
    const amount = parseUnits(input, lpDecimals);
    await unstake(amount);
    setInput("");
  }

  const disabled =
    !connected || loading;

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

      {/* Pool Stats */}
      <div className="text-sm space-y-1">
        <div>
          Total Staked: {formatUnits(totalStaked, lpDecimals)}
        </div>
        <div>
          Your Stake: {formatUnits(userStaked, lpDecimals)}
        </div>
        <div>
          Pending {rewardSymbol}:{" "}
          {formatUnits(pending, 18)}
        </div>
      </div>

      {/* Input */}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="0.0"
        className="w-full px-3 py-2 rounded-lg border dark:bg-gray-900"
      />

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          fullWidth
          disabled={disabled}
          onClick={handleStake}
        >
          Stake
        </Button>

        <Button
          fullWidth
          variant="secondary"
          disabled={disabled}
          onClick={handleUnstake}
        >
          Unstake
        </Button>
      </div>

      <Button
        fullWidth
        variant="outline"
        disabled={!pending || pending === 0n}
        onClick={harvest}
      >
        Harvest
      </Button>
    </Card>
  );
}
