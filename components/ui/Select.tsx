import React from "react";
import clsx from "clsx";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
}

export const Select: React.FC<SelectProps> = ({
  options,
  className,
  ...props
}) => {
  return (
    <select
      className={clsx(
        "w-full rounded-xl border border-border bg-input px-4 py-2 text-sm",
        "focus:outline-none focus:ring-2 focus:ring-primary",
        className
      )}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};
