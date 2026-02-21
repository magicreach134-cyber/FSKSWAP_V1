// /components/farm/ClaimButton.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { useWalletStore } from "@/store/walletStore";
import { useTransactionStore } from "@/store/transactionStore";
import { publicClient } from "@/lib/publicClient";
import { deposit } from "@/services/farmService";

interface Props {
  pid: number;
  disabled?: boolean;
}

export default function ClaimButton({ pid, disabled }: Props) {
  const { address, connected } = useWalletStore();
  const txStore = useTransactionStore();
  const [loading, setLoading] = useState(false);

  async function handleClaim() {
    if (!address) return;

    try {
      setLoading(true);

      txStore.open();
      txStore.setTitle("Claim Rewards");
      txStore.setDescription("Confirm reward claim");
      txStore.setStatus("prompting");

      // MasterChef pattern: deposit 0 to claim rewards
      const hash = await deposit(pid, 0n);

      txStore.setHash(hash);
      txStore.setStatus("pending");

      await publicClient.waitForTransactionReceipt({ hash });

      txStore.setStatus("success");
    } catch (err: any) {
      txStore.setError(err?.message || "Claim failed");
      txStore.setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      fullWidth
      variant="outline"
      disabled={!connected || disabled || loading}
      onClick={handleClaim}
    >
      {!connected
        ? "Connect Wallet"
        : loading
        ? "Claiming..."
        : "Claim"}
    </Button>
  );
}
