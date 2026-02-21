"use client";

import { useEffect, useState } from "react";
import { Card, Button, Spinner } from "@/components/ui";
import { formatUnits, parseUnits } from "viem";
import { publicClient } from "@/lib/publicClient";
import { allowance, approve } from "@/services/erc20Service";
import { useWalletStore } from "@/store/walletStore";
import { useTransactionStore } from "@/store/transactionStore";
import { useFarm } from "@/hooks/useFarm";
import { userInfo, pendingReward } from "@/services/farmService";
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
  const [staked, setStaked] = useState<bigint>(0n);
  const [pending, setPending] = useState<bigint>(0n);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      if (!address) return;

      setLoading(true);

      const [bal, user, reward] = await Promise.all([
        publicClient.readContract({
          address: lpToken,
          abi: FSKPair_ABI,
          functionName: "balanceOf",
          args: [address],
        }),
        userInfo(pid, address),
        pendingReward(pid, address),
      ]);

      setLpBalance(bal);
      setStaked(user.amount);
      setPending(reward);

      setLoading(false);
    }

    load();
  }, [address]);

  async function handleStake() {
    if (!input || !address) return;

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
  }

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
      <div className="flex justify-between">
        <h3 className="font-semibold">{lpSymbol}</h3>
        <span className="text-xs text-muted-foreground">
          PID #{pid}
        </span>
      </div>

      {loading && <Spinner />}

      <div className="text-sm space-y-1">
        <div>
          LP Balance: {formatUnits(lpBalance, lpDecimals)}
        </div>
        <div>
          Staked: {formatUnits(staked, lpDecimals)}
        </div>
        <div>
          Pending {rewardSymbol}: {formatUnits(pending, 18)}
        </div>
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="0.0"
          className="flex-1 px-3 py-2 border rounded-lg"
        />
        <button
          onClick={() =>
            setInput(formatUnits(lpBalance, lpDecimals))
          }
          className="px-3 py-2 text-sm bg-gray-200 rounded-lg"
        >
          MAX
        </button>
      </div>

      <div className="flex gap-2">
        <Button fullWidth disabled={disabled} onClick={handleStake}>
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
