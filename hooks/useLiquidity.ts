import { addLiquidity } from "@/services";
import { useLiquidityStore, useWalletStore, useTransactionStore } from "@/store";
import { allowance, approve } from "@/services";
import { CONTRACTS } from "@/config";
import { getDeadline } from "@/utils";

export function useLiquidity() {
  const { tokenA, tokenB, amountA, amountB } = useLiquidityStore();
  const { address } = useWalletStore();
  const txStore = useTransactionStore();

  async function provide() {
    if (!tokenA || !tokenB || !amountA || !amountB || !address) return;

    try {
      txStore.setStatus("pending");

      const amountAWei = BigInt(amountA);
      const amountBWei = BigInt(amountB);

      const allowanceA = await allowance(tokenA, address, CONTRACTS.router);
      if (allowanceA < amountAWei) {
        txStore.setStatus("approving");
        await approve(tokenA, CONTRACTS.router, amountAWei);
      }

      const allowanceB = await allowance(tokenB, address, CONTRACTS.router);
      if (allowanceB < amountBWei) {
        txStore.setStatus("approving");
        await approve(tokenB, CONTRACTS.router, amountBWei);
      }

      const deadline = BigInt(getDeadline());

      const txHash = await addLiquidity(
        tokenA,
        tokenB,
        amountAWei,
        amountBWei,
        amountAWei,
        amountBWei,
        address,
        deadline
      );

      txStore.setHash(txHash);
      txStore.setStatus("success");
    } catch (err: any) {
      txStore.setError(err?.message);
      txStore.setStatus("error");
    }
  }

  return { provide };
}
