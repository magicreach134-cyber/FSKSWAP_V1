"use client";

import { Button } from "@/components/ui";

export default function CopyAddressButton({
  address,
}: {
  address: string;
}) {
  const copy = async () => {
    await navigator.clipboard.writeText(address);
  };

  return (
    <Button variant="outline" fullWidth onClick={copy}>
      Copy Address
    </Button>
  );
}
