"use client";

import { useEffect, useState } from "react";
import { Button, Card, Spinner } from "@/components/ui";
import { useSwap } from "@/hooks/useSwap";
import { useSwapStore } from "@/store/swapStore";
import { useWalletStore } from "@/store/walletStore";
import { balanceOf, decimals as getDecimals } from "@/services/erc20Service";
import { publicClient } from "@/lib/publicClient";
import { parseUnits, formatUnits } from "viem";
import { ArrowUpDown } from "lucide-react";

import TokenSelector from "./TokenSelector";
import PriceImpact from "./PriceImpact";
import RoutePreview from "./RoutePreview";
import MinimumReceived from "./MinimumReceived";
import LiquidityProviderFee from "./LiquidityProviderFee";
import SwapSettings from "./SwapSettings";

import { NATIVE_TOKEN_ADDRESS } from "@/config/native";

export default function SwapWidget() {
  const { fetchQuote, executeSwap, needsApproval, approveToken } = useSwap();

  const {
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    priceImpact,
    hasLiquidity,
    isQuoting,
    slippage,
    swapTokens,
  } = useSwapStore();

  const { connected, address } = useWalletStore();

  const [balance, setBalance] = useState<bigint>(0n);
  const [tokenDecimals, setTokenDecimals] = useState(18);
  const [requiresApproval, setRequiresApproval] = useState(false);

  // --------------------------------
  // Fetch balance + decimals
  // --------------------------------
  useEffect(() => {
    const fetchBalance = async () => {
      if (!address || !fromToken) return;

      if (fromToken === NATIVE_TOKEN_ADDRESS) {
        const nativeBalance = await publicClient.getBalance({ address });
        setBalance(nativeBalance);
        setTokenDecimals(18);
      } else {
        const [bal, dec] = await Promise.all([
          balanceOf(fromToken, address),
          getDecimals(fromToken),
        ]);
        setBalance(bal);
        setTokenDecimals(dec);
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
  // Check approval requirement
  // --------------------------------
  useEffect(() => {
    const checkApproval = async () => {
      if (!fromAmount || !fromToken || !connected) {
        setRequiresApproval(false);
        return;
      }

      const result = await needsApproval();
      setRequiresApproval(result);
    };

    checkApproval();
  }, [fromAmount, fromToken, connected]);

  // --------------------------------
  // Balance validation
  // --------------------------------
  let insufficientBalance = false;

  try {
    if (fromAmount && fromToken) {
      const parsed = parseUnits(fromAmount || "0", tokenDecimals);
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

        <div className="flex justify-center">
          <button
            onClick={swapTokens}
            className="p-2 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <ArrowUpDown size={16} />
          </button>
        </div>

        <TokenSelector type="to" readOnly />
      </div>

      {/* Balance display */}
      {fromToken && (
        <div className="text-xs text-right text-muted-foreground">
          Balance: {formatUnits(balance, tokenDecimals)}
        </div>
      )}

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

      {/* Dynamic Button */}
      <Button
        fullWidth
        disabled={disabled}
        onClick={requiresApproval ? approveToken : executeSwap}
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
          : requiresApproval
          ? "Approve"
          : "Swap"}
      </Button>
    </Card>
  );
}
