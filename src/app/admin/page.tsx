import { DashboardToggle } from "@/components/admin/dashboard-toggle";
import { getDashboardStats, getRecentBookings, getCalendarEvents, today } from "@/lib/data/dashboard";
import { getRevenueSeries } from "@/lib/data/revenue";
import { requireHotelOwnerSession } from "@/lib/session";
import { auth } from "@/lib/auth";

export default async function AdminDashboardPage() {
  const { hotelId } = await requireHotelOwnerSession();
  const session = await auth();
  const now = today();
  const [dashboardStats, recentBookings, calendarEvents, revenue7d, revenue30d, revenue1y] = await Promise.all([
    getDashboardStats(hotelId),
    getRecentBookings(hotelId, 5),
    getCalendarEvents(hotelId, now.getFullYear(), now.getMonth()),
    getRevenueSeries(hotelId, "7D", now),
    getRevenueSeries(hotelId, "30D", now),
    getRevenueSeries(hotelId, "1Y", now),
  ]);

  const stats = [
    { icon: "door" as const, bg: "#EDFBF3", fg: "#4FB878", value: String(dashboardStats.availableRooms), label: "Available rooms" },
    { icon: "bed" as const, bg: "#F3F5FF", fg: "#7C8CF8", value: String(dashboardStats.occupiedRooms), label: "Occupied rooms" },
    { icon: "login" as const, bg: "#EAF6FF", fg: "#3FA9F5", value: String(dashboardStats.todayCheckIns), label: "Today's check-ins" },
    { icon: "logout" as const, bg: "#FFF3EC", fg: "#E88A5A", value: String(dashboardStats.todayCheckOuts), label: "Today's check-outs" },
    { icon: "calendar" as const, bg: "#FBF4EA", fg: "#D9A441", value: String(dashboardStats.upcoming), label: "Upcoming" },
  ];

  return (
    <div className="fu p-8">
      <DashboardToggle
        ownerName={session?.user?.name ?? "Hotel Owner"}
        stats={stats}
        revenueToday={dashboardStats.revenueToday}
        revenueSeries={{ "7D": revenue7d, "30D": revenue30d, "1Y": revenue1y }}
        availableRooms={dashboardStats.availableRooms}
        occupiedRooms={dashboardStats.occupiedRooms}
        recentBookings={recentBookings.map((b) => ({
          id: b.id,
          confirmationCode: b.confirmationCode,
          guestName: `${b.guest.firstName} ${b.guest.lastName}`,
          initials: `${b.guest.firstName[0] ?? ""}${b.guest.lastName[0] ?? ""}`.toUpperCase(),
          roomName: b.roomType.name,
          gradient: b.roomType.gradient,
          checkIn: b.checkIn,
          checkOut: b.checkOut,
          status: b.status,
        }))}
        calendarEvents={Object.fromEntries(calendarEvents)}
        calendarYear={now.getFullYear()}
        calendarMonth={now.getMonth()}
      />
    </div>
  );
}
