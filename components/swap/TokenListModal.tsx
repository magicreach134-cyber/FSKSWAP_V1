"use client";

import { Modal, Input } from "@/components/ui";
import { useState } from "react";
import type { Token } from "./SwapWidget";

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (token: Token) => void;
}

const TOKENS: Token[] = [
  {
    address: "0x...",
    symbol: "FSK",
    decimals: 18,
    logo: "/tokens/fsk.png",
  },
  {
    address: "0x...",
    symbol: "WBNB",
    decimals: 18,
    logo: "/tokens/wbnb.png",
  },
];

export default function TokenListModal({
  open,
  onClose,
  onSelect,
}: Props) {
  const [search, setSearch] = useState("");

  const filtered = TOKENS.filter((t) =>
    t.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-6 w-full max-w-md space-y-4">
        <h3 className="text-lg font-semibold">Select Token</h3>

        <Input
          placeholder="Search token"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="space-y-2">
          {filtered.map((token) => (
            <button
              key={token.address}
              onClick={() => onSelect(token)}
              className="w-full text-left p-3 rounded-xl hover:bg-gray-800"
            >
              {token.symbol}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}
