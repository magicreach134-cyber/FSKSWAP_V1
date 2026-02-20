import React from "react";
import clsx from "clsx";
import { Spinner } from "./Spinner";

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  size?: "sm" | "md" | "lg";
}

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  className,
  loading = false,
  size = "md",
  disabled,
  ...props
}) => {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        "inline-flex items-center justify-center rounded-xl transition-colors",
        "bg-muted hover:bg-muted/70 disabled:opacity-50",
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : children}
    </button>
  );
};
