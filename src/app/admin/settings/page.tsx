import { auth } from "@/lib/auth";
import { getHotel } from "@/lib/data/hotels";
import { listAmenities } from "@/lib/data/content";
import { requireHotelOwnerSession } from "@/lib/session";
import { MyHotelSection } from "@/components/admin/my-hotel-section";
import { ProfileSettingsForm } from "@/components/admin/profile-settings-form";

export default async function AdminSettingsPage() {
  const { hotelId } = await requireHotelOwnerSession();
  const session = await auth();
  const [hotel, amenities] = await Promise.all([getHotel(hotelId), listAmenities()]);
  if (!hotel) throw new Error("Hotel not found.");

  return (
    <div className="fu mx-auto max-w-[720px] p-8">
      <h1 className="m-0 text-[28px] font-extrabold tracking-[-.03em]">Settings</h1>
      <p className="mt-2 text-[14.5px] font-medium text-[#6B7280]">
        Manage your hotel, profile, and workspace preferences.
      </p>

      <div className="mt-[22px]">
        <MyHotelSection
          hotel={{
            name: hotel.name,
            description: hotel.description,
            city: hotel.city,
            country: hotel.country,
            address: hotel.address,
            starRating: hotel.starRating,
            currency: hotel.currency,
            checkInTime: hotel.checkInTime,
            checkOutTime: hotel.checkOutTime,
            serviceFeeCents: hotel.serviceFeeCents,
            taxRatePercent: Number(hotel.taxRatePercent),
            tag: hotel.tag,
            contactEmail: hotel.contactEmail,
            contactPhone: hotel.contactPhone,
            freeCancellationHours: hotel.cancellationPolicy?.freeCancellationHours ?? 48,
            penaltyNights: hotel.cancellationPolicy?.penaltyNights ?? 1,
            amenityIds: hotel.amenities.map((a) => a.amenityId),
            gradient: hotel.gradient,
            coverImageUrl: hotel.images[0]?.url ?? null,
          }}
          amenities={amenities.map((a) => ({ id: a.id, label: a.label }))}
        />
      </div>

      <ProfileSettingsForm
        name={session?.user?.name ?? "Hotel Owner"}
        email={session?.user?.email ?? ""}
      />
    </div>
  );
}
