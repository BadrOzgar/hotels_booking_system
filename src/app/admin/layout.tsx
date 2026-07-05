import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { listRecentActivity } from "@/lib/data/activity";
import { formatActivityTitle, formatRelativeTime } from "@/lib/meridian-data";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopbar } from "@/components/admin/topbar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.systemRole === "SUPER_ADMIN") redirect("/super-admin");
  if (session.user.systemRole !== "HOTEL_OWNER" || !session.user.hotelId) redirect("/login");

  const hotel = await prisma.hotel.findUnique({
    where: { id: session.user.hotelId },
    select: { accountStatus: true },
  });
  if (!hotel || hotel.accountStatus === "SUSPENDED") redirect("/login?error=AccountSuspended");

  const [pendingBookings, recentActivity] = await Promise.all([
    prisma.booking.count({ where: { hotelId: session.user.hotelId, status: "PENDING" } }),
    listRecentActivity(session.user.hotelId, 5),
  ]);

  return (
    <div className="flex min-h-screen" style={{ background: "#FAFAF8" }}>
      <AdminSidebar pendingBookings={pendingBookings} ownerName={session.user.name ?? "Hotel Owner"} />
      <div className="min-w-0 flex-1">
        <AdminTopbar
          ownerName={session.user.name ?? "Hotel Owner"}
          ownerEmail={session.user.email ?? ""}
          notifications={recentActivity.map((a) => ({
            title: formatActivityTitle(a.action),
            time: formatRelativeTime(a.createdAt),
          }))}
        />
        {children}
      </div>
    </div>
  );
}
