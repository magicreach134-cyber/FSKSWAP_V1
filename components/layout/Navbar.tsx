"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletButton } from "./WalletButton";
import { ThemeToggle } from "./ThemeToggle";
import { MobileDrawer } from "./MobileDrawer";
import Image from "next/image";
import { useState } from "react";
import clsx from "clsx";

const navItems = [
  { href: "/swap", label: "Swap" },
  { href: "/liquidity", label: "Liquidity" },
  { href: "/farm", label: "Farm" },
  { href: "/launchpad", label: "Launchpad" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/80 dark:bg-black/80 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="FskSwap"
            width={36}
            height={36}
            priority
          />
          <span className="font-bold text-lg">
            FskSwap
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "transition-colors",
                pathname === item.href
                  ? "text-blue-600 font-medium"
                  : "text-gray-600 dark:text-gray-400 hover:text-blue-600"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <WalletButton />

          <button
            onClick={() => setOpen(true)}
            className="md:hidden text-xl"
          >
            ☰
          </button>
        </div>
      </div>

      <MobileDrawer open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
