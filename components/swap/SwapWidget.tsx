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

export default function SwapWidget() {
  const { fetchQuote, executeSwap } = useSwap();

  const {
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    setFromAmount,
    priceImpact,
    hasLiquidity,
    isQuoting,
  } = useSwapStore();

  const { connected } = useWalletStore();

  useEffect(() => {
    if (fromAmount && fromToken && toToken) {
      fetchQuote();
    }
  }, [fromAmount, fromToken, toToken]);

  const disabled =
    !connected ||
    !fromAmount ||
    !fromToken ||
    !toToken ||
    !hasLiquidity ||
    isQuoting;

  return (
    <Card className="p-6 space-y-6 w-full max-w-md mx-auto">
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
          : !hasLiquidity
          ? "No Liquidity"
          : isQuoting
          ? "Fetching..."
          : "Swap"}
      </Button>
    </Card>
  );
}
