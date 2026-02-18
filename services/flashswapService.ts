import { walletClient } from "@/lib";
import { CONTRACTS } from "@/config";
import { parseAbi } from "viem";

const flashswapAbi = parseAbi([
  "function executeFlashSwap(address token,uint256 amount)"
]);

export async function executeFlashSwap(
  token: `0x${string}`,
  amount: bigint
) {
  const [account] = await walletClient.getAddresses();

  return walletClient.writeContract({
    address: CONTRACTS.flashswap,
    abi: flashswapAbi,
    functionName: "executeFlashSwap",
    args: [token, amount],
    account,
  });
}
