import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getRecentActivityAcrossHotels } from "@/lib/data/platform";
import { formatActivityTitle, formatRelativeTime } from "@/lib/meridian-data";
import { SuperAdminSidebar } from "@/components/admin/super-admin-sidebar";
import { AdminTopbar } from "@/components/admin/topbar";

export default async function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.systemRole === "HOTEL_OWNER") redirect("/admin");
  if (session.user.systemRole !== "SUPER_ADMIN") redirect("/login");

  const recentActivity = await getRecentActivityAcrossHotels(5);

  return (
    <div className="flex min-h-screen" style={{ background: "#FAFAF8" }}>
      <SuperAdminSidebar />
      <div className="min-w-0 flex-1">
        <AdminTopbar
          ownerName={session.user.name ?? "Platform Admin"}
          ownerEmail={session.user.email ?? ""}
          quickAddHref="/super-admin/hotels"
          notifications={recentActivity.map((a) => ({
            title: a.hotel ? `${formatActivityTitle(a.action)} · ${a.hotel.name}` : formatActivityTitle(a.action),
            time: formatRelativeTime(a.createdAt),
          }))}
        />
        {children}
      </div>
    </div>
  );
}
