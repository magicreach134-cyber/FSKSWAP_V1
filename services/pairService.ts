import { publicClient } from "@/lib/publicClient";
import FskFactoryV2_ABI from "@/abi/FskFactoryV2.json";
import FSKPair_ABI from "@/abi/FSKPair.json";
import { FACTORY_ADDRESS } from "@/config/contracts";

const ZERO_ADDRESS =
  "0x0000000000000000000000000000000000000000";

export async function getPairAddress(
  tokenA: `0x${string}`,
  tokenB: `0x${string}`
): Promise<`0x${string}` | null> {
  const pair = await publicClient.readContract({
    address: FACTORY_ADDRESS,
    abi: FskFactoryV2_ABI,
    functionName: "getPair",
    args: [tokenA, tokenB],
  });

  if (!pair || pair === ZERO_ADDRESS) {
    return null;
  }

  return pair;
}

export async function getReserves(pairAddress: `0x${string}`) {
  const [reserve0, reserve1] = await publicClient.readContract({
    address: pairAddress,
    abi: FSKPair_ABI,
    functionName: "getReserves",
  });

  return {
    reserve0,
    reserve1,
  };
}
