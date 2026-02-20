import {
  executeFlashSwap,
  flashFee,
  isTokenSupported,
} from "@/services";
import {
  useFlashswapStore,
  useTransactionStore,
} from "@/store";
import { Address } from "viem";

export function useFlashswap() {
  const { selectedToken, amount } = useFlashswapStore();
  const txStore = useTransactionStore();

  async function execute(data: `0x${string}`) {
    if (!selectedToken || !amount) return;

    try {
      txStore.setStatus("pending");
      const txHash = await executeFlashSwap(
        selectedToken,
        BigInt(amount),
        data
      );
      txStore.setHash(txHash);
      txStore.setStatus("success");
    } catch (err: any) {
      txStore.setError(err?.message);
      txStore.setStatus("error");
    }
  }

  async function getFee(token: Address, amount: bigint) {
    return flashFee(token, amount);
  }

  async function checkSupport(token: Address) {
    return isTokenSupported(token);
  }

  return {
    execute,
    getFee,
    checkSupport,
  };
}
