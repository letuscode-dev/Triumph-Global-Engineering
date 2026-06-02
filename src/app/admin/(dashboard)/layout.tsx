import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 lg:flex-row">
      <AdminSidebar />
      <div className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-6xl p-5 sm:p-8">{children}</div>
      </div>
    </div>
  );
}
