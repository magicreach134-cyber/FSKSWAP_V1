export function getDeadline(minutes: number = 20): number {
  return Math.floor(Date.now() / 1000) + minutes * 60;
}
