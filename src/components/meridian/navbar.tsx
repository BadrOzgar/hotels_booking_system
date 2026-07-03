import Link from "next/link";
import { Waves } from "lucide-react";

export function Navbar() {
  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        background: "rgba(250,250,248,.82)",
        backdropFilter: "blur(14px)",
        borderColor: "#ECEDF1",
      }}
    >
      <div className="mx-auto flex max-w-[1240px] items-center justify-between px-8 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="flex size-[34px] items-center justify-center rounded-[11px]"
            style={{
              background: "linear-gradient(135deg,#7C8CF8,#8FD3FE)",
              boxShadow: "0 4px 12px rgba(124,140,248,.3)",
            }}
          >
            <Waves className="size-[19px] text-white" />
          </div>
          <span className="text-[19px] font-bold tracking-[-.02em] text-[#1F2937]">
            Meridian
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="/" className="navlink text-[14.5px] font-medium text-[#1F2937]">
            Home
          </Link>
          <Link href="/rooms" className="navlink text-[14.5px] font-medium text-[#6B7280]">
            Rooms
          </Link>
          <Link href="/gallery" className="navlink text-[14.5px] font-medium text-[#6B7280]">
            Gallery
          </Link>
          <Link href="/about" className="navlink text-[14.5px] font-medium text-[#6B7280]">
            About
          </Link>
          <Link href="/contact" className="navlink text-[14.5px] font-medium text-[#6B7280]">
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-3.5">
          <Link href="/login" className="navlink text-[14.5px] font-semibold text-[#6B7280]">
            Log in
          </Link>
          <Link
            href="/rooms"
            className="btnp rounded-[13px] px-5 py-[11px] text-[14.5px] font-semibold text-white"
            style={{
              background: "#7C8CF8",
              boxShadow: "0 4px 14px rgba(124,140,248,.28)",
            }}
          >
            Book now
          </Link>
        </div>
      </div>
    </nav>
  );
}
