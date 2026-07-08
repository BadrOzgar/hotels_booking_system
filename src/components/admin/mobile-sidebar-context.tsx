"use client";

import { createContext, useContext, useState } from "react";

type MobileSidebarState = { open: boolean; setOpen: (next: boolean) => void };

const MobileSidebarContext = createContext<MobileSidebarState | null>(null);

/** Shared open/close state so the topbar's hamburger button and the sidebar's mobile drawer stay in sync. */
export function MobileSidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return <MobileSidebarContext.Provider value={{ open, setOpen }}>{children}</MobileSidebarContext.Provider>;
}

export function useMobileSidebar(): MobileSidebarState {
  const ctx = useContext(MobileSidebarContext);
  if (!ctx) throw new Error("useMobileSidebar must be used within MobileSidebarProvider");
  return ctx;
}
