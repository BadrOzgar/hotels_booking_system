"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { bookingStatusTokens, formatStatusLabel } from "@/lib/meridian-data";
import { CrudDrawer } from "@/components/admin/crud-drawer";
import { GuestForm } from "@/components/admin/guest-form";
import { createGuestAction, updateGuestAction, getGuestAction } from "@/app/admin/guests/actions";

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#8FD3FE,#7C8CF8)",
  "linear-gradient(135deg,#F7D9C4,#F6E6CF)",
  "linear-gradient(135deg,#A8E6CF,#CFEAFE)",
  "linear-gradient(135deg,#7C8CF8,#A8E6CF)",
  "linear-gradient(135deg,#CFEAFE,#8FD3FE)",
  "linear-gradient(135deg,#F7D9C4,#7C8CF8)",
];

type GuestRow = {
  id: string;
  name: string;
  initials: string;
  stays: number;
  lastBookingId?: string;
  lastStatus?: string;
};

type EditGuest = Awaited<ReturnType<typeof getGuestAction>>;

export function AdminGuestsTable({ guests }: { guests: GuestRow[] }) {
  const router = useRouter();
  const [addOpen, setAddOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<EditGuest | null>(null);

  async function openEdit(id: string) {
    setEditId(id);
    setEditData(await getGuestAction(id));
  }

  function closeEdit() {
    setEditId(null);
    setEditData(null);
  }

  function refreshAndClose(close: () => void) {
    close();
    router.refresh();
  }

  return (
    <div>
      <div className="mt-[22px] flex justify-end">
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="btnp flex w-fit items-center gap-2 rounded-[13px] px-5 py-3 text-[14.5px] font-semibold text-white"
          style={{ background: "#7C8CF8", boxShadow: "0 4px 14px rgba(124,140,248,.28)" }}
        >
          <Plus className="size-[18px]" />
          Add customer
        </button>
      </div>

      <div
        className="mt-5 overflow-hidden rounded-[20px] border border-[#E7E8EC] bg-white"
        style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
      >
        <div className="hidden grid-cols-[1.6fr_1fr_1fr_1fr_90px] gap-4 bg-[#FBFBFC] px-6 py-4 text-xs font-bold tracking-[.04em] text-[#9CA3AF] uppercase lg:grid">
          <span>Guest</span>
          <span>Stays</span>
          <span>Last status</span>
          <span>Last booking</span>
          <span>Actions</span>
        </div>
        {guests.length === 0 && (
          <div className="px-6 py-14 text-center text-[14px] font-medium text-[#9CA3AF]">
            No guests yet.
          </div>
        )}
        {guests.map((g, i) => {
          const st = bookingStatusTokens[g.lastStatus ?? "PENDING"];
          return (
            <div
              key={g.id}
              className="rowh grid grid-cols-2 items-center gap-4 border-b border-[#F5F6F8] px-6 py-3.5 last:border-b-0 lg:grid-cols-[1.6fr_1fr_1fr_1fr_90px]"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ background: AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length] }}
                >
                  {g.initials}
                </div>
                <span className="text-[14.5px] font-semibold">{g.name}</span>
              </div>
              <span className="text-sm text-[#6B7280]">
                {g.stays} {g.stays === 1 ? "stay" : "stays"}
              </span>
              {g.lastStatus ? (
                <span
                  className="w-fit rounded-full border px-2.5 py-1 text-xs font-bold"
                  style={{ color: st.c, background: st.bg, borderColor: st.bd }}
                >
                  {formatStatusLabel(g.lastStatus)}
                </span>
              ) : (
                <span className="text-sm text-[#9CA3AF]">—</span>
              )}
              {g.lastBookingId ? (
                <Link
                  href={`/admin/bookings/${g.lastBookingId}`}
                  className="navlink w-fit text-[13px] font-semibold text-[#7C8CF8]"
                >
                  View booking
                </Link>
              ) : (
                <span className="text-sm text-[#9CA3AF]">—</span>
              )}
              <button
                type="button"
                onClick={() => openEdit(g.id)}
                aria-label="Edit customer"
                className="ghost flex size-8 cursor-pointer items-center justify-center rounded-lg border border-[#E7E8EC]"
              >
                <Pencil className="size-[15px] text-[#6B7280]" />
              </button>
            </div>
          );
        })}
      </div>

      <CrudDrawer open={addOpen} onOpenChange={setAddOpen} title="Add a customer">
        <GuestForm
          action={createGuestAction}
          submitLabel="Add customer"
          onSuccess={() => refreshAndClose(() => setAddOpen(false))}
          onCancel={() => setAddOpen(false)}
        />
      </CrudDrawer>

      <CrudDrawer open={editId !== null} onOpenChange={(open) => !open && closeEdit()} title="Edit customer">
        {editId && editData ? (
          <GuestForm
            action={updateGuestAction.bind(null, editId)}
            submitLabel="Save changes"
            onSuccess={() => refreshAndClose(closeEdit)}
            onCancel={closeEdit}
            initial={{
              firstName: editData.firstName,
              lastName: editData.lastName,
              email: editData.email,
              phone: editData.phone ?? "",
              notes: editData.notes ?? "",
            }}
          />
        ) : (
          <div className="py-10 text-center text-[13.5px] font-medium text-[#9CA3AF]">Loading…</div>
        )}
      </CrudDrawer>
    </div>
  );
}
