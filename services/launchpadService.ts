import { walletClient } from "@/lib";
import { CONTRACTS } from "@/config";
import { parseAbi } from "viem";

const launchpadAbi = parseAbi([
  "function createPresale(address token,uint256 softCap,uint256 hardCap)"
]);

export async function createPresale(
  token: `0x${string}`,
  softCap: bigint,
  hardCap: bigint
) {
  const [account] = await walletClient.getAddresses();

  return walletClient.writeContract({
    address: CONTRACTS.launchpadFactory,
    abi: launchpadAbi,
    functionName: "createPresale",
    args: [token, softCap, hardCap],
    account,
  });
}
