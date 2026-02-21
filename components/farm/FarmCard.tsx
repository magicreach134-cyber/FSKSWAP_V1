"use client";

import { useEffect, useState } from "react";
import { Card, Button, Spinner } from "@/components/ui";
import { formatUnits } from "viem";
import { publicClient } from "@/lib/publicClient";
import { useWalletStore } from "@/store/walletStore";
import { userInfo, pendingReward } from "@/services/farmService";
import FSKPair_ABI from "@/abi/FSKPair.json";

import ApproveFarmButton from "./ApproveFarmButton";
import StakeModal from "./StakeModal";
import WithdrawModal from "./WithdrawModal";
import ClaimButton from "./ClaimButton";

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

  const [lpBalance, setLpBalance] = useState<bigint>(0n);
  const [staked, setStaked] = useState<bigint>(0n);
  const [pending, setPending] = useState<bigint>(0n);
  const [loading, setLoading] = useState(false);

  const [openStake, setOpenStake] = useState(false);
  const [openWithdraw, setOpenWithdraw] = useState(false);

  // --------------------------------
  // Load Data
  // --------------------------------
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

  return (
    <>
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
            Pending {rewardSymbol}:{" "}
            {formatUnits(pending, 18)}
          </div>
        </div>

        {/* Approve */}
        <ApproveFarmButton
          lpToken={lpToken}
          requiredAmount={lpBalance}
        />

        {/* Stake / Withdraw */}
        <div className="flex gap-2">
          <Button
            fullWidth
            disabled={!connected}
            onClick={() => setOpenStake(true)}
          >
            Stake
          </Button>

          <Button
            fullWidth
            variant="secondary"
            disabled={!connected || staked === 0n}
            onClick={() => setOpenWithdraw(true)}
          >
            Withdraw
          </Button>
        </div>

        {/* Claim */}
        <ClaimButton
          pid={pid}
          disabled={pending === 0n}
        />
      </Card>

      {/* Modals */}
      <StakeModal
        open={openStake}
        onClose={() => setOpenStake(false)}
        pid={pid}
        lpBalance={lpBalance}
        decimals={lpDecimals}
      />

      <WithdrawModal
        open={openWithdraw}
        onClose={() => setOpenWithdraw(false)}
        pid={pid}
        stakedAmount={staked}
        decimals={lpDecimals}
      />
    </>
  );
}
