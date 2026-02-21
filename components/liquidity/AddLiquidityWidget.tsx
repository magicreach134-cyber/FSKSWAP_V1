"use client";

import { useEffect, useState } from "react";
import { Card, Button } from "@/components/ui";

import { useLiquidity } from "@/hooks/useLiquidity";
import { useLiquidityStore } from "@/store/liquidityStore";
import { useWalletStore } from "@/store/walletStore";

import PairSelector from "./PairSelector";
import PoolShareDisplay from "./PoolShareDisplay";
import LPTokenBreakdown from "./LPTokenBreakdown";
import ApproveLiquidityButton from "./ApproveLiquidityButton";
import ConfirmLiquidityModal from "./ConfirmLiquidityModal";
import LiquiditySettings from "./LiquiditySettings";

export default function AddLiquidityWidget() {
  const { provide } = useLiquidity();

  const {
    tokenA,
    tokenB,
    amountA,
    amountB,
    setAmountA,
    setAmountB,
  } = useLiquidityStore();

  const { connected } = useWalletStore();

  const [openConfirm, setOpenConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const disabled =
    !connected ||
    !tokenA ||
    !tokenB ||
    !amountA ||
    !amountB ||
    loading;

  async function handleConfirm() {
    try {
      setLoading(true);
      await provide();
      setOpenConfirm(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Card className="p-6 space-y-6 w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            Add Liquidity
          </h2>
          <LiquiditySettings />
        </div>

        {/* Pair Selection */}
        <PairSelector />

        {/* Amount Inputs */}
        {tokenA && (
          <input
            type="number"
            placeholder="Amount Token A"
            value={amountA}
            onChange={(e) => setAmountA(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        )}

        {tokenB && (
          <input
            type="number"
            placeholder="Amount Token B"
            value={amountB}
            onChange={(e) => setAmountB(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        )}

        {/* Pool Intelligence */}
        <PoolShareDisplay />
        <LPTokenBreakdown />

        {/* Approvals */}
        <ApproveLiquidityButton />

        {/* Supply Button */}
        <Button
          fullWidth
          disabled={disabled}
          onClick={() => setOpenConfirm(true)}
        >
          {!connected
            ? "Connect Wallet"
            : loading
            ? "Processing..."
            : "Supply"}
        </Button>
      </Card>

      {/* Confirmation Modal */}
      <ConfirmLiquidityModal
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
}
