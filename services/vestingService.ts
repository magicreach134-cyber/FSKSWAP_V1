import { publicClient } from "@/lib";
import { CONTRACTS } from "@/config";
import { parseAbi } from "viem";

const vestingAbi = parseAbi([
  "function claim()",
  "function claimable(address user) view returns (uint256)"
]);

export async function claimable(user: `0x${string}`) {
  return publicClient.readContract({
    address: CONTRACTS.vesting,
    abi: vestingAbi,
    functionName: "claimable",
    args: [user],
  });
}
