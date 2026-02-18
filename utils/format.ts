export function formatUnits(value: bigint, decimals: number): string {
  const divisor = 10n ** BigInt(decimals);
  const whole = value / divisor;
  const fraction = value % divisor;

  const fractionStr = fraction.toString().padStart(decimals, "0").slice(0, 6);

  return `${whole.toString()}.${fractionStr}`;
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
