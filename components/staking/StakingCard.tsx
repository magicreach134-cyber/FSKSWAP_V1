"use client";

import { useEffect, useState } from "react";
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

interface Props {
  pid: number;
  token: `0x${string}`;
  tokenSymbol: string;
  rewardSymbol: string;
  decimals?: number;
}

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
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    if (!address) return;

    setLoading(true);

    const [bal, user, reward] =
      await Promise.all([
        publicClient.readContract({
          address: token,
          abi: ERC20_ABI,
          functionName: "balanceOf",
          args: [address],
        }),
        userInfo(pid, address),
        pendingReward(pid, address),
      ]);

    setBalance(bal);
    setStaked(user.amount);
    setPending(reward);

    setLoading(false);
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, [address]);

  return (
    <Card className="p-6 space-y-5 w-full max-w-md mx-auto">
      <h3 className="font-semibold">
        Stake {tokenSymbol}
      </h3>

      {loading && <Spinner />}

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

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-lg"
          placeholder="0.0"
        />
        <button
          onClick={() =>
            setInput(formatUnits(balance, decimals))
          }
          className="px-3 py-2 bg-gray-200 rounded-lg text-sm"
        >
          MAX
        </button>
      </div>

      <div className="flex gap-2">
        <Button
          fullWidth
          disabled={!connected}
          onClick={() => handleStake(input)}
        >
          Stake
        </Button>

        <Button
          fullWidth
          variant="secondary"
          disabled={!connected}
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
