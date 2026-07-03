"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { roomRows as initialRoomRows, roomStatusTokens, type RoomRow } from "@/lib/meridian-data";

const filters = ["All rooms", "Available", "Occupied", "Maintenance", "Hidden"] as const;
const ROWS_PER_PAGE = 2;

export default function AdminRoomsPage() {
  const [rows, setRows] = useState<RoomRow[]>(initialRoomRows);
  const [filter, setFilter] = useState<(typeof filters)[number]>("All rooms");
  const [page, setPage] = useState(1);

  const occupied = rows.filter((r) => r.status === "Occupied").length;
  const available = rows.filter((r) => r.status === "Available").length;

  const filtered = useMemo(() => {
    if (filter === "All rooms") return rows;
    return rows.filter((r) => r.status === filter);
  }, [rows, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  function selectFilter(f: (typeof filters)[number]) {
    setFilter(f);
    setPage(1);
  }

  function deleteRoom(number: string) {
    if (!window.confirm("Remove this room from the list?")) return;
    setRows((prev) => prev.filter((r) => r.number !== number));
  }

  return (
    <div className="fu p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="m-0 text-[28px] font-extrabold tracking-[-.03em]">Rooms</h1>
          <p className="mt-2 text-[14.5px] font-medium text-[#6B7280]">
            {rows.length} rooms &middot; {occupied} occupied &middot; {available} available
          </p>
        </div>
        <Link
          href="/admin/rooms/new"
          className="btnp flex w-fit items-center gap-2 rounded-[13px] px-5 py-3 text-[14.5px] font-semibold text-white"
          style={{ background: "#7C8CF8", boxShadow: "0 4px 14px rgba(124,140,248,.28)" }}
        >
          <Plus className="size-[18px]" />
          Add room
        </Link>
      </div>

      <div className="mt-[22px] flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            type="button"
            key={f}
            onClick={() => selectFilter(f)}
            className="cursor-pointer rounded-[11px] border px-[15px] py-2 text-[13px] font-semibold"
            style={
              filter === f
                ? { background: "#fff", borderColor: "#7C8CF8", color: "#4A5AE0" }
                : { background: "#fff", borderColor: "#E7E8EC", color: "#6B7280" }
            }
          >
            {f}
          </button>
        ))}
      </div>

      <div
        className="mt-5 overflow-hidden rounded-[20px] border border-[#E7E8EC] bg-white"
        style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
      >
        <div className="hidden grid-cols-[80px_1.4fr_1fr_.8fr_.9fr_1fr_90px] gap-4 bg-[#FBFBFC] px-6 py-4 text-xs font-bold tracking-[.04em] text-[#9CA3AF] uppercase lg:grid">
          <span>Image</span>
          <span>Room</span>
          <span>Number</span>
          <span>Price</span>
          <span>Capacity</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        {paged.length === 0 && (
          <div className="px-6 py-14 text-center text-[14px] font-medium text-[#9CA3AF]">
            No rooms match this filter.
          </div>
        )}
        {paged.map((r) => {
          const st = roomStatusTokens[r.status];
          return (
            <div
              key={r.number}
              className="rowh grid grid-cols-2 items-center gap-4 border-b border-[#F5F6F8] px-6 py-3.5 last:border-b-0 lg:grid-cols-[80px_1.4fr_1fr_.8fr_.9fr_1fr_90px]"
            >
              <div className="h-11 w-14 rounded-[11px]" style={{ background: r.gradient }} />
              <div>
                <div className="text-[14.5px] font-semibold">{r.name}</div>
                <div className="mt-0.5 text-[12.5px] font-medium text-[#9CA3AF]">{r.type}</div>
              </div>
              <span className="text-sm font-semibold text-[#374151]">#{r.number}</span>
              <span className="text-sm font-semibold text-[#374151]">${r.price}</span>
              <span className="text-sm text-[#6B7280]">{r.cap} guests</span>
              <span
                className="flex w-fit items-center gap-1.5 rounded-full border px-[11px] py-1.5 text-xs font-bold"
                style={{ color: st.c, background: st.bg, borderColor: st.bd }}
              >
                <span className="size-1.5 rounded-full" style={{ background: st.c }} />
                {r.status}
              </span>
              <div className="flex gap-1.5">
                <Link
                  href={`/admin/rooms/${r.number}/edit`}
                  aria-label="Edit room"
                  className="ghost flex size-8 items-center justify-center rounded-lg border border-[#E7E8EC]"
                >
                  <Pencil className="size-[15px] text-[#6B7280]" />
                </Link>
                <button
                  type="button"
                  onClick={() => deleteRoom(r.number)}
                  aria-label="Delete room"
                  className="ghost flex size-8 cursor-pointer items-center justify-center rounded-lg border border-[#E7E8EC]"
                >
                  <Trash2 className="size-[15px] text-[#D96A6A]" />
                </button>
              </div>
            </div>
          );
        })}
        <div className="flex items-center justify-between px-6 py-4">
          <span className="text-[13px] font-medium text-[#9CA3AF]">
            Showing {paged.length} of {filtered.length} rooms
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex size-8 cursor-pointer items-center justify-center rounded-lg border border-[#E7E8EC] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="size-[15px] text-[#6B7280]" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => setPage(p)}
                className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-[13px] font-bold"
                style={
                  p === currentPage
                    ? { background: "#7C8CF8", color: "#fff" }
                    : { border: "1px solid #E7E8EC", color: "#6B7280" }
                }
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex size-8 cursor-pointer items-center justify-center rounded-lg border border-[#E7E8EC] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="size-[15px] text-[#6B7280]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
