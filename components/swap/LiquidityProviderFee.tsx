"use client";

import { useSwapStore } from "@/store/swapStore";

export default function LiquidityProviderFee() {
  const { fromAmount } = useSwapStore();

  if (!fromAmount) return null;

  const fee = Number(fromAmount) * 0.003;

  return (
    <div className="flex justify-between">
      <span>Liquidity Provider Fee</span>
      <span>{fee.toFixed(6)}</span>
    </div>
  );
}
