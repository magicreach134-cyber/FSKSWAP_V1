"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const items = [
  { href: "/swap", label: "Swap" },
  { href: "/liquidity", label: "Liquidity" },
  { href: "/farm", label: "Farm" },
  { href: "/launchpad", label: "Launchpad" },
  { href: "/vesting", label: "Vesting" },
  { href: "/treasury", label: "Treasury" },
  { href: "/flashswap", label: "Flashswap" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block w-64 border-r border-gray-200 dark:border-gray-800 p-6">
      <nav className="flex flex-col gap-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "px-3 py-2 rounded-lg text-sm transition-colors",
              pathname === item.href
                ? "bg-blue-100 dark:bg-blue-900 text-blue-600"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
