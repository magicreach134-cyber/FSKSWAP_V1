export function calculateMinimumReceived(
  amountOut: bigint,
  slippageBps: number
): bigint {
  const slippage = (amountOut * BigInt(slippageBps)) / 10000n;
  return amountOut - slippage;
}
