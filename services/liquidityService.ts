import { walletClient } from "@/lib";
import { CONTRACTS } from "@/config";
import { parseAbi } from "viem";

const routerAbi = parseAbi([
  "function addLiquidity(address,address,uint,uint,uint,uint,address,uint)",
  "function removeLiquidity(address,address,uint,uint,uint,address,uint)"
]);

export async function addLiquidity(
  tokenA: `0x${string}`,
  tokenB: `0x${string}`,
  amountA: bigint,
  amountB: bigint,
  amountAMin: bigint,
  amountBMin: bigint,
  to: `0x${string}`,
  deadline: number
) {
  const [account] = await walletClient.getAddresses();

  return walletClient.writeContract({
    address: CONTRACTS.router,
    abi: routerAbi,
    functionName: "addLiquidity",
    args: [
      tokenA,
      tokenB,
      amountA,
      amountB,
      amountAMin,
      amountBMin,
      to,
      deadline
    ],
    account,
  });
}
