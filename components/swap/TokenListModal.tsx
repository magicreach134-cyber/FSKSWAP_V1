"use client";

import { useState } from "react";
import { Modal, Input } from "@/components/ui";

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (token: `0x${string}`) => void;
}

const TOKENS: `0x${string}`[] = [
  // Add your configured token addresses here
];

export default function TokenListModal({
  open,
  onClose,
  onSelect,
}: Props) {
  const [search, setSearch] = useState("");

  const filtered = TOKENS.filter((t) =>
    t.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-6 space-y-4 w-full max-w-md">
        <Input
          placeholder="Search by address"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="max-h-60 overflow-y-auto space-y-2">
          {filtered.map((token) => (
            <div
              key={token}
              className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              onClick={() => {
                onSelect(token);
                onClose();
              }}
            >
              {token}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
