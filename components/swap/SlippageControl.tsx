"use client";

import { Input, Button } from "@/components/ui";
import { useSwapStore } from "@/store/swapStore";

const presets = [0.1, 0.5, 1];

export default function SlippageControl() {
  const { slippage, setSlippage } = useSwapStore();

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">
        Slippage Tolerance
      </div>

      <div className="flex gap-2">
        {presets.map((p) => (
          <Button
            key={p}
            size="sm"
            variant={
              slippage === p ? "default" : "secondary"
            }
            onClick={() => setSlippage(p)}
          >
            {p}%
          </Button>
        ))}

        <Input
          type="number"
          value={slippage}
          onChange={(e) =>
            setSlippage(Number(e.target.value))
          }
          className="w-20"
        />
      </div>
    </div>
  );
}
