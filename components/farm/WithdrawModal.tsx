// /components/farm/WithdrawModal.tsx
"use client";

import { useState } from "react";
import { Modal, Button } from "@/components/ui";
import { parseUnits, formatUnits } from "viem";
import { withdraw } from "@/services/farmService";
import { useWalletStore } from "@/store/walletStore";
import { useTransactionStore } from "@/store/transactionStore";
import { publicClient } from "@/lib/publicClient";

interface Props {
  open: boolean;
  onClose: () => void;
  pid: number;
  stakedAmount: bigint;
  decimals?: number;
}

export default function WithdrawModal({
  open,
  onClose,
  pid,
  stakedAmount,
  decimals = 18,
}: Props) {
  const { address } = useWalletStore();
  const txStore = useTransactionStore();

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const maxAmount = formatUnits(stakedAmount, decimals);

  const disabled = !amount || loading || !address;

  async function handleWithdraw() {
    if (!address) return;

    try {
      setLoading(true);

      txStore.open();
      txStore.setTitle("Withdraw LP");
      txStore.setDescription("Confirm withdraw transaction");
      txStore.setStatus("prompting");

      const amountWei = parseUnits(amount, decimals);

      const hash = await withdraw(pid, amountWei);

      txStore.setHash(hash);
      txStore.setStatus("pending");

      await publicClient.waitForTransactionReceipt({ hash });

      txStore.setStatus("success");
      onClose();
    } catch (err: any) {
      txStore.setError(err?.message || "Withdraw failed");
      txStore.setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-6 space-y-6 w-full max-w-md">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Withdraw LP Tokens</h2>
          <p className="text-sm text-muted-foreground">
            Staked: {maxAmount}
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
          onClick={handleWithdraw}
        >
          {loading ? "Withdrawing..." : "Withdraw"}
        </Button>
      </div>
    </Modal>
  );
}
