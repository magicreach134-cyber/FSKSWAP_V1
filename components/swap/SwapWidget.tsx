"use client";

import { useEffect } from "react";
import { Button, Card, Spinner } from "@/components/ui";
import { useSwap } from "@/hooks/useSwap";
import { useSwapStore } from "@/store/swapStore";
import { useWalletStore } from "@/store/walletStore";

import TokenSelector from "./TokenSelector";
import PriceImpact from "./PriceImpact";
import RoutePreview from "./RoutePreview";
import MinimumReceived from "./MinimumReceived";
import LiquidityProviderFee from "./LiquidityProviderFee";
import SwapSettings from "./SwapSettings";

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

  const { connected } = useWalletStore();

  // --------------------------------
  // Auto quote on change
  // --------------------------------
  useEffect(() => {
    if (fromAmount && fromToken && toToken) {
      fetchQuote();
    }
  }, [fromAmount, fromToken, toToken]);

  const highImpact = priceImpact > 5;
  const highSlippage = slippage > 3;

  const disabled =
    !connected ||
    !fromAmount ||
    !fromToken ||
    !toToken ||
    !hasLiquidity ||
    isQuoting ||
    highImpact;

  return (
    <Card className="p-6 space-y-6 w-full max-w-md mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Swap</h2>
        <SwapSettings />
      </div>

      {/* Token Selectors */}
      <div className="space-y-4">
        <TokenSelector type="from" />

        <div className="text-center text-muted-foreground text-sm">
          ↓
        </div>

        <TokenSelector type="to" readOnly />
      </div>

      {/* Quoting spinner */}
      {isQuoting && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}

      {/* Warnings */}
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

      {/* Swap button */}
      <Button
        fullWidth
        disabled={disabled}
        onClick={executeSwap}
      >
        {!connected
          ? "Connect Wallet"
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
