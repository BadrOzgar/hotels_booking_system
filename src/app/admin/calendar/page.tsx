import { getCalendarEvents, today } from "@/lib/data/dashboard";
import { requireHotelOwnerSession } from "@/lib/session";
import { CalendarClient } from "@/components/admin/calendar-client";

export default async function AdminCalendarPage() {
  const { hotelId } = await requireHotelOwnerSession();
  const now = today();
  const year = now.getFullYear();
  const month = now.getMonth();
  const events = await getCalendarEvents(hotelId, year, month);

  return (
    <CalendarClient
      initialYear={year}
      initialMonth={month}
      initialEvents={Object.fromEntries(events)}
      todayDate={now.getDate()}
      todayYear={year}
      todayMonth={month}
    />
  );
}
