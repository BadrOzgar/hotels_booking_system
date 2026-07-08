"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  CalendarDays,
  Users,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { logout } from "@/app/admin/actions";
import { useMobileSidebar } from "@/components/admin/mobile-sidebar-context";

const active = { background: "#F3F5FF", color: "#4A5AE0", fontWeight: 600 };
const inactive = { background: "transparent", color: "#6B7280", fontWeight: 500 };

function SidebarNav({
  pendingBookings,
  ownerName,
  onNavigate,
}: {
  pendingBookings: number;
  ownerName: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const isDash = pathname === "/admin";
  const isRooms = pathname.startsWith("/admin/rooms");
  const isBookings = pathname.startsWith("/admin/bookings");
  const isCalendar = pathname.startsWith("/admin/calendar");
  const isGuests = pathname.startsWith("/admin/guests");
  const isSettings = pathname.startsWith("/admin/settings");

  const initials = ownerName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <div className="px-2.5 pt-[22px] pb-2 text-[11px] font-bold tracking-[.06em] text-[#B6BAC4] uppercase">
        Manage
      </div>
      <Link
        href="/admin"
        onClick={onNavigate}
        className="ghost flex items-center gap-3 rounded-xl px-3 py-[11px] text-[14.5px]"
        style={isDash ? active : inactive}
      >
        <LayoutDashboard className="size-[19px]" style={{ color: isDash ? "#7C8CF8" : "#9CA3AF" }} />
        Dashboard
      </Link>
      <Link
        href="/admin/rooms"
        onClick={onNavigate}
        className="ghost mt-1 flex items-center gap-3 rounded-xl px-3 py-[11px] text-[14.5px]"
        style={isRooms ? active : inactive}
      >
        <BedDouble className="size-[19px]" style={{ color: isRooms ? "#7C8CF8" : "#9CA3AF" }} />
        Rooms
      </Link>
      <Link
        href="/admin/bookings"
        onClick={onNavigate}
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
        onClick={onNavigate}
        className="ghost mt-1 flex items-center gap-3 rounded-xl px-3 py-[11px] text-[14.5px]"
        style={isCalendar ? active : inactive}
      >
        <CalendarDays className="size-[19px]" style={{ color: isCalendar ? "#7C8CF8" : "#9CA3AF" }} />
        Calendar
      </Link>
      <Link
        href="/admin/guests"
        onClick={onNavigate}
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
        onClick={onNavigate}
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
            {initials}
          </div>
          <div>
            <div className="text-[13.5px] font-bold">{ownerName}</div>
            <div className="text-xs font-medium text-[#9CA3AF]">Hotel Owner</div>
          </div>
        </div>
      </div>
    </>
  );
}

export function AdminSidebar({
  pendingBookings,
  ownerName,
}: {
  pendingBookings: number;
  ownerName: string;
}) {
  const { open, setOpen } = useMobileSidebar();

  return (
    <>
      {/* DESKTOP */}
      <aside className="sticky top-0 hidden h-screen w-[250px] shrink-0 flex-col border-r border-[#ECEDF1] bg-white p-4 lg:flex">
        <div className="flex items-center gap-2.5 px-2 py-1.5">
          <Image
            src="/logo.png"
            alt="Meridian"
            width={34}
            height={34}
            className="rounded-[11px]"
            style={{ boxShadow: "0 4px 12px rgba(124,140,248,.3)" }}
          />
          <div>
            <div className="text-base leading-none font-bold tracking-[-.02em]">Meridian</div>
            <div className="mt-[3px] text-[11.5px] font-medium text-[#9CA3AF]">Admin workspace</div>
          </div>
        </div>
        <SidebarNav pendingBookings={pendingBookings} ownerName={ownerName} />
      </aside>

      {/* MOBILE DRAWER */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} aria-hidden="true" />
          <aside className="absolute inset-y-0 left-0 flex w-[85vw] max-w-[290px] flex-col overflow-y-auto bg-white p-4">
            <div className="flex items-center justify-between gap-2.5 px-2 py-1.5">
              <div className="flex items-center gap-2.5">
                <Image
                  src="/logo.png"
                  alt="Meridian"
                  width={34}
                  height={34}
                  className="rounded-[11px]"
                  style={{ boxShadow: "0 4px 12px rgba(124,140,248,.3)" }}
                />
                <div>
                  <div className="text-base leading-none font-bold tracking-[-.02em]">Meridian</div>
                  <div className="mt-[3px] text-[11.5px] font-medium text-[#9CA3AF]">Admin workspace</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#F4F5F7]"
              >
                <X className="size-4 text-[#6B7280]" />
              </button>
            </div>
            <SidebarNav pendingBookings={pendingBookings} ownerName={ownerName} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
