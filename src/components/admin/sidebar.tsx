"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Waves,
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  CalendarDays,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { logout } from "@/app/admin/actions";

const active = { background: "#F3F5FF", color: "#4A5AE0", fontWeight: 600 };
const inactive = { background: "transparent", color: "#6B7280", fontWeight: 500 };

export function AdminSidebar({ pendingBookings }: { pendingBookings: number }) {
  const pathname = usePathname();
  const isDash = pathname === "/admin";
  const isRooms = pathname.startsWith("/admin/rooms");
  const isBookings = pathname.startsWith("/admin/bookings");
  const isCalendar = pathname.startsWith("/admin/calendar");
  const isGuests = pathname.startsWith("/admin/guests");
  const isSettings = pathname.startsWith("/admin/settings");

  return (
    <aside className="sticky top-0 flex h-screen w-[250px] shrink-0 flex-col border-r border-[#ECEDF1] bg-white p-4">
      <div className="flex items-center gap-2.5 px-2 py-1.5">
        <div
          className="flex size-[34px] items-center justify-center rounded-[11px]"
          style={{ background: "linear-gradient(135deg,#7C8CF8,#8FD3FE)", boxShadow: "0 4px 12px rgba(124,140,248,.3)" }}
        >
          <Waves className="size-[19px] text-white" />
        </div>
        <div>
          <div className="text-base leading-none font-bold tracking-[-.02em]">Meridian</div>
          <div className="mt-[3px] text-[11.5px] font-medium text-[#9CA3AF]">Admin workspace</div>
        </div>
      </div>

      <div className="px-2.5 pt-[22px] pb-2 text-[11px] font-bold tracking-[.06em] text-[#B6BAC4] uppercase">
        Manage
      </div>
      <Link
        href="/admin"
        className="ghost flex items-center gap-3 rounded-xl px-3 py-[11px] text-[14.5px]"
        style={isDash ? active : inactive}
      >
        <LayoutDashboard className="size-[19px]" style={{ color: isDash ? "#7C8CF8" : "#9CA3AF" }} />
        Dashboard
      </Link>
      <Link
        href="/admin/rooms"
        className="ghost mt-1 flex items-center gap-3 rounded-xl px-3 py-[11px] text-[14.5px]"
        style={isRooms ? active : inactive}
      >
        <BedDouble className="size-[19px]" style={{ color: isRooms ? "#7C8CF8" : "#9CA3AF" }} />
        Rooms
      </Link>
      <Link
        href="/admin/bookings"
        className="ghost mt-1 flex items-center gap-3 rounded-xl px-3 py-[11px] text-[14.5px]"
        style={isBookings ? active : inactive}
      >
        <CalendarCheck className="size-[19px]" style={{ color: isBookings ? "#7C8CF8" : "#9CA3AF" }} />
        Bookings
        {pendingBookings > 0 && (
          <span className="ml-auto rounded-full bg-[#7C8CF8] px-2 py-0.5 text-[11px] font-bold text-white">
            {pendingBookings}
          </span>
        )}
      </Link>
      <Link
        href="/admin/calendar"
        className="ghost mt-1 flex items-center gap-3 rounded-xl px-3 py-[11px] text-[14.5px]"
        style={isCalendar ? active : inactive}
      >
        <CalendarDays className="size-[19px]" style={{ color: isCalendar ? "#7C8CF8" : "#9CA3AF" }} />
        Calendar
      </Link>
      <Link
        href="/admin/guests"
        className="ghost mt-1 flex items-center gap-3 rounded-xl px-3 py-[11px] text-[14.5px]"
        style={isGuests ? active : inactive}
      >
        <Users className="size-[19px]" style={{ color: isGuests ? "#7C8CF8" : "#9CA3AF" }} />
        Guests
      </Link>

      <div className="px-2.5 pt-[22px] pb-2 text-[11px] font-bold tracking-[.06em] text-[#B6BAC4] uppercase">
        Account
      </div>
      <Link
        href="/admin/settings"
        className="ghost flex items-center gap-3 rounded-xl px-3 py-[11px] text-[14.5px]"
        style={isSettings ? active : inactive}
      >
        <Settings className="size-[19px]" style={{ color: isSettings ? "#7C8CF8" : "#9CA3AF" }} />
        Settings
      </Link>
      <form action={logout}>
        <button
          type="submit"
          className="ghost mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-[11px] text-left text-[14.5px] font-medium text-[#6B7280]"
        >
          <LogOut className="size-[19px] text-[#9CA3AF]" />
          Log out
        </button>
      </form>

      <div className="mt-auto rounded-2xl bg-[#F7F8FA] p-4">
        <div className="flex items-center gap-2.5">
          <div
            className="flex size-[38px] items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg,#7C8CF8,#8FD3FE)" }}
          >
            EM
          </div>
          <div>
            <div className="text-[13.5px] font-bold">Elena Marceau</div>
            <div className="text-xs font-medium text-[#9CA3AF]">Manager</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
