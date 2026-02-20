"use client";

import { useWalletStore } from "@/store";
import { Button } from "@/components/ui";

export function WalletButton() {
  const { address, connected } = useWalletStore();

  if (!connected) {
    return (
      <Button variant="primary">
        Connect Wallet
      </Button>
    );
  }

  return (
    <Button variant="secondary">
      {address?.slice(0, 6)}...{address?.slice(-4)}
    </Button>
  );
}
