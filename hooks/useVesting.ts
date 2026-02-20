import {
  claim,
  claimable,
  vestingSchedule,
  totalReleased,
} from "@/services";
import {
  useWalletStore,
  useTransactionStore,
  useVestingStore,
} from "@/store";

export function useVesting() {
  const { address } = useWalletStore();
  const txStore = useTransactionStore();
  const vestingStore = useVestingStore();

  async function claimTokens() {
    try {
      txStore.setStatus("pending");
      const txHash = await claim();
      txStore.setHash(txHash);
      txStore.setStatus("success");
    } catch (err: any) {
      txStore.setError(err?.message);
      txStore.setStatus("error");
    }
  }

  async function fetchClaimable() {
    if (!address) return;
    const amount = await claimable(address);
    vestingStore.setClaimable(amount);
  }

  async function fetchSchedule() {
    if (!address) return;
    return vestingSchedule(address);
  }

  async function fetchReleased() {
    if (!address) return;
    return totalReleased(address);
  }

  return {
    claimTokens,
    fetchClaimable,
    fetchSchedule,
    fetchReleased,
  };
}
