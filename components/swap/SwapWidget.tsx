"use client";

import { useState } from "react";
import { Card, Button, IconButton } from "@/components/ui";
import { ArrowDownUp, Settings } from "lucide-react";

import TokenSelector from "./TokenSelector";
import TokenListModal from "./TokenListModal";
import SwapSettings from "./SwapSettings";
import PriceImpact from "./PriceImpact";
import RoutePreview from "./RoutePreview";
import MinimumReceived from "./MinimumReceived";
import LiquidityProviderFee from "./LiquidityProviderFee";

export interface Token {
  address: string;
  symbol: string;
  decimals: number;
  logo: string;
}

export default function SwapWidget() {
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tokenModalFor, setTokenModalFor] =
    useState<"from" | "to" | null>(null);

  const switchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
  };

  return (
    <>
      <Card className="w-full max-w-md rounded-3xl shadow-2xl bg-[#111827] border border-gray-800 text-white p-6 space-y-4">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Swap</h2>
          <IconButton onClick={() => setSettingsOpen(true)}>
            <Settings size={18} />
          </IconButton>
        </div>

        {/* From */}
        <TokenSelector
          label="From"
          token={fromToken}
          amount={fromAmount}
          onAmountChange={setFromAmount}
          onSelectToken={() => setTokenModalFor("from")}
        />

        {/* Switch */}
        <div className="flex justify-center -my-2">
          <IconButton
            className="bg-gray-800 hover:bg-gray-700 border border-gray-700"
            onClick={switchTokens}
          >
            <ArrowDownUp size={16} />
          </IconButton>
        </div>

        {/* To */}
        <TokenSelector
          label="To"
          token={toToken}
          amount=""
          onAmountChange={() => {}}
          onSelectToken={() => setTokenModalFor("to")}
          readOnly
        />

        {/* Details */}
        <div className="pt-3 space-y-2 text-sm text-gray-400">
          <PriceImpact />
          <MinimumReceived />
          <LiquidityProviderFee />
          <RoutePreview />
        </div>

        {/* Action */}
        <Button
          fullWidth
          className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600"
        >
          Swap
        </Button>
      </Card>

      <SwapSettings
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      <TokenListModal
        open={!!tokenModalFor}
        onClose={() => setTokenModalFor(null)}
        onSelect={(token) => {
          if (tokenModalFor === "from") setFromToken(token);
          if (tokenModalFor === "to") setToToken(token);
          setTokenModalFor(null);
        }}
      />
    </>
  );
}
