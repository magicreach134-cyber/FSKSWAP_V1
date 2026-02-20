"use client";

import clsx from "clsx";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "rounded-2xl bg-white dark:bg-gray-900 shadow-lg border border-gray-100 dark:border-gray-800 p-6",
        className
      )}
    >
      {children}
    </div>
  );
}
