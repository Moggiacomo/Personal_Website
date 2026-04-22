import { Sidebar } from "@/components/sidebar";
import { Footer } from "@/components/contact-section";

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar />
      <main className="flex-1">
        <div className="min-h-screen flex flex-col">
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </main>
    </div>
  );
}
