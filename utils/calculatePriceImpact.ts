export function calculatePriceImpact(
  amountIn: bigint,
  reserveIn: bigint,
  reserveOut: bigint
): number {
  if (amountIn === 0n) return 0;

  // Uniswap V2 formula with 0.3% fee
  const amountInWithFee = amountIn * 997n;
  const numerator = amountInWithFee * reserveOut;
  const denominator = reserveIn * 1000n + amountInWithFee;

  const amountOut = numerator / denominator;

  // Spot price (reserve ratio)
  const spotPrice = Number(reserveOut) / Number(reserveIn);

  // Execution price
  const executionPrice = Number(amountOut) / Number(amountIn);

  const impact =
    ((spotPrice - executionPrice) / spotPrice) * 100;

  return impact;
}
