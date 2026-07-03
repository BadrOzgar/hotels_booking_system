import { weekdays, buildCalendar } from "@/lib/meridian-data";

export function AvailabilityCalendar() {
  const calendar = buildCalendar();

  return (
    <div
      className="mt-5 rounded-[20px] border border-[#E7E8EC] bg-white p-6"
      style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
    >
      <div className="flex items-center justify-between">
        <span className="text-base font-bold">June 2026</span>
      </div>
      <div className="mt-[18px] grid grid-cols-7 gap-1.5">
        {weekdays.map((d) => (
          <div key={d} className="pb-1.5 text-center text-xs font-bold text-[#9CA3AF]">
            {d}
          </div>
        ))}
        {calendar.map((c, i) => (
          <div
            key={i}
            className="flex aspect-square items-center justify-center rounded-[10px] text-[13.5px] font-semibold"
            style={{ color: c.color, background: c.bg, border: c.border }}
          >
            {c.day}
          </div>
        ))}
      </div>
      <div className="mt-[18px] flex gap-5 border-t border-[#F0F1F4] pt-4 text-[12.5px] font-medium text-[#6B7280]">
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-[4px] bg-[#EEF1FF]" style={{ border: "1px solid #C9D1FB" }} />
          Selected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-[4px] bg-white" style={{ border: "1px solid #E7E8EC" }} />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-[4px] bg-[#F4F5F7]" />
          Unavailable
        </span>
      </div>
    </div>
  );
}
