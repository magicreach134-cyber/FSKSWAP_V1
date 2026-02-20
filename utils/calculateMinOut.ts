import { parseUnits } from "viem";

export function calculateMinOut({
  quotedAmountOut,
  slippage,
  decimals,
}: {
  quotedAmountOut: string;
  slippage: number; // e.g 0.5 = 0.5%
  decimals: number;
}) {
  if (!quotedAmountOut || Number(quotedAmountOut) <= 0) {
    return 0n;
  }

  // Clamp slippage between 0 and 100
  const safeSlippage =
    slippage < 0 ? 0 : slippage > 100 ? 100 : slippage;

  const amountOut = parseUnits(quotedAmountOut, decimals);

  // Convert % to basis points (0.5% → 50 bps)
  const slippageBps = BigInt(Math.floor(safeSlippage * 100));
  const denominator = 10000n;

  return (amountOut * (denominator - slippageBps)) / denominator;
}
