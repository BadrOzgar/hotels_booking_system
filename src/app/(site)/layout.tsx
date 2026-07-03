import { Navbar } from "@/components/meridian/navbar";
import { Footer } from "@/components/meridian/footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#FAFAF8" }}>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
