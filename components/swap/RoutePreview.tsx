"use client";

import { useSwapStore } from "@/store/swapStore";

export default function RoutePreview() {
  const { route } = useSwapStore();

  if (!route.length) return null;

  return (
    <div className="flex justify-between">
      <span>Route</span>
      <span className="text-xs text-muted-foreground">
        {route.join(" → ")}
      </span>
    </div>
  );
}
