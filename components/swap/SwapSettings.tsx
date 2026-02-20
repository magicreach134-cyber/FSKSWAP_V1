"use client";

import { Modal } from "@/components/ui";
import SlippageControl from "./SlippageControl";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SwapSettings({
  open,
  onClose,
}: Props) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-6 space-y-4 w-full max-w-sm">
        <h3 className="text-lg font-semibold">
          Transaction Settings
        </h3>

        <SlippageControl />
      </div>
    </Modal>
  );
}
