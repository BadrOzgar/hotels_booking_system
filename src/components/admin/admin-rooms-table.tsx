"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { roomStatusTokens, formatStatusLabel } from "@/lib/meridian-data";
import { formatCurrency } from "@/lib/pricing";
import { coverStyle } from "@/lib/media";
import { RoomDeleteButton } from "@/components/admin/room-delete-button";
import { CrudDrawer } from "@/components/admin/crud-drawer";
import { RoomTypeForm } from "@/components/admin/room-type-form";
import {
  createRoomTypeAction,
  updateRoomTypeAction,
  getRoomUnitForEditAction,
  deleteRoomImageAction,
} from "@/app/admin/rooms/actions";

const filters = ["All rooms", "AVAILABLE", "OCCUPIED", "MAINTENANCE", "HIDDEN"] as const;
const filterLabels: Record<(typeof filters)[number], string> = {
  "All rooms": "All rooms",
  AVAILABLE: "Available",
  OCCUPIED: "Occupied",
  MAINTENANCE: "Maintenance",
  HIDDEN: "Hidden",
};
const ROWS_PER_PAGE = 6;

export type AdminRoomRow = {
  unitId: string;
  name: string;
  number: string;
  price: number;
  cap: number;
  status: keyof typeof roomStatusTokens;
  gradient: string;
  coverImageUrl: string | null;
};

type Amenity = { id: string; label: string; icon: string | null };

type EditData = Awaited<ReturnType<typeof getRoomUnitForEditAction>>;

export function AdminRoomsTable({ rows, amenities }: { rows: AdminRoomRow[]; amenities: Amenity[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<(typeof filters)[number]>("All rooms");
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [editUnitId, setEditUnitId] = useState<string | null>(null);
  const [editData, setEditData] = useState<EditData | null>(null);

  const filtered = useMemo(() => {
    if (filter === "All rooms") return rows;
    return rows.filter((r) => r.status === filter);
  }, [rows, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);

  function selectFilter(f: (typeof filters)[number]) {
    setFilter(f);
    setPage(1);
  }

  async function openEdit(unitId: string) {
    setEditUnitId(unitId);
    setEditData(await getRoomUnitForEditAction(unitId));
  }

  function closeEdit() {
    setEditUnitId(null);
    setEditData(null);
  }

  function refreshAndClose(close: () => void) {
    close();
    router.refresh();
  }

  return (
    <div>
      <div className="mt-[22px] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
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
              {filterLabels[f]}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="btnp flex w-fit items-center gap-2 rounded-[13px] px-5 py-3 text-[14.5px] font-semibold text-white"
          style={{ background: "#7C8CF8", boxShadow: "0 4px 14px rgba(124,140,248,.28)" }}
        >
          <Plus className="size-[18px]" />
          Add room
        </button>
      </div>

      <div
        className="mt-5 overflow-hidden rounded-[20px] border border-[#E7E8EC] bg-white"
        style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
      >
        <div className="hidden grid-cols-[1.6fr_1fr_.8fr_.9fr_1fr_90px] gap-4 bg-[#FBFBFC] px-6 py-4 text-xs font-bold tracking-[.04em] text-[#9CA3AF] uppercase lg:grid">
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
              key={r.unitId}
              className="rowh grid grid-cols-2 items-center gap-4 border-b border-[#F5F6F8] px-6 py-3.5 last:border-b-0 lg:grid-cols-[1.6fr_1fr_.8fr_.9fr_1fr_90px]"
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-11 w-14 shrink-0 rounded-[11px] bg-cover bg-center"
                  style={coverStyle(r.coverImageUrl, r.gradient)}
                />
                <div className="text-[14.5px] font-semibold">{r.name}</div>
              </div>
              <span className="text-sm font-semibold text-[#374151]">#{r.number}</span>
              <span className="text-sm font-semibold text-[#374151]">{formatCurrency(r.price)}</span>
              <span className="text-sm text-[#6B7280]">{r.cap} guests</span>
              <span
                className="flex w-fit items-center gap-1.5 rounded-full border px-[11px] py-1.5 text-xs font-bold"
                style={{ color: st.c, background: st.bg, borderColor: st.bd }}
              >
                <span className="size-1.5 rounded-full" style={{ background: st.c }} />
                {formatStatusLabel(r.status)}
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => openEdit(r.unitId)}
                  aria-label="Edit room"
                  className="ghost flex size-8 cursor-pointer items-center justify-center rounded-lg border border-[#E7E8EC]"
                >
                  <Pencil className="size-[15px] text-[#6B7280]" />
                </button>
                <RoomDeleteButton unitId={r.unitId} />
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

      <CrudDrawer open={addOpen} onOpenChange={setAddOpen} title="Add a new room" description="Publish a new room type for your hotel.">
        <RoomTypeForm
          action={createRoomTypeAction}
          amenities={amenities}
          submitLabel="Publish room"
          onSuccess={() => refreshAndClose(() => setAddOpen(false))}
          onCancel={() => setAddOpen(false)}
        />
      </CrudDrawer>

      <CrudDrawer
        open={editUnitId !== null}
        onOpenChange={(open) => !open && closeEdit()}
        title={editData ? `Edit ${editData.roomType.name}` : "Edit room"}
        description={editData ? `Room #${editData.unitNumber}` : undefined}
      >
        {editUnitId && editData ? (
          <RoomTypeForm
            action={updateRoomTypeAction.bind(null, editUnitId)}
            amenities={amenities}
            submitLabel="Save changes"
            onSuccess={() => refreshAndClose(closeEdit)}
            onCancel={closeEdit}
            initial={{
              name: editData.roomType.name,
              category: editData.roomType.category,
              description: editData.roomType.description,
              basePricePerNight: Number(editData.roomType.basePricePerNight),
              capacity: editData.roomType.capacity,
              sizeSqm: editData.roomType.sizeSqm,
              bathrooms: editData.roomType.bathrooms,
              unitNumber: editData.unitNumber,
              status: editData.status,
              amenityIds: editData.amenityIds,
              images: editData.images,
            }}
            onDeleteImage={(imageId) => deleteRoomImageAction(imageId, editData.roomType.id)}
          />
        ) : (
          <div className="py-10 text-center text-[13.5px] font-medium text-[#9CA3AF]">Loading…</div>
        )}
      </CrudDrawer>
    </div>
  );
}
