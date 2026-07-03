"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, Bell, Plus, ChevronDown, LogOut, Globe } from "lucide-react";
import { logout } from "@/app/admin/actions";

const notifications = [
  { title: "New booking from Sofie Lind", time: "12 min ago" },
  { title: "Coral Room marked for maintenance", time: "1 hour ago" },
  { title: "Daniel Reyes checked in", time: "3 hours ago" },
];

export function AdminTopbar() {
  const [openNotifications, setOpenNotifications] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpenNotifications(false);
        setOpenProfile(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div
      ref={rootRef}
      className="sticky top-0 z-40 flex items-center justify-between border-b border-[#ECEDF1] px-8 py-4"
      style={{ background: "rgba(250,250,248,.85)", backdropFilter: "blur(12px)" }}
    >
      <div className="relative hidden w-[340px] sm:block">
        <Search className="absolute top-1/2 left-3.5 size-[17px] -translate-y-1/2 text-[#9CA3AF]" />
        <input
          placeholder="Search bookings, guests, rooms…"
          className="w-full rounded-xl border border-[#E7E8EC] bg-white py-2.5 pr-3.5 pl-10 text-sm outline-none"
        />
      </div>
      <div className="ml-auto flex items-center gap-3.5">
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setOpenNotifications((v) => !v);
              setOpenProfile(false);
            }}
            className="relative flex size-10 cursor-pointer items-center justify-center rounded-xl border border-[#E7E8EC] bg-white"
          >
            <Bell className="size-[18px] text-[#6B7280]" />
            <span className="absolute top-2.5 right-2.5 size-2 rounded-full border-2 border-white bg-[#F2A3A3]" />
          </button>
          {openNotifications && (
            <div
              className="absolute top-[calc(100%+8px)] right-0 w-[300px] rounded-2xl border border-[#E7E8EC] bg-white p-2"
              style={{ boxShadow: "0 12px 30px rgba(16,24,40,.12)" }}
            >
              <div className="px-3 py-2 text-[13px] font-bold text-[#1F2937]">Notifications</div>
              {notifications.map((n) => (
                <div key={n.title} className="rowh rounded-xl px-3 py-2.5">
                  <div className="text-[13.5px] font-semibold text-[#374151]">{n.title}</div>
                  <div className="mt-0.5 text-[12px] font-medium text-[#9CA3AF]">{n.time}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <Link
          href="/admin/rooms/new"
          aria-label="Add new room"
          className="flex size-10 items-center justify-center rounded-xl border border-[#E7E8EC] bg-white"
        >
          <Plus className="size-[18px] text-[#6B7280]" />
        </Link>
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setOpenProfile((v) => !v);
              setOpenNotifications(false);
            }}
            className="flex cursor-pointer items-center gap-2.5 pl-1.5"
          >
            <div
              className="flex size-[38px] items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg,#7C8CF8,#8FD3FE)" }}
            >
              EM
            </div>
            <ChevronDown className="size-4 text-[#9CA3AF]" />
          </button>
          {openProfile && (
            <div
              className="absolute top-[calc(100%+8px)] right-0 w-[220px] overflow-hidden rounded-2xl border border-[#E7E8EC] bg-white p-1.5"
              style={{ boxShadow: "0 12px 30px rgba(16,24,40,.12)" }}
            >
              <div className="px-3 py-2.5">
                <div className="text-[13.5px] font-bold">Elena Marceau</div>
                <div className="text-xs font-medium text-[#9CA3AF]">elena@meridian.co</div>
              </div>
              <Link
                href="/"
                className="ghost flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13.5px] font-medium text-[#374151]"
              >
                <Globe className="size-4 text-[#9CA3AF]" />
                View website
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="ghost flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13.5px] font-medium text-[#D96A6A]"
                >
                  <LogOut className="size-4" />
                  Sign out
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
