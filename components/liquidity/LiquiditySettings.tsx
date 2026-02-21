"use client";

import { useState } from "react";
import { useLiquidityStore } from "@/store/liquidityStore";
import { Settings } from "lucide-react";

export default function LiquiditySettings() {
  const { slippage, setSlippage } = useLiquidityStore();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        <Settings size={18} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg space-y-4 z-50">
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">
              Slippage Tolerance (%)
            </label>

            <div className="flex gap-2">
              {[0.1, 0.5, 1].map((value) => (
                <button
                  key={value}
                  onClick={() => setSlippage(value)}
                  className={`px-3 py-1 rounded-lg text-xs ${
                    slippage === value
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800"
                  }`}
                >
                  {value}%
                </button>
              ))}
            </div>

            <input
              type="number"
              min="0"
              step="0.1"
              value={slippage}
              onChange={(e) =>
                setSlippage(Number(e.target.value))
              }
              className="w-full mt-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
