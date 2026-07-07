"use server";

import { getCalendarEvents, type CalendarBookingEvent } from "@/lib/data/dashboard";
import { requireHotelOwnerSession } from "@/lib/session";

export async function getMonthEvents(
  year: number,
  month: number
): Promise<Record<number, CalendarBookingEvent[]>> {
  const { hotelId } = await requireHotelOwnerSession();
  const map = await getCalendarEvents(hotelId, year, month);
  return Object.fromEntries(map);
}
