"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  FileText,
  FolderKanban,
  HelpCircle,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  Settings,
  Wrench,
  X,
} from "lucide-react";
import { Logo } from "@/components/Logo";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/analytics", label: "Lead Insights", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  const nav = (
    <nav className="flex h-full flex-col">
      <div className="border-b border-slate-800 p-5">
        <Logo light />
      </div>
      <div className="flex-1 space-y-1 overflow-y-auto p-3">
        {LINKS.map((l) => {
          const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-brand-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <l.icon className="h-4.5 w-4.5" /> {l.label}
            </Link>
          );
        })}
      </div>
      <div className="border-t border-slate-800 p-3">
        <Link
          href="/"
          className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          View Website
        </Link>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-red-600/20 hover:text-red-300"
        >
          <LogOut className="h-4.5 w-4.5" /> Sign Out
        </button>
      </div>
    </nav>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white p-4 lg:hidden">
        <Logo />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 bg-slate-900 lg:block">{nav}</aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/50"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-64 bg-slate-900">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-4 text-slate-400 hover:text-white"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
            {nav}
          </div>
        </div>
      )}
    </>
  );
}
