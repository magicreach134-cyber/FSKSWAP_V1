"use client";

import { useState } from "react";
import { Modal, Button } from "@/components/ui";
import { parseUnits, formatUnits } from "viem";
import { deposit } from "@/services/farmService";
import { useWalletStore } from "@/store/walletStore";
import { useTransactionStore } from "@/store/transactionStore";
import { publicClient } from "@/lib/publicClient";

interface Props {
  open: boolean;
  onClose: () => void;
  pid: number;
  lpBalance: bigint;
  decimals?: number;
}

export default function StakeModal({
  open,
  onClose,
  pid,
  lpBalance,
  decimals = 18,
}: Props) {
  const { address } = useWalletStore();
  const txStore = useTransactionStore();

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const maxAmount = formatUnits(lpBalance, decimals);

  const disabled =
    !amount ||
    loading ||
    !address;

  async function handleStake() {
    if (!address) return;

    try {
      setLoading(true);

      txStore.open();
      txStore.setTitle("Stake LP");
      txStore.setDescription("Confirm staking transaction");
      txStore.setStatus("prompting");

      const amountWei = parseUnits(amount, decimals);

      const hash = await deposit(pid, amountWei);

      txStore.setHash(hash);
      txStore.setStatus("pending");

      await publicClient.waitForTransactionReceipt({ hash });

      txStore.setStatus("success");
      onClose();
    } catch (err: any) {
      txStore.setError(err?.message || "Stake failed");
      txStore.setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-6 space-y-6 w-full max-w-md">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Stake LP Tokens</h2>
          <p className="text-sm text-muted-foreground">
            Available: {maxAmount}
          </p>
        </div>

        <div className="space-y-2">
          <input
            type="number"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 rounded-lg border bg-background"
          />

          <button
            onClick={() => setAmount(maxAmount)}
            className="text-xs underline text-right w-full"
          >
            Max
          </button>
        </div>

        <Button
          fullWidth
          disabled={disabled}
          onClick={handleStake}
        >
          {loading ? "Staking..." : "Stake"}
        </Button>
      </div>
    </Modal>
  );
}
