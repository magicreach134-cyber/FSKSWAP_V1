"use client";

import { Modal, Button } from "@/components/ui";
import { useLiquidityStore } from "@/store/useLiquidityStore";
import { useTransactionStore } from "@/store/useTransactionStore";
import { formatUnits } from "viem";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function ConfirmLiquidityModal({
  open,
  onClose,
  onConfirm,
}: Props) {
  const {
    tokenA,
    tokenB,
    amountA,
    amountB,
    slippage,
    deadlineMinutes,
  } = useLiquidityStore();

  const { status } = useTransactionStore();

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-6 space-y-6 w-full max-w-md">
        <h2 className="text-lg font-semibold">
          Confirm Liquidity
        </h2>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Token A</span>
            <span>{amountA}</span>
          </div>

          <div className="flex justify-between">
            <span>Token B</span>
            <span>{amountB}</span>
          </div>

          <div className="flex justify-between">
            <span>Slippage</span>
            <span>{slippage}%</span>
          </div>

          <div className="flex justify-between">
            <span>Transaction Deadline</span>
            <span>{deadlineMinutes} min</span>
          </div>
        </div>

        <Button
          fullWidth
          disabled={status === "pending"}
          onClick={onConfirm}
        >
          Confirm Supply
        </Button>
      </div>
    </Modal>
  );
}
