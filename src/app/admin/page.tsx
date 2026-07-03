import { DashboardToggle } from "@/components/admin/dashboard-toggle";
import { adminBookings } from "@/lib/meridian-data";

const stats = [
  { icon: "door" as const, bg: "#EDFBF3", fg: "#4FB878", value: "18", label: "Available rooms" },
  { icon: "bed" as const, bg: "#F3F5FF", fg: "#7C8CF8", value: "24", label: "Occupied rooms" },
  { icon: "login" as const, bg: "#EAF6FF", fg: "#3FA9F5", value: "7", label: "Today's check-ins" },
  { icon: "logout" as const, bg: "#FFF3EC", fg: "#E88A5A", value: "5", label: "Today's check-outs" },
  { icon: "calendar" as const, bg: "#FBF4EA", fg: "#D9A441", value: "12", label: "Upcoming" },
];

export default function AdminDashboardPage() {
  const recentBookings = adminBookings.slice(0, 5);

  return (
    <div className="fu p-8">
      <DashboardToggle recentBookings={recentBookings} stats={stats} />
    </div>
  );
}
