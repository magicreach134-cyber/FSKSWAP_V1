"use client";

import { Button } from "@/components/ui";
import { useWalletStore } from "@/store/walletStore";

export default function DisconnectButton() {
  const { disconnect } = useWalletStore();

  return (
    <Button variant="danger" fullWidth onClick={disconnect}>
      Disconnect
    </Button>
  );
}
