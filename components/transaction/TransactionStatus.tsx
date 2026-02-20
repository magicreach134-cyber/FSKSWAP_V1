"use client";

import { Spinner } from "@/components/ui";

interface Props {
  status: "prompting" | "pending";
}

export default function TransactionStatus({ status }: Props) {
  const message =
    status === "prompting"
      ? "Confirm the transaction in your wallet..."
      : "Transaction submitted. Waiting for confirmation...";

  return (
    <div className="flex flex-col items-center space-y-4 py-6">
      <Spinner />
      <p className="text-sm text-muted-foreground text-center">
        {message}
      </p>
    </div>
  );
}
