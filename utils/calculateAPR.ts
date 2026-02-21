export function calculateAPR(
  rewardPerBlock: bigint,
  totalStaked: bigint,
  blocksPerYear: bigint = 10512000n
): number {
  if (totalStaked === 0n) return 0;

  const yearlyRewards = rewardPerBlock * blocksPerYear;

  const apr =
    Number((yearlyRewards * 10000n) / totalStaked) / 100;

  return apr;
}
