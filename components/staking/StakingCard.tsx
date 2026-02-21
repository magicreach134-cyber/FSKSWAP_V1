"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, Button, Spinner } from "@/components/ui";
import { formatUnits } from "viem";
import { publicClient } from "@/lib/publicClient";
import { useWalletStore } from "@/store/walletStore";
import {
  pendingReward,
  userInfo,
  poolInfo,
} from "@/services/stakingService";
import { useStaking } from "@/hooks/useStaking";
import ERC20_ABI from "@/abi/ERC20.json";
import { CONTRACTS } from "@/config";

interface Props {
  pid: number;
  token: `0x${string}`;
  tokenSymbol: string;
  rewardSymbol: string;
  decimals?: number;
}

const BLOCKS_PER_YEAR = 10512000n; // ~3s block time (BSC style)

export default function StakingCard({
  pid,
  token,
  tokenSymbol,
  rewardSymbol,
  decimals = 18,
}: Props) {
  const { address, connected } = useWalletStore();
  const { handleStake, handleWithdraw, handleClaim } =
    useStaking(pid, decimals);

  const [balance, setBalance] = useState<bigint>(0n);
  const [staked, setStaked] = useState<bigint>(0n);
  const [pending, setPending] = useState<bigint>(0n);
  const [rewardPerBlock, setRewardPerBlock] =
    useState<bigint>(0n);
  const [totalStaked, setTotalStaked] =
    useState<bigint>(0n);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // --------------------------------
  // Load Data
  // --------------------------------
  const load = useCallback(async () => {
    if (!address) return;

    try {
      setLoading(true);

      const [bal, user, reward, pool] =
        await Promise.all([
          publicClient.readContract({
            address: token,
            abi: ERC20_ABI,
            functionName: "balanceOf",
            args: [address],
          }),
          userInfo(pid, address),
          pendingReward(pid, address),
          poolInfo(pid),
        ]);

      // total staked = staking contract token balance
      const total = await publicClient.readContract({
        address: token,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [CONTRACTS.staking],
      });

      setBalance(bal);
      setStaked(user.amount);
      setPending(reward);
      setRewardPerBlock(pool.rewardPerBlock);
      setTotalStaked(total);
    } finally {
      setLoading(false);
    }
  }, [address, pid, token]);

  useEffect(() => {
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, [load]);

  // --------------------------------
  // APR Calculation
  // --------------------------------
  let apr = 0;

  if (totalStaked > 0n && rewardPerBlock > 0n) {
    const yearlyRewards =
      rewardPerBlock * BLOCKS_PER_YEAR;

    const yearly = Number(
      formatUnits(yearlyRewards, 18)
    );

    const tvl = Number(
      formatUnits(totalStaked, decimals)
    );

    if (tvl > 0) {
      apr = (yearly / tvl) * 100;
    }
  }

  const disabled =
    !connected || loading;

  return (
    <Card className="p-6 space-y-6 w-full max-w-md mx-auto">
      <h3 className="font-semibold">
        Stake {tokenSymbol}
      </h3>

      {loading && <Spinner />}

      {/* Pool Stats */}
      <div className="text-sm space-y-1">
        <div>
          TVL: {formatUnits(totalStaked, decimals)}
        </div>
        <div>
          Reward / Block:{" "}
          {formatUnits(rewardPerBlock, 18)}
        </div>
        <div>
          APR: {apr.toFixed(2)}%
        </div>
      </div>

      {/* User Stats */}
      <div className="text-sm space-y-1">
        <div>
          Balance: {formatUnits(balance, decimals)}
        </div>
        <div>
          Staked: {formatUnits(staked, decimals)}
        </div>
        <div>
          Pending {rewardSymbol}:{" "}
          {formatUnits(pending, 18)}
        </div>
      </div>

      {/* Amount Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) =>
            setInput(e.target.value)
          }
          className="flex-1 px-3 py-2 border rounded-lg"
          placeholder="0.0"
        />
        <button
          onClick={() =>
            setInput(
              formatUnits(balance, decimals)
            )
          }
          className="px-3 py-2 bg-gray-200 dark:bg-gray-800 rounded-lg text-sm"
        >
          MAX
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          fullWidth
          disabled={disabled}
          onClick={() => handleStake(input)}
        >
          Stake
        </Button>

        <Button
          fullWidth
          variant="secondary"
          disabled={disabled}
          onClick={() => handleWithdraw(input)}
        >
          Withdraw
        </Button>
      </div>

      <Button
        fullWidth
        variant="outline"
        disabled={pending === 0n}
        onClick={handleClaim}
      >
        Claim
      </Button>
    </Card>
  );
}
