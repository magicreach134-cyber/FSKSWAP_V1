"use client";

import { useState, useEffect } from "react";
import { Modal, Button, Input } from "@/components/ui";
import { useSwapStore } from "@/store/swapStore";
import SlippageControl from "./SlippageControl";

export default function SwapSettings() {
  const [open, setOpen] = useState(false);

  const {
    deadlineMinutes,
    setDeadline,
    slippage,
  } = useSwapStore();

  // Persist settings
  useEffect(() => {
    localStorage.setItem(
      "swap_settings",
      JSON.stringify({
        slippage,
        deadlineMinutes,
      })
    );
  }, [slippage, deadlineMinutes]);

  useEffect(() => {
    const stored = localStorage.getItem("swap_settings");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.slippage) {
        useSwapStore
          .getState()
          .setSlippage(parsed.slippage);
      }
      if (parsed.deadlineMinutes) {
        useSwapStore
          .getState()
          .setDeadline(parsed.deadlineMinutes);
      }
    }
  }, []);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
      >
        ⚙
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="p-6 space-y-6 w-full max-w-md">
          <h2 className="text-lg font-semibold">
            Transaction Settings
          </h2>

          <SlippageControl />

          <div className="space-y-2">
            <div className="text-sm font-medium">
              Transaction Deadline (minutes)
            </div>

            <Input
              type="number"
              value={deadlineMinutes}
              onChange={(e) =>
                setDeadline(Number(e.target.value))
              }
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
