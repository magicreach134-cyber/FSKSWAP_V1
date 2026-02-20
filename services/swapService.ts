import { publicClient } from "@/lib/publicClient";
import { parseUnits, formatUnits } from "viem";
import { FSKRouterV3_ABI } from "@/abi/FSKRouterV3";

export async function getQuote({
  routerAddress,
  amountIn,
  path,
  inputDecimals,
  outputDecimals,
}: {
  routerAddress: `0x${string}`;
  amountIn: string;
  path: readonly `0x${string}`[];
  inputDecimals: number;
  outputDecimals: number;
}) {
  if (!amountIn || Number(amountIn) <= 0) {
    return "0";
  }

  if (!path || path.length < 2) {
    throw new Error("Invalid swap path");
  }

  const parsedAmount = parseUnits(amountIn, inputDecimals);

  const amounts = await publicClient.readContract({
    address: routerAddress,
    abi: FSKRouterV3_ABI,
    functionName: "getAmountsOut",
    args: [parsedAmount, path],
  });

  const finalAmount = amounts[amounts.length - 1];

  return formatUnits(finalAmount, outputDecimals);
}
