import { publicClient } from "@/lib";
import { CONTRACTS } from "@/config";
import { parseAbi } from "viem";

const treasuryAbi = parseAbi([
  "function totalRevenue() view returns (uint256)"
]);

export async function totalRevenue() {
  return publicClient.readContract({
    address: CONTRACTS.treasury,
    abi: treasuryAbi,
    functionName: "totalRevenue",
  });
}
