"use client";

import { Button } from "@/components/ui";
import { useWallet } from "@/hooks/useWallet";
import { useWalletStore } from "@/store/walletStore";

export default function ConnectOptions() {
  const { connect } = useWallet();
  const { connecting } = useWalletStore();

  return (
    <div className="space-y-4">
      <Button
        fullWidth
        loading={connecting}
        onClick={connect}
      >
        Connect MetaMask
      </Button>
    </div>
  );
}
