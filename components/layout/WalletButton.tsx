"use client";

import { Button } from "@/components/ui";
import { useWalletStore } from "@/store/walletStore";
import { shortenAddress } from "@/lib/shortenAddress";
import clsx from "clsx";

export function WalletButton() {
  const {
    address,
    chainId,
    open,
    requiredChainId,
  } = useWalletStore();

  const isWrongNetwork =
    address && chainId !== requiredChainId;

  return (
    <Button
      onClick={open}
      className={clsx(
        "min-w-[140px]",
        isWrongNetwork && "bg-red-600 hover:bg-red-700"
      )}
    >
      {!address && "Connect Wallet"}
      {address && !isWrongNetwork && shortenAddress(address)}
      {address && isWrongNetwork && "Wrong Network"}
    </Button>
  );
}
