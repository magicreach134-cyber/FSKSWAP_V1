"use client";

import { useState } from "react";
import { Input } from "@/components/ui";

export default function SlippageControl() {
  const [value, setValue] = useState("0.5");

  return (
    <div className="space-y-2">
      <label className="text-sm">Slippage (%)</label>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
