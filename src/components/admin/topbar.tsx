"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, Bell, Plus, ChevronDown, LogOut, Globe } from "lucide-react";
import { logout, getNewBookingNotificationsAction, type LiveNotification } from "@/app/admin/actions";

const POLL_INTERVAL_MS = 15_000;

/** Synthesizes a short two-tone "ding" with the Web Audio API — no audio asset to ship or host. */
function playDing() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.18);
    gain.gain.setValueAtTime(0.16, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
    osc.onended = () => ctx.close();
  } catch {
    // Non-fatal — some browsers block audio until the user has interacted with the page.
  }
}

export function AdminTopbar({
  ownerName,
  ownerEmail,
  quickAddHref = "/admin/rooms",
  notifications: initialNotifications = [],
}: {
  ownerName: string;
  ownerEmail: string;
  quickAddHref?: string | null;
  notifications?: LiveNotification[];
}) {
  const [openNotifications, setOpenNotifications] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [notifications, setNotifications] = useState<LiveNotification[]>(initialNotifications);
  const [unseenCount, setUnseenCount] = useState(0);
  const [ringing, setRinging] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const sinceRef = useRef(new Date().toISOString());

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

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      const result = await getNewBookingNotificationsAction(sinceRef.current);
      if (cancelled || result.count === 0) return;

      sinceRef.current = new Date().toISOString();
      setNotifications((prev) => [...result.notifications, ...prev].slice(0, 15));
      setUnseenCount((prev) => prev + result.count);
      setRinging(true);
      playDing();
      if (typeof navigator.vibrate === "function") navigator.vibrate([80, 40, 80]);
      setTimeout(() => setRinging(false), 700);
    }

    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  function toggleNotifications() {
    setOpenNotifications((v) => {
      const next = !v;
      if (next) setUnseenCount(0);
      return next;
    });
    setOpenProfile(false);
  }

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
            onClick={toggleNotifications}
            aria-label="Notifications"
            className={`relative flex size-10 cursor-pointer items-center justify-center rounded-xl border border-[#E7E8EC] bg-white ${ringing ? "bell-ring" : ""}`}
          >
            <Bell className="size-[18px] text-[#6B7280]" />
            {(unseenCount > 0 || notifications.length > 0) && (
              <span
                className="absolute top-2 right-2 flex items-center justify-center rounded-full border-2 border-white bg-[#F2A3A3] text-[9px] font-bold text-white"
                style={unseenCount > 0 ? { minWidth: 16, height: 16, padding: "0 3px" } : { width: 8, height: 8 }}
              >
                {unseenCount > 0 ? Math.min(unseenCount, 9) + (unseenCount > 9 ? "+" : "") : ""}
              </span>
            )}
          </button>
          {openNotifications && (
            <div
              className="absolute top-[calc(100%+8px)] right-0 w-[320px] rounded-2xl border border-[#E7E8EC] bg-white p-2"
              style={{ boxShadow: "0 12px 30px rgba(16,24,40,.12)" }}
            >
              <div className="px-3 py-2 text-[13px] font-bold text-[#1F2937]">Notifications</div>
              {notifications.length === 0 && (
                <div className="px-3 py-4 text-center text-[13px] font-medium text-[#9CA3AF]">
                  No notifications yet.
                </div>
              )}
              <div className="max-h-[320px] overflow-y-auto">
                {notifications.map((n, i) => (
                  <div key={i} className="rowh rounded-xl px-3 py-2.5">
                    <div className="text-[13.5px] font-semibold text-[#374151]">{n.title}</div>
                    <div className="mt-0.5 text-[12px] font-medium text-[#9CA3AF]">{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {quickAddHref && (
          <Link
            href={quickAddHref}
            aria-label="Manage rooms"
            className="flex size-10 items-center justify-center rounded-xl border border-[#E7E8EC] bg-white"
          >
            <Plus className="size-[18px] text-[#6B7280]" />
          </Link>
        )}
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
              {ownerName
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <ChevronDown className="size-4 text-[#9CA3AF]" />
          </button>
          {openProfile && (
            <div
              className="absolute top-[calc(100%+8px)] right-0 w-[220px] overflow-hidden rounded-2xl border border-[#E7E8EC] bg-white p-1.5"
              style={{ boxShadow: "0 12px 30px rgba(16,24,40,.12)" }}
            >
              <div className="px-3 py-2.5">
                <div className="text-[13.5px] font-bold">{ownerName}</div>
                <div className="text-xs font-medium text-[#9CA3AF]">{ownerEmail}</div>
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
