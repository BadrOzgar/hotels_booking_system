"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, LogOut } from "lucide-react";
import { logout } from "@/app/admin/actions";

const active = { background: "#F3F5FF", color: "#4A5AE0", fontWeight: 600 };
const inactive = { background: "transparent", color: "#6B7280", fontWeight: 500 };

export function SuperAdminSidebar() {
  const pathname = usePathname();
  const isDash = pathname === "/super-admin";
  const isHotels = pathname.startsWith("/super-admin/hotels");

  return (
    <aside className="sticky top-0 flex h-screen w-[250px] shrink-0 flex-col border-r border-[#ECEDF1] bg-white p-4">
      <div className="flex items-center gap-2.5 px-2 py-1.5">
        <Image
          src="/logo.png"
          alt="Meridian"
          width={34}
          height={34}
          className="rounded-[11px]"
          style={{ boxShadow: "0 4px 12px rgba(31,41,55,.3)" }}
        />
        <div>
          <div className="text-base leading-none font-bold tracking-[-.02em]">Meridian</div>
          <div className="mt-[3px] text-[11.5px] font-medium text-[#9CA3AF]">Platform admin</div>
        </div>
      </div>

      <div className="px-2.5 pt-[22px] pb-2 text-[11px] font-bold tracking-[.06em] text-[#B6BAC4] uppercase">
        Platform
      </div>
      <Link
        href="/super-admin"
        className="ghost flex items-center gap-3 rounded-xl px-3 py-[11px] text-[14.5px]"
        style={isDash ? active : inactive}
      >
        <LayoutDashboard className="size-[19px]" style={{ color: isDash ? "#7C8CF8" : "#9CA3AF" }} />
        Dashboard
      </Link>
      <Link
        href="/super-admin/hotels"
        className="ghost mt-1 flex items-center gap-3 rounded-xl px-3 py-[11px] text-[14.5px]"
        style={isHotels ? active : inactive}
      >
        <Building2 className="size-[19px]" style={{ color: isHotels ? "#7C8CF8" : "#9CA3AF" }} />
        Hotels
      </Link>

      <form action={logout} className="mt-auto">
        <button
          type="submit"
          className="ghost flex w-full items-center gap-3 rounded-xl px-3 py-[11px] text-left text-[14.5px] font-medium text-[#6B7280]"
        >
          <LogOut className="size-[19px] text-[#9CA3AF]" />
          Log out
        </button>
      </form>
    </aside>
  );
}
