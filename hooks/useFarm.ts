import { deposit, withdraw, emergencyWithdraw } from "@/services";
import { useFarmStore, useWalletStore, useTransactionStore } from "@/store";
import { allowance, approve } from "@/services";
import { CONTRACTS } from "@/config";
import { Address } from "viem";

export function useFarm() {
  const { selectedPid, stakeAmount } = useFarmStore();
  const { address } = useWalletStore();
  const txStore = useTransactionStore();

  async function stake(lpToken: Address) {
    if (selectedPid === undefined || !stakeAmount || !address) return;

    try {
      txStore.setStatus("pending");

      const amountWei = BigInt(stakeAmount);

      const currentAllowance = await allowance(
        lpToken,
        address,
        CONTRACTS.staking
      );

      if (currentAllowance < amountWei) {
        txStore.setStatus("approving");
        await approve(lpToken, CONTRACTS.staking, amountWei);
      }

      const txHash = await deposit(selectedPid, amountWei);
      txStore.setHash(txHash);
      txStore.setStatus("success");
    } catch (err: any) {
      txStore.setError(err?.message);
      txStore.setStatus("error");
    }
  }

  async function unstake() {
    if (selectedPid === undefined || !stakeAmount) return;

    try {
      txStore.setStatus("pending");
      const txHash = await withdraw(selectedPid, BigInt(stakeAmount));
      txStore.setHash(txHash);
      txStore.setStatus("success");
    } catch (err: any) {
      txStore.setError(err?.message);
      txStore.setStatus("error");
    }
  }

  async function emergency() {
    if (selectedPid === undefined) return;

    try {
      txStore.setStatus("pending");
      const txHash = await emergencyWithdraw(selectedPid);
      txStore.setHash(txHash);
      txStore.setStatus("success");
    } catch (err: any) {
      txStore.setError(err?.message);
      txStore.setStatus("error");
    }
  }

  return { stake, unstake, emergency };
}
