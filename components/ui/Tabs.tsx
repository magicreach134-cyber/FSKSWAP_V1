"use client";

import { useState } from "react";
import clsx from "clsx";

interface TabItem {
  label: string;
  content: React.ReactNode;
}

export function Tabs({ tabs }: { tabs: TabItem[] }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="flex border-b border-gray-200 dark:border-gray-800 mb-4">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={clsx(
              "px-4 py-2 text-sm font-medium",
              active === i
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>{tabs[active].content}</div>
    </div>
  );
}
