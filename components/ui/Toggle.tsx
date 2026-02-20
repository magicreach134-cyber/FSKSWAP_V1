"use client";

interface ToggleProps {
  enabled: boolean;
  onChange: (value: boolean) => void;
}

export function Toggle({ enabled, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`w-12 h-6 rounded-full transition ${
        enabled ? "bg-blue-600" : "bg-gray-300"
      }`}
    >
      <div
        className={`h-6 w-6 rounded-full bg-white transition-transform ${
          enabled ? "translate-x-6" : ""
        }`}
      />
    </button>
  );
}
