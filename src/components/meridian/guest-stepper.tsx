"use client";

import { Minus, Plus } from "lucide-react";

export function GuestStepper({
  label,
  hint,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="text-[15px] font-bold text-[#1F2937]">{label}</div>
        <div className="text-[13px] font-medium text-[#9CA3AF]">{hint}</div>
      </div>
      <div className="flex items-center gap-3.5">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Decrease ${label.toLowerCase()}`}
          className="flex size-8 cursor-pointer items-center justify-center rounded-full border border-[#D8DAE2] text-[#6B7280] disabled:cursor-not-allowed disabled:opacity-35"
        >
          <Minus className="size-3.5" />
        </button>
        <span className="w-4 text-center text-[15px] font-semibold">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`Increase ${label.toLowerCase()}`}
          className="flex size-8 cursor-pointer items-center justify-center rounded-full border border-[#D8DAE2] text-[#6B7280] disabled:cursor-not-allowed disabled:opacity-35"
        >
          <Plus className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
