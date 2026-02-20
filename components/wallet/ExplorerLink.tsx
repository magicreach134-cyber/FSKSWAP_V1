"use client";

const EXPLORER_BASE =
  "https://testnet.bscscan.com/address/";

export default function ExplorerLink({
  address,
}: {
  address: string;
}) {
  return (
    <a
      href={`${EXPLORER_BASE}${address}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm underline block text-center"
    >
      View on BscScan
    </a>
  );
}
