"use client";

import { Input, Button } from "@/components/ui";
import Image from "next/image";
import type { Token } from "./SwapWidget";

interface Props {
  label: string;
  token: Token | null;
  amount: string;
  onAmountChange: (value: string) => void;
  onSelectToken: () => void;
  readOnly?: boolean;
}

export default function TokenSelector({
  label,
  token,
  amount,
  onAmountChange,
  onSelectToken,
  readOnly,
}: Props) {
  return (
    <div className="bg-[#1f2937] rounded-2xl p-4 space-y-3">
      <div className="flex justify-between text-sm text-gray-400">
        <span>{label}</span>
        <span>Balance: 0.00</span>
      </div>

      <div className="flex items-center gap-3">
        <Input
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          placeholder="0.0"
          readOnly={readOnly}
          className="bg-transparent border-none text-lg focus:ring-0"
        />

        <Button variant="secondary" onClick={onSelectToken}>
          {token ? (
            <div className="flex items-center gap-2">
              <Image
                src={token.logo}
                alt={token.symbol}
                width={20}
                height={20}
              />
              {token.symbol}
            </div>
          ) : (
            "Select"
          )}
        </Button>
      </div>
    </div>
  );
}
