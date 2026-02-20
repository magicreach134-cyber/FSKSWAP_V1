"use client";

import { Button } from "@/components/ui";
import { useWalletStore } from "@/store/walletStore";
import { useWallet } from "@/hooks/useWallet";

export default function UnsupportedNetwork() {
  const { requiredChainId } = useWalletStore();
  const { switchNetwork } = useWallet();

  return (
    <div className="space-y-4 text-center">
      <p className="text-red-500 font-medium">
        Wrong Network
      </p>

      <p className="text-sm text-muted-foreground">
        Please switch to BNB Testnet (Chain ID: {requiredChainId})
      </p>

      <Button fullWidth onClick={switchNetwork}>
        Switch Network
      </Button>
    </div>
  );
}
