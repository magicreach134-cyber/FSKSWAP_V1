"use client";

import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";

export function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white">
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
