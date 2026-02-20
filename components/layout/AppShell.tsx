"use client";

import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";

import TransactionModal from "@/components/transaction/TransactionModal";
import WalletModal from "@/components/wallet/WalletModal";

export function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white">
      
      {/* Global Modals (must be first for clean stacking) */}
      <WalletModal />
      <TransactionModal />

      <Navbar />

      <div className="flex max-w-7xl mx-auto">
        <Sidebar />

        <main className="flex-1 px-4 py-8">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}
