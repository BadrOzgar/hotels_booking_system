export const dynamic = "force-dynamic";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { HotelsBrowser } from "@/components/meridian/hotels-browser";
import { listHotels } from "@/lib/data/hotels";

export default async function GalleryPage() {
  const hotels = await listHotels();

  return (
    <div className="fu mx-auto max-w-[1240px] px-8 pt-10 pb-20">
      <div className="flex items-center gap-2 text-[13.5px] font-medium text-[#9CA3AF]">
        <Link href="/" className="navlink">Home</Link>
        <ChevronRight className="size-[15px]" />
        <span className="text-[#6B7280]">Gallery</span>
      </div>

      <div className="mt-4">
        <h1 className="m-0 text-4xl font-extrabold tracking-[-.03em]">Our hotels</h1>
        <p className="mt-2.5 text-[15.5px] font-medium text-[#6B7280]">
          Meridian properties, each shaped by the place it stands in.
        </p>
      </div>

      <div className="mt-8">
        <HotelsBrowser hotels={hotels} />
      </div>
    </div>
  );
}
