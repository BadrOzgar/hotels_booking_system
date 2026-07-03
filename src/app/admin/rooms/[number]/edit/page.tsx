import { notFound } from "next/navigation";
import { roomRows, getRoomRow } from "@/lib/meridian-data";
import { EditRoomForm } from "@/components/admin/edit-room-form";

export function generateStaticParams() {
  return roomRows.map((r) => ({ number: r.number }));
}

export default async function AdminEditRoomPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = await params;
  const room = getRoomRow(decodeURIComponent(number));
  if (!room) notFound();

  return <EditRoomForm room={room} />;
}
