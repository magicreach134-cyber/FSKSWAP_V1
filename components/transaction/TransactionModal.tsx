"use client";

import { Modal, Spinner, Button } from "@/components/ui";
import { useTransactionStore } from "@/store/transactionStore";
import { ExternalLink } from "lucide-react";

const EXPLORER_BASE = "https://testnet.bscscan.com/tx/";

export default function TransactionModal() {
  const {
    isOpen,
    status,
    hash,
    error,
    title,
    description,
    close,
    reset,
  } = useTransactionStore();

  const handleClose = () => {
    reset();
    close();
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <div className="p-6 space-y-6 w-full max-w-md">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">{title || "Transaction"}</h2>
          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        {status === "prompting" && (
          <div className="flex flex-col items-center space-y-3">
            <Spinner />
            <p className="text-sm text-muted-foreground">
              Confirm in your wallet...
            </p>
          </div>
        )}

        {status === "pending" && (
          <div className="flex flex-col items-center space-y-3">
            <Spinner />
            <p className="text-sm text-muted-foreground">
              Transaction submitted. Waiting for confirmation...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center space-y-4">
            <div className="text-green-500 font-medium">
              Transaction Successful
            </div>

            {hash && (
              <a
                href={`${EXPLORER_BASE}${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm underline"
              >
                View on BscScan
                <ExternalLink size={14} />
              </a>
            )}

            <Button onClick={handleClose} fullWidth>
              Close
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center space-y-4">
            <div className="text-red-500 font-medium">
              Transaction Failed
            </div>

            {error && (
              <p className="text-sm text-center text-muted-foreground">
                {error}
              </p>
            )}

            <Button onClick={handleClose} fullWidth>
              Close
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
