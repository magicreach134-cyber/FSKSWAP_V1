"use client";

import { useEffect, useState } from "react";
import { Card, Button, Spinner } from "@/components/ui";
import { useLiquidity } from "@/hooks/useLiquidity";
import { useLiquidityStore } from "@/store/liquidityStore";
import { useWalletStore } from "@/store/walletStore";
import { balanceOf, decimals as getDecimals } from "@/services/erc20Service";
import { publicClient } from "@/lib/publicClient";
import { formatUnits } from "viem";
import { NATIVE_TOKEN_ADDRESS } from "@/config/native";
import TokenSelector from "../swap/TokenSelector";
import LiquiditySettings from "./LiquiditySettings";

export default function AddLiquidityWidget() {
  const { provide } = useLiquidity();

  const {
    tokenA,
    tokenB,
    amountA,
    amountB,
    setAmountA,
    setAmountB,
    slippage,
  } = useLiquidityStore();

  const { connected, address } = useWalletStore();

  const [balanceA, setBalanceA] = useState<bigint>(0n);
  const [balanceB, setBalanceB] = useState<bigint>(0n);
  const [decimalsA, setDecimalsA] = useState(18);
  const [decimalsB, setDecimalsB] = useState(18);
  const [loading, setLoading] = useState(false);

  // --------------------------------
  // Fetch balances
  // --------------------------------
  useEffect(() => {
    async function fetchBalances() {
      if (!address) return;

      if (tokenA) {
        if (tokenA === NATIVE_TOKEN_ADDRESS) {
          const bal = await publicClient.getBalance({ address });
          setBalanceA(bal);
          setDecimalsA(18);
        } else {
          const [bal, dec] = await Promise.all([
            balanceOf(tokenA, address),
            getDecimals(tokenA),
          ]);
          setBalanceA(bal);
          setDecimalsA(dec);
        }
      }

      if (tokenB) {
        if (tokenB === NATIVE_TOKEN_ADDRESS) {
          const bal = await publicClient.getBalance({ address });
          setBalanceB(bal);
          setDecimalsB(18);
        } else {
          const [bal, dec] = await Promise.all([
            balanceOf(tokenB, address),
            getDecimals(tokenB),
          ]);
          setBalanceB(bal);
          setDecimalsB(dec);
        }
      }
    }

    fetchBalances();
  }, [address, tokenA, tokenB]);

  const disabled =
    !connected ||
    !tokenA ||
    !tokenB ||
    !amountA ||
    !amountB ||
    loading;

  async function handleProvide() {
    try {
      setLoading(true);
      await provide();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-6 space-y-6 w-full max-w-md mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Add Liquidity</h2>
        <LiquiditySettings />
      </div>

      {/* Token A */}
      <div className="space-y-2">
        <TokenSelector type="from" />
        {tokenA && (
          <div className="text-xs text-right text-muted-foreground">
            Balance: {formatUnits(balanceA, decimalsA)}
          </div>
        )}
      </div>

      {/* Token B */}
      <div className="space-y-2">
        <TokenSelector type="to" />
        {tokenB && (
          <div className="text-xs text-right text-muted-foreground">
            Balance: {formatUnits(balanceB, decimalsB)}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="text-xs text-muted-foreground">
        Slippage: {slippage}%
      </div>

      {/* Provide Button */}
      <Button
        fullWidth
        disabled={disabled}
        onClick={handleProvide}
      >
        {!connected
          ? "Connect Wallet"
          : loading
          ? "Processing..."
          : "Supply"}
      </Button>
    </Card>
  );
}
