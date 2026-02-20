"use client";

import { Button } from "@/components/ui";
import { ExternalLink } from "lucide-react";

const EXPLORER_BASE = "https://testnet.bscscan.com/tx/";

interface Props {
  hash?: `0x${string}`;
  onClose: () => void;
}

export default function TransactionSuccess({ hash, onClose }: Props) {
  return (
    <div className="flex flex-col items-center space-y-5 py-6">
      <div className="text-green-500 font-semibold">
        Transaction Successful
      </div>

      {hash && (
        <a
          href={`${EXPLORER_BASE}${hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm underline"
        >
          View on BscScan
          <ExternalLink size={14} />
        </a>
      )}

      <Button fullWidth onClick={onClose}>
        Close
      </Button>
    </div>
  );
}
