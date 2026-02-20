"use client";

import clsx from "clsx";
import React from "react";

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  rightElement?: React.ReactNode;
}

export function Input({
  label,
  rightElement,
  className,
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          {...props}
          className={clsx(
            "w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600",
            rightElement && "pr-12",
            className
          )}
        />

        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
}
