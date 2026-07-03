"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { roomStatusTokens, type RoomRow } from "@/lib/meridian-data";

const allAmenities = ["Ocean view", "Balcony", "Free WiFi", "Bathtub", "Nespresso", "Smart TV"];
const statusOptions = Object.keys(roomStatusTokens) as (keyof typeof roomStatusTokens)[];

export function EditRoomForm({ room }: { room: RoomRow }) {
  const router = useRouter();
  const [status, setStatus] = useState<keyof typeof roomStatusTokens>(room.status);
  const [amenities, setAmenities] = useState<string[]>(["Ocean view", "Balcony", "Free WiFi"]);

  function toggleAmenity(a: string) {
    setAmenities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push("/admin/rooms");
  }

  return (
    <div className="fu max-w-[960px] p-8">
      <Link
        href="/admin/rooms"
        className="navlink inline-flex items-center gap-[7px] text-sm font-semibold text-[#6B7280]"
      >
        <ArrowLeft className="size-4" />
        Back to rooms
      </Link>
      <h1 className="mt-[18px] text-[28px] font-extrabold tracking-[-.03em]">
        Edit {room.name}
      </h1>
      <p className="mt-2 text-[14.5px] font-medium text-[#6B7280]">
        Room #{room.number} &middot; update details below.
      </p>

      <form onSubmit={handleSubmit}>
        <div
          className="mt-6 rounded-[20px] border border-[#E7E8EC] bg-white p-7"
          style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
        >
          <h2 className="text-base font-bold">Details</h2>
          <div className="mt-[18px] grid grid-cols-1 gap-[18px] sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-[13px] font-semibold text-[#374151]">Room title</label>
              <input
                defaultValue={room.name}
                className="mt-2 w-full rounded-xl border border-[#E7E8EC] bg-[#FCFCFD] px-3.5 py-3 text-[15px] outline-none"
              />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[#374151]">Price / night</label>
              <div className="relative mt-2">
                <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-[15px] font-semibold text-[#9CA3AF]">
                  $
                </span>
                <input
                  defaultValue={room.price}
                  className="w-full rounded-xl border border-[#E7E8EC] bg-[#FCFCFD] py-3 pr-3.5 pl-7 text-[15px] outline-none"
                />
              </div>
            </div>
            <Field label="Room number" defaultValue={room.number} />
            <Field label="Room type" defaultValue={room.type} />
            <Field label="Capacity" defaultValue={`${room.cap} guests`} />
          </div>

          <div className="mt-[18px]">
            <label className="text-[13px] font-semibold text-[#374151]">Amenities</label>
            <div className="mt-3 flex flex-wrap gap-2">
              {allAmenities.map((a) => {
                const selected = amenities.includes(a);
                return (
                  <button
                    type="button"
                    key={a}
                    onClick={() => toggleAmenity(a)}
                    className="flex cursor-pointer items-center gap-1.5 rounded-[10px] border px-3.5 py-2 text-[13px] font-semibold"
                    style={
                      selected
                        ? { borderColor: "#C9D1FB", background: "#F3F5FF", color: "#4A5AE0" }
                        : { borderColor: "#E7E8EC", background: "#fff", color: "#6B7280" }
                    }
                  >
                    {selected && <Check className="size-3.5" />}
                    {selected ? a : `+ ${a}`}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-[18px]">
            <label className="text-[13px] font-semibold text-[#374151]">Status</label>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {statusOptions.map((s) => {
                const st = roomStatusTokens[s];
                const selected = status === s;
                return (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setStatus(s)}
                    className="flex cursor-pointer items-center gap-[7px] rounded-[11px] border px-4 py-2.5 text-[13px] font-semibold"
                    style={
                      selected
                        ? { borderColor: st.c, background: st.bg, color: st.c }
                        : { borderColor: "#E7E8EC", background: "#fff", color: "#6B7280" }
                    }
                  >
                    <span
                      className="size-[7px] rounded-full"
                      style={{ background: selected ? st.c : "#D8DAE2" }}
                    />
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <Link
            href="/admin/rooms"
            className="btns rounded-[13px] border border-[#E7E8EC] bg-white px-[22px] py-3.5 text-center text-[15px] font-semibold text-[#1F2937]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="btnp flex items-center justify-center gap-2 rounded-[13px] px-[26px] py-3.5 text-[15px] font-semibold text-white"
            style={{ background: "#7C8CF8", boxShadow: "0 6px 18px rgba(124,140,248,.3)" }}
          >
            <Check className="size-[17px]" />
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <div>
      <label className="text-[13px] font-semibold text-[#374151]">{label}</label>
      <input
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-xl border border-[#E7E8EC] bg-[#FCFCFD] px-3.5 py-3 text-[15px] outline-none"
      />
    </div>
  );
}
