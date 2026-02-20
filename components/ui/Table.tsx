import React from "react";

interface TableProps {
  headers: string[];
  rows: React.ReactNode[][];
}

export function Table({ headers, rows }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            {headers.map((header, i) => (
              <th key={i} className="pb-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-gray-200 dark:border-gray-800">
              {row.map((cell, j) => (
                <td key={j} className="py-3">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
