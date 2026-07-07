"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export function ProfileSettingsForm({ name, email }: { name: string; email: string }) {
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-5 rounded-[20px] border border-[#E7E8EC] bg-white p-7"
      style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
    >
      <h2 className="text-base font-bold">Profile</h2>
      <div className="mt-[18px] flex items-center gap-4">
        <div
          className="flex size-16 items-center justify-center rounded-full text-lg font-bold text-white"
          style={{ background: "linear-gradient(135deg,#7C8CF8,#8FD3FE)" }}
        >
          {name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
        </div>
        <button
          type="button"
          className="btns rounded-[11px] border border-[#E7E8EC] bg-white px-4 py-2.5 text-[13.5px] font-semibold text-[#1F2937]"
        >
          Change photo
        </button>
      </div>

      <div className="mt-[22px] grid grid-cols-1 gap-[18px] sm:grid-cols-2">
        <Field label="Full name" defaultValue={name} />
        <Field label="Email" defaultValue={email} type="email" />
      </div>

      <div className="my-[26px] h-px bg-[#F0F1F4]" />
      <h2 className="text-base font-bold">Notifications</h2>
      <div className="mt-[18px] flex flex-col gap-3">
        <NotifyRow label="New bookings" defaultChecked />
        <NotifyRow label="Cancellations" defaultChecked />
        <NotifyRow label="Guest messages" defaultChecked={false} />
      </div>

      <div className="mt-7 flex items-center justify-end gap-3">
        {saved && (
          <span className="flex items-center gap-1.5 text-[13.5px] font-semibold text-[#4FB878]">
            <Check className="size-4" />
            Saved
          </span>
        )}
        <button
          type="submit"
          className="btnp rounded-[13px] px-[22px] py-3 text-[14.5px] font-semibold text-white"
          style={{ background: "#7C8CF8", boxShadow: "0 6px 18px rgba(124,140,248,.3)" }}
        >
          Save changes
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  defaultValue,
  type = "text",
}: {
  label: string;
  defaultValue: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-[13px] font-semibold text-[#374151]">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-xl border border-[#E7E8EC] bg-[#FCFCFD] px-3.5 py-3 text-[15px] outline-none"
      />
    </div>
  );
}

function NotifyRow({ label, defaultChecked }: { label: string; defaultChecked: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <label className="flex cursor-pointer items-center justify-between text-[14.5px] font-medium text-[#374151]">
      {label}
      <span
        onClick={() => setChecked((c) => !c)}
        className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors"
        style={{ background: checked ? "#7C8CF8" : "#E7E8EC" }}
      >
        <span
          className="inline-block size-[18px] rounded-full bg-white transition-transform"
          style={{ transform: checked ? "translateX(22px)" : "translateX(3px)" }}
        />
      </span>
    </label>
  );
}
