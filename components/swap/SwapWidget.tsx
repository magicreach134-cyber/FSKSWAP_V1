"use client";

import { useEffect, useState } from "react";
import { Button, Card, Spinner } from "@/components/ui";
import { useSwap } from "@/hooks/useSwap";
import { useSwapStore } from "@/store/swapStore";
import { useWalletStore } from "@/store/walletStore";
import { balanceOf } from "@/services/erc20Service";
import { publicClient } from "@/lib/publicClient";
import { parseUnits, formatUnits } from "viem";

import TokenSelector from "./TokenSelector";
import PriceImpact from "./PriceImpact";
import RoutePreview from "./RoutePreview";
import MinimumReceived from "./MinimumReceived";
import LiquidityProviderFee from "./LiquidityProviderFee";
import SwapSettings from "./SwapSettings";

import { NATIVE_TOKEN_ADDRESS } from "@/config/native";

export default function SwapWidget() {
  const { fetchQuote, executeSwap } = useSwap();

  const {
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    priceImpact,
    hasLiquidity,
    isQuoting,
    slippage,
  } = useSwapStore();

  const { connected, address } = useWalletStore();

  const [balance, setBalance] = useState<bigint>(0n);

  // --------------------------------
  // Fetch balance
  // --------------------------------
  useEffect(() => {
    const fetchBalance = async () => {
      if (!address || !fromToken) return;

      if (fromToken === NATIVE_TOKEN_ADDRESS) {
        const nativeBalance = await publicClient.getBalance({
          address,
        });
        setBalance(nativeBalance);
      } else {
        const bal = await balanceOf(fromToken, address);
        setBalance(bal);
      }
    };

    fetchBalance();
  }, [address, fromToken]);

  // --------------------------------
  // Auto quote
  // --------------------------------
  useEffect(() => {
    if (fromAmount && fromToken && toToken) {
      fetchQuote();
    }
  }, [fromAmount, fromToken, toToken]);

  // --------------------------------
  // Balance validation
  // --------------------------------
  let insufficientBalance = false;

  try {
    if (fromAmount && fromToken) {
      const parsed = parseUnits(fromAmount || "0", 18);
      insufficientBalance = parsed > balance;
    }
  } catch {
    insufficientBalance = true;
  }

  const highImpact = priceImpact > 5;
  const highSlippage = slippage > 3;

  const disabled =
    !connected ||
    !fromAmount ||
    !fromToken ||
    !toToken ||
    !hasLiquidity ||
    isQuoting ||
    highImpact ||
    insufficientBalance;

  return (
    <Card className="p-6 space-y-6 w-full max-w-md mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Swap</h2>
        <SwapSettings />
      </div>

      {/* Token selectors */}
      <div className="space-y-4">
        <TokenSelector type="from" />

        <div className="text-center text-muted-foreground text-sm">
          ↓
        </div>

        <TokenSelector type="to" readOnly />
      </div>

      {isQuoting && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}

      {/* Warnings */}
      {insufficientBalance && (
        <div className="text-red-500 text-sm text-center">
          Insufficient balance
        </div>
      )}

      {highSlippage && (
        <div className="text-yellow-500 text-sm text-center">
          High slippage tolerance
        </div>
      )}

      {highImpact && (
        <div className="text-red-500 text-sm text-center">
          Price impact too high
        </div>
      )}

      {/* Swap details */}
      {hasLiquidity && toAmount && (
        <div className="space-y-2 text-sm">
          <MinimumReceived />
          <LiquidityProviderFee />
          <PriceImpact value={priceImpact} />
          <RoutePreview />
        </div>
      )}

      {!hasLiquidity && (
        <div className="text-red-500 text-sm text-center">
          Insufficient liquidity
        </div>
      )}

      <Button
        fullWidth
        disabled={disabled}
        onClick={executeSwap}
      >
        {!connected
          ? "Connect Wallet"
          : insufficientBalance
          ? "Insufficient Balance"
          : !hasLiquidity
          ? "No Liquidity"
          : isQuoting
          ? "Fetching..."
          : highImpact
          ? "Impact Too High"
          : "Swap"}
      </Button>
    </Card>
  );
}
