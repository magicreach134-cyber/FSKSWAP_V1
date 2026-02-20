import { parseUnits } from "viem";

export function calculateMinOut({
  quotedAmountOut,
  slippage,
  decimals,
}: {
  quotedAmountOut: string;
  slippage: number; // e.g. 0.5 for 0.5%
  decimals: number;
}) {
  const amountOut = parseUnits(quotedAmountOut, decimals);

  const slippageBps = BigInt(Math.floor(slippage * 100)); // 0.5% = 50 bps
  const denominator = 10000n;

  const minOut =
    (amountOut * (denominator - slippageBps)) / denominator;

  return minOut;
}
