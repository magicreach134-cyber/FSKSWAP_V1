"use client";

import { useEffect, useState } from "react";
import { formatUnits } from "viem";
import { useSwapStore } from "@/store/swapStore";
import { useWalletStore } from "@/store/walletStore";
import { balanceOf, decimals as getDecimals } from "@/services/erc20Service";
import { publicClient } from "@/lib/publicClient";
import { NATIVE_TOKEN_ADDRESS } from "@/config/native";

interface Props {
  type: "from" | "to";
  readOnly?: boolean;
}

export default function TokenSelector({ type, readOnly }: Props) {
  const {
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    setFromAmount,
    setToAmount,
  } = useSwapStore();

  const { address } = useWalletStore();

  const token = type === "from" ? fromToken : toToken;
  const amount = type === "from" ? fromAmount : toAmount;

  const [balance, setBalance] = useState<bigint>(0n);
  const [tokenDecimals, setTokenDecimals] = useState(18);

  // --------------------------------
  // Fetch balance
  // --------------------------------
  useEffect(() => {
    const fetchBalance = async () => {
      if (!address || !token) return;

      if (token === NATIVE_TOKEN_ADDRESS) {
        const nativeBalance = await publicClient.getBalance({ address });
        setBalance(nativeBalance);
        setTokenDecimals(18);
      } else {
        const [bal, dec] = await Promise.all([
          balanceOf(token, address),
          getDecimals(token),
        ]);
        setBalance(bal);
        setTokenDecimals(dec);
      }
    };

    fetchBalance();
  }, [address, token]);

  const formattedBalance = formatUnits(balance, tokenDecimals);

  // --------------------------------
  // Max handler
  // --------------------------------
  const handleMax = () => {
    if (!formattedBalance) return;

    if (type === "from") {
      setFromAmount(formattedBalance);
    } else {
      setToAmount(formattedBalance);
    }
  };

  return (
    <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-900 space-y-3">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{type === "from" ? "From" : "To"}</span>
        {token && (
          <span>
            Balance: {formattedBalance}
          </span>
        )}
      </div>

      <div className="flex justify-between items-center gap-2">
        <input
          type="text"
          inputMode="decimal"
          placeholder="0.0"
          value={amount}
          readOnly={readOnly}
          onChange={(e) =>
            type === "from"
              ? setFromAmount(e.target.value)
              : setToAmount(e.target.value)
          }
          className="bg-transparent text-xl font-medium outline-none w-full"
        />

        {!readOnly && (
          <button
            onClick={handleMax}
            className="text-xs px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Max
          </button>
        )}
      </div>
    </div>
  );
}
