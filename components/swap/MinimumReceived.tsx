"use client";

import { useSwapStore } from "@/store/swapStore";
import { calculateMinOut } from "@/utils/calculateMinOut";
import { parseUnits, formatUnits } from "viem";

export default function MinimumReceived() {
  const { toAmount, slippage } = useSwapStore();

  if (!toAmount) return null;

  const min = calculateMinOut({
    quotedAmountOut: toAmount,
    slippage,
    decimals: 18,
  });

  return (
    <div className="flex justify-between">
      <span>Minimum Received</span>
      <span>
        {formatUnits(min, 18)}
      </span>
    </div>
  );
}
