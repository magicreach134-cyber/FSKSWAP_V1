import { getAmountsOut, swapExactTokensForTokens, swapExactTokensForTokensSupportingFeeOnTransferTokens } from "@/services";
import { useSwapStore, useWalletStore, useTransactionStore } from "@/store";
import { CONTRACTS } from "@/config";
import { allowance, approve } from "@/services";
import { getDeadline } from "@/utils";
import { Address } from "viem";

export function useSwap() {
  const { tokenIn, tokenOut, amountIn, slippageBps, feeOnTransfer } = useSwapStore();
  const { address } = useWalletStore();
  const txStore = useTransactionStore();

  async function execute() {
    if (!tokenIn || !tokenOut || !amountIn || !address) return;

    try {
      txStore.setStatus("pending");

      const amountInWei = BigInt(amountIn);
      const path: Address[] = [tokenIn, tokenOut];

      const amounts = await getAmountsOut(amountInWei, path);
      const amountOutMin =
        (amounts[1] * BigInt(10000 - slippageBps)) / 10000n;

      const currentAllowance = await allowance(
        tokenIn,
        address,
        CONTRACTS.router
      );

      if (currentAllowance < amountInWei) {
        txStore.setStatus("approving");
        await approve(tokenIn, CONTRACTS.router, amountInWei);
      }

      const deadline = BigInt(getDeadline());

      const txHash = feeOnTransfer
        ? await swapExactTokensForTokensSupportingFeeOnTransferTokens(
            amountInWei,
            amountOutMin,
            path,
            address,
            deadline
          )
        : await swapExactTokensForTokens(
            amountInWei,
            amountOutMin,
            path,
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

  return { execute };
}
