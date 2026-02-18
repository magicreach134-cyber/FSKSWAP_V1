export function calculateAPR(
  rewardPerBlock: bigint,
  rewardTokenPrice: number,
  totalStakedValue: number,
  blocksPerYear: number = 10512000
): number {
  if (totalStakedValue === 0) return 0;

  const yearlyRewards =
    Number(rewardPerBlock) * blocksPerYear * rewardTokenPrice;

  return (yearlyRewards / totalStakedValue) * 100;
}
