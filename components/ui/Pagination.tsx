import React from "react";
import clsx from "clsx";
import { Button } from "./Button";

interface PaginationProps {
  current: number;
  total: number;
  onChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  current,
  total,
  onChange,
}) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="secondary"
        disabled={current === 1}
        onClick={() => onChange(current - 1)}
      >
        Prev
      </Button>

      <span className="text-sm text-muted-foreground">
        {current} / {total}
      </span>

      <Button
        variant="secondary"
        disabled={current === total}
        onClick={() => onChange(current + 1)}
      >
        Next
      </Button>
    </div>
  );
};
