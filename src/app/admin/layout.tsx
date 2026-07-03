import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopbar } from "@/components/admin/topbar";
import { adminBookings } from "@/lib/meridian-data";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  const pendingBookings = adminBookings.filter((b) => b.status === "Pending").length;

  return (
    <div className="flex min-h-screen" style={{ background: "#FAFAF8" }}>
      <AdminSidebar pendingBookings={pendingBookings} />
      <div className="min-w-0 flex-1">
        <AdminTopbar />
        {children}
      </div>
    </div>
  );
}
