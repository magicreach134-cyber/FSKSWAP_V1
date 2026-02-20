import { publicClient } from "@/lib/publicClient";
import { getWalletClient } from "@/lib/walletClient";
import { erc20Abi } from "@/abi";
import { Address } from "viem";

export async function balanceOf(
  token: Address,
  user: Address
): Promise<bigint> {
  return publicClient.readContract({
    address: token,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [user],
  });
}

export async function allowance(
  token: Address,
  owner: Address,
  spender: Address
): Promise<bigint> {
  return publicClient.readContract({
    address: token,
    abi: erc20Abi,
    functionName: "allowance",
    args: [owner, spender],
  });
}

export async function approve(
  token: Address,
  spender: Address,
  amount: bigint,
  account: Address
) {
  const walletClient = getWalletClient();

  return walletClient.writeContract({
    address: token,
    abi: erc20Abi,
    functionName: "approve",
    args: [spender, amount],
    account,
  });
}

export async function decimals(
  token: Address
): Promise<number> {
  return publicClient.readContract({
    address: token,
    abi: erc20Abi,
    functionName: "decimals",
  });
}

export async function symbol(
  token: Address
): Promise<string> {
  return publicClient.readContract({
    address: token,
    abi: erc20Abi,
    functionName: "symbol",
  });
}

export async function name(
  token: Address
): Promise<string> {
  return publicClient.readContract({
    address: token,
    abi: erc20Abi,
    functionName: "name",
  });
}
