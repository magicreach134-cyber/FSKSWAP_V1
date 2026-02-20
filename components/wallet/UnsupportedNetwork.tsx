"use client";

import { Button } from "@/components/ui";
import { useWalletStore } from "@/store/walletStore";

export default function UnsupportedNetwork() {
  const { requiredChainId } = useWalletStore();

  return (
    <div className="space-y-4 text-center">
      <p className="text-red-500 font-medium">
        Wrong Network
      </p>

      <p className="text-sm text-muted-foreground">
        Please switch to BNB Testnet (Chain ID: {requiredChainId})
      </p>

      <Button fullWidth>
        Switch Network
      </Button>
    </div>
  );
}
