import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-[#ECEDF1] bg-white sm:mt-20 md:mt-24">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-10 px-4 pt-12 pb-10 sm:grid-cols-2 sm:px-6 sm:pt-14 md:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="Meridian" width={32} height={32} className="rounded-[10px]" />
            <span className="text-lg font-bold text-[#1F2937]">Meridian</span>
          </div>
          <p className="mt-4 max-w-[260px] text-sm leading-relaxed text-[#9CA3AF]">
            A coastal retreat on Half Moon Bay. Designed for rest, light and the long view.
          </p>
        </div>
        <div>
          <div className="text-[13px] font-bold text-[#1F2937]">Hotel</div>
          <div className="mt-4 flex flex-col gap-[11px] text-sm font-medium text-[#6B7280]">
            <Link href="/rooms" className="navlink">Rooms</Link>
            <Link href="/hotels" className="navlink">Hotels</Link>
            <span className="navlink">Dining</span>
            <span className="navlink">Spa</span>
          </div>
        </div>
        <div>
          <div className="text-[13px] font-bold text-[#1F2937]">Company</div>
          <div className="mt-4 flex flex-col gap-[11px] text-sm font-medium text-[#6B7280]">
            <Link href="/about" className="navlink">About</Link>
            <span className="navlink">Careers</span>
            <span className="navlink">Press</span>
            <Link href="/login" className="navlink">Admin login</Link>
          </div>
        </div>
        <div>
          <div className="text-[13px] font-bold text-[#1F2937]">Contact</div>
          <div className="mt-4 flex flex-col gap-[11px] text-sm font-medium text-[#6B7280]">
            <span>1 Shoreline Dr</span>
            <span>Half Moon Bay, CA</span>
            <span>+1 (650) 555-0142</span>
          </div>
        </div>
      </div>
      <div className="border-t border-[#F0F1F4]">
        <div className="mx-auto flex max-w-[1240px] flex-col items-center justify-between gap-3 px-4 py-[22px] text-[13px] font-medium text-[#9CA3AF] sm:flex-row sm:px-6 lg:px-8">
          <span>&copy; {new Date().getFullYear()} Meridian Coastal Resort</span>
          <span className="flex gap-[22px]">
            <span className="navlink">Privacy</span>
            <span className="navlink">Terms</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
