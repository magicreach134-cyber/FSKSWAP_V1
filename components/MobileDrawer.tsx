"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Modal } from "@/components/ui";
import clsx from "clsx";

interface Props {
  open: boolean;
  onClose: () => void;
}

const items = [
  "/swap",
  "/liquidity",
  "/farm",
  "/launchpad",
  "/vesting",
  "/treasury",
  "/flashswap",
];

export function MobileDrawer({ open, onClose }: Props) {
  const pathname = usePathname();

  return (
    <Modal open={open} onClose={onClose}>
      <nav className="flex flex-col gap-4">
        {items.map((path) => (
          <Link
            key={path}
            href={path}
            onClick={onClose}
            className={clsx(
              pathname === path && "text-blue-600 font-medium"
            )}
          >
            {path.replace("/", "").toUpperCase()}
          </Link>
        ))}
      </nav>
    </Modal>
  );
}
