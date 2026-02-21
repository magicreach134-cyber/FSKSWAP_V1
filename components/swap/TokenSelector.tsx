"use client";

import { useState, useEffect } from "react";
import { Button, Input } from "@/components/ui";
import { useSwapStore } from "@/store/swapStore";
import { useWalletStore } from "@/store/walletStore";
import { balanceOf } from "@/services/erc20Service";
import { formatUnits, parseUnits } from "viem";
import { publicClient } from "@/lib/publicClient";
import TokenListModal from "./TokenListModal";
import { NATIVE_TOKEN_ADDRESS } from "@/config/native";

interface Props {
  type: "from" | "to";
  readOnly?: boolean;
}

const GAS_BUFFER = parseUnits("0.003", 18); // ~0.003 BNB buffer

export default function TokenSelector({ type, readOnly }: Props) {
  const {
    fromToken,
    toToken,
    fromAmount,
    setFromAmount,
    setFromToken,
    setToToken,
  } = useSwapStore();

  const { address } = useWalletStore();

  const token = type === "from" ? fromToken : toToken;
  const amount = type === "from" ? fromAmount : "";

  const [open, setOpen] = useState(false);
  const [balance, setBalance] = useState<bigint>(0n);

  // --------------------------------
  // Fetch balance
  // --------------------------------
  useEffect(() => {
    const fetchBalance = async () => {
      if (!address || !token) return;

      if (token === NATIVE_TOKEN_ADDRESS) {
        const nativeBalance = await publicClient.getBalance({
          address,
        });
        setBalance(nativeBalance);
        return;
      }

      const bal = await balanceOf(token, address);
      setBalance(bal);
    };

    fetchBalance();
  }, [address, token]);

  // --------------------------------
  // Smart MAX
  // --------------------------------
  const handleMax = () => {
    if (!token) return;

    if (token === NATIVE_TOKEN_ADDRESS) {
      // Subtract gas buffer
      const adjusted =
        balance > GAS_BUFFER ? balance - GAS_BUFFER : 0n;

      setFromAmount(formatUnits(adjusted, 18));
    } else {
      setFromAmount(formatUnits(balance, 18));
    }
  };

  // --------------------------------
  // Auto switch
  // --------------------------------
  const handleSelect = (selected: `0x${string}`) => {
    if (type === "from") {
      if (selected === toToken) {
        setToToken(fromToken!);
      }
      setFromToken(selected);
    } else {
      if (selected === fromToken) {
        setFromToken(toToken!);
      }
      setToToken(selected);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{type === "from" ? "From" : "To"}</span>
        {type === "from" && (
          <span>
            Balance: {Number(formatUnits(balance, 18)).toFixed(4)}
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <Input
          value={amount}
          readOnly={readOnly}
          onChange={(e) =>
            type === "from" && setFromAmount(e.target.value)
          }
          placeholder="0.0"
        />

        <Button onClick={() => setOpen(true)}>
          {token
            ? token.slice(0, 6) + "..."
            : "Select"}
        </Button>

        {type === "from" && (
          <Button
            variant="secondary"
            onClick={handleMax}
          >
            MAX
          </Button>
        )}
      </div>

      <TokenListModal
        open={open}
        onClose={() => setOpen(false)}
        onSelect={handleSelect}
      />
    </div>
  );
}
