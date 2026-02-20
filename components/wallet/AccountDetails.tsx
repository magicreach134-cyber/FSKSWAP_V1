"use client";

import { useWalletStore } from "@/store/walletStore";
import CopyAddressButton from "./CopyAddressButton";
import ExplorerLink from "./ExplorerLink";
import DisconnectButton from "./DisconnectButton";

export default function AccountDetails() {
  const { address } = useWalletStore();

  if (!address) return null;

  return (
    <div className="space-y-4">
      <div className="text-sm break-all">
        {address}
      </div>

      <CopyAddressButton address={address} />
      <ExplorerLink address={address} />
      <DisconnectButton />
    </div>
  );
}
