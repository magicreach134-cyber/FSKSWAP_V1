"use client";

export default function PriceImpact({
  value,
}: {
  value: number;
}) {
  const color =
    value > 5
      ? "text-red-500"
      : value > 2
      ? "text-yellow-500"
      : "text-green-500";

  return (
    <div className="flex justify-between">
      <span>Price Impact</span>
      <span className={color}>
        {value.toFixed(2)}%
      </span>
    </div>
  );
}
