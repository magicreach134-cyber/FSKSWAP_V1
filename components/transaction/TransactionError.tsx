"use client";

import { Button } from "@/components/ui";

interface Props {
  error?: string;
  onClose: () => void;
}

export default function TransactionError({ error, onClose }: Props) {
  return (
    <div className="flex flex-col items-center space-y-5 py-6">
      <div className="text-red-500 font-semibold">
        Transaction Failed
      </div>

      {error && (
        <p className="text-sm text-muted-foreground text-center">
          {error}
        </p>
      )}

      <Button fullWidth onClick={onClose}>
        Close
      </Button>
    </div>
  );
}
