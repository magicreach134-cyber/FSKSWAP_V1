import React from "react";
import clsx from "clsx";

interface NumberInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const NumberInput: React.FC<NumberInputProps> = ({
  className,
  ...props
}) => {
  return (
    <input
      type="number"
      step="any"
      className={clsx(
        "w-full rounded-xl border border-border bg-input px-4 py-2 text-sm",
        "focus:outline-none focus:ring-2 focus:ring-primary",
        className
      )}
      {...props}
    />
  );
};
