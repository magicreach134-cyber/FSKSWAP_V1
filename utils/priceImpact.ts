export function calculatePriceImpact(
  inputAmount: number,
  marketPrice: number,
  executionPrice: number
): number {
  if (marketPrice === 0) return 0;
  return ((executionPrice - marketPrice) / marketPrice) * 100;
}
