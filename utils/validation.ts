export function isPositiveNumber(value: string): boolean {
  const num = Number(value);
  return !isNaN(num) && num > 0;
}
