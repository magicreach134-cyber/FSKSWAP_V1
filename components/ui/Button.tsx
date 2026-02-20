"use client";

import { Spinner } from "./Spinner";
import clsx from "clsx";
import React from "react";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline" | "danger";
  fullWidth?: boolean;
}

export function Button({
  children,
  loading,
  variant = "primary",
  fullWidth,
  className,
  ...props
}: ButtonProps) {
  const base =
    "relative inline-flex items-center justify-center rounded-xl px-4 py-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90",
    secondary:
      "bg-gray-200 dark:bg-gray-800 text-black dark:text-white",
    outline:
      "border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300",
    danger:
      "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={clsx(
        base,
        variants[variant],
        fullWidth && "w-full",
        className
      )}
    >
      {loading && (
        <span className="absolute left-3">
          <Spinner />
        </span>
      )}
      <span className={loading ? "opacity-0" : ""}>
        {children}
      </span>
    </button>
  );
}
