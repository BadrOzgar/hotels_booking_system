"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/hotels", label: "Hotels" },
  { href: "/rooms", label: "Rooms" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function MobileNav({
  isAuthenticated,
  authLink,
}: {
  isAuthenticated: boolean;
  authLink: { href: string; label: string };
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[#E7E8EC] bg-white"
      >
        {open ? <X className="size-5 text-[#1F2937]" /> : <Menu className="size-5 text-[#1F2937]" />}
      </button>

      {open &&
        createPortal(
          <div
            className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-[#FAFAF8] md:hidden"
            style={{ boxShadow: "0 12px 30px rgba(16,24,40,.08)" }}
          >
            <div className="flex flex-col px-6 py-4">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-[#ECEDF1] py-4 text-[17px] font-semibold text-[#1F2937]"
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-6 flex flex-col gap-3">
                {!isAuthenticated && (
                  <Link
                    href={authLink.href}
                    onClick={() => setOpen(false)}
                    className="flex w-full items-center justify-center rounded-[13px] border border-[#E7E8EC] bg-white px-5 py-3.5 text-[15px] font-semibold text-[#1F2937]"
                  >
                    {authLink.label}
                  </Link>
                )}
                <Link
                  href={isAuthenticated ? authLink.href : "/rooms"}
                  onClick={() => setOpen(false)}
                  className="btnp flex w-full items-center justify-center rounded-[13px] px-5 py-3.5 text-[15px] font-semibold text-white"
                  style={{ background: "#7C8CF8", boxShadow: "0 4px 14px rgba(124,140,248,.28)" }}
                >
                  {isAuthenticated ? authLink.label : "Book now"}
                </Link>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
