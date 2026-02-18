import { publicClient, walletClient } from "@/lib";
import { CONTRACTS } from "@/config";
import { parseAbi } from "viem";

const farmAbi = parseAbi([
  "function deposit(uint256 pid, uint256 amount)",
  "function withdraw(uint256 pid, uint256 amount)",
  "function pendingReward(uint256 pid, address user) view returns (uint256)"
]);

export async function deposit(pid: number, amount: bigint) {
  const [account] = await walletClient.getAddresses();

  return walletClient.writeContract({
    address: CONTRACTS.staking,
    abi: farmAbi,
    functionName: "deposit",
    args: [pid, amount],
    account,
  });
}

export async function pendingReward(pid: number, user: `0x${string}`) {
  return publicClient.readContract({
    address: CONTRACTS.staking,
    abi: farmAbi,
    functionName: "pendingReward",
    args: [pid, user],
  });
}
