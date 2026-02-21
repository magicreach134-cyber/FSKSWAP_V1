"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui";
import { useWalletStore } from "@/store/walletStore";
import { useTransactionStore } from "@/store/transactionStore";
import { allowance, approve } from "@/services/erc20Service";
import { publicClient } from "@/lib/publicClient";
import { CONTRACTS } from "@/config";
import type { Address } from "viem";

interface Props {
  lpToken: Address;
  requiredAmount: bigint;
  onApproved?: () => void;
}

export default function ApproveFarmButton({
  lpToken,
  requiredAmount,
  onApproved,
}: Props) {
  const { address, connected } = useWalletStore();
  const txStore = useTransactionStore();

  const [approved, setApproved] = useState(false);
  const [loading, setLoading] = useState(false);

  // --------------------------------
  // Check Allowance
  // --------------------------------
  useEffect(() => {
    async function checkAllowance() {
      if (!address || !lpToken) return;

      const currentAllowance = await allowance(
        lpToken,
        address,
        CONTRACTS.staking
      );

      setApproved(currentAllowance >= requiredAmount);
    }

    checkAllowance();
  }, [address, lpToken, requiredAmount]);

  // --------------------------------
  // Approve
  // --------------------------------
  async function handleApprove() {
    if (!address) return;

    try {
      setLoading(true);

      txStore.open();
      txStore.setTitle("Approve LP Token");
      txStore.setDescription("Approve LP token for farming");
      txStore.setStatus("prompting");

      const hash = await approve(
        lpToken,
        CONTRACTS.staking,
        requiredAmount,
        address
      );

      txStore.setHash(hash);
      txStore.setStatus("pending");

      await publicClient.waitForTransactionReceipt({ hash });

      txStore.setStatus("success");
      setApproved(true);

      if (onApproved) onApproved();
    } catch (err: any) {
      txStore.setError(err?.message || "Approval failed");
      txStore.setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  if (approved) return null;

  return (
    <Button
      fullWidth
      disabled={!connected || loading}
      onClick={handleApprove}
    >
      {!connected
        ? "Connect Wallet"
        : loading
        ? "Approving..."
        : "Approve"}
    </Button>
  );
}
