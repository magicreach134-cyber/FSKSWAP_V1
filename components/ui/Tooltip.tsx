"use client";

import { useState } from "react";

export function Tooltip({
  children,
  content,
}: {
  children: React.ReactNode;
  content: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}

      {visible && (
        <div className="absolute bottom-full mb-2 px-3 py-1 text-xs bg-black text-white rounded-lg">
          {content}
        </div>
      )}
    </div>
  );
}
