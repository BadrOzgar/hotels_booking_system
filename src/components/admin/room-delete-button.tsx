"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteRoomUnitAction } from "@/app/admin/rooms/actions";

export function RoomDeleteButton({ unitId }: { unitId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!window.confirm("Delete this room? This cannot be undone.")) return;
    startTransition(async () => {
      const result = await deleteRoomUnitAction(unitId);
      if (result) {
        window.alert(result);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={pending}
      aria-label="Delete room"
      className="ghost flex size-8 cursor-pointer items-center justify-center rounded-lg border border-[#E7E8EC] disabled:opacity-60"
    >
      <Trash2 className="size-[15px] text-[#D96A6A]" />
    </button>
  );
}
