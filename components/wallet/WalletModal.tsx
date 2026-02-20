"use client";

import { Modal } from "@/components/ui";
import { useWalletStore } from "@/store/walletStore";
import ConnectOptions from "./ConnectOptions";
import AccountDetails from "./AccountDetails";
import UnsupportedNetwork from "./UnsupportedNetwork";

export default function WalletModal() {
  const {
    isOpen,
    close,
    address,
    chainId,
    requiredChainId,
  } = useWalletStore();

  if (!isOpen) return null;

  const isWrongNetwork =
    address && chainId !== requiredChainId;

  return (
    <Modal open={isOpen} onClose={close}>
      <div className="p-6 w-full max-w-md space-y-6">
        <h2 className="text-lg font-semibold">
          {address ? "Wallet" : "Connect Wallet"}
        </h2>

        {!address && <ConnectOptions />}

        {address && isWrongNetwork && (
          <UnsupportedNetwork />
        )}

        {address && !isWrongNetwork && (
          <AccountDetails />
        )}
      </div>
    </Modal>
  );
}
