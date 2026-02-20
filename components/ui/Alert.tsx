import React from "react";
import clsx from "clsx";

interface AlertProps {
  type?: "info" | "success" | "warning" | "error";
  children: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({
  type = "info",
  children,
}) => {
  const styles = {
    info: "bg-blue-500/10 text-blue-400",
    success: "bg-green-500/10 text-green-400",
    warning: "bg-yellow-500/10 text-yellow-400",
    error: "bg-red-500/10 text-red-400",
  };

  return (
    <div
      className={clsx(
        "rounded-xl px-4 py-3 text-sm border border-border",
        styles[type]
      )}
    >
      {children}
    </div>
  );
};
