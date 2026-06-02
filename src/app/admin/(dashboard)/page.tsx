import Link from "next/link";
import {
  ArrowUpRight,
  FileText,
  FolderKanban,
  HelpCircle,
  Image as ImageIcon,
  Inbox,
  MessageSquareQuote,
  TrendingUp,
  Wrench,
} from "lucide-react";
import { getLeads } from "@/lib/leads-store";
import { contentCounts } from "@/lib/repository";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, string> = {
  new: "bg-brand-100 text-brand-700",
  contacted: "bg-amber-100 text-amber-700",
  quoted: "bg-purple-100 text-purple-700",
  won: "bg-leaf-100 text-leaf-700",
  lost: "bg-slate-200 text-slate-600",
};

export default async function AdminDashboard() {
  const leads = await getLeads();
  const c = await contentCounts();
  const newLeads = leads.filter((l) => l.status === "new").length;
  const won = leads.filter((l) => l.status === "won").length;
  const conversion = leads.length ? Math.round((won / leads.length) * 100) : 0;

  const stats = [
    {
      label: "Total Leads",
      value: leads.length,
      icon: Inbox,
      href: "/admin/leads",
      accent: "text-brand-600 bg-brand-50",
    },
    {
      label: "New Leads",
      value: newLeads,
      icon: TrendingUp,
      href: "/admin/leads",
      accent: "text-leaf-600 bg-leaf-50",
    },
    {
      label: "Projects",
      value: c.projects,
      icon: FolderKanban,
      href: "/admin/projects",
      accent: "text-purple-600 bg-purple-50",
    },
    {
      label: "Conversion",
      value: `${conversion}%`,
      icon: ArrowUpRight,
      href: "/admin/analytics",
      accent: "text-amber-600 bg-amber-50",
    },
  ];

  const content = [
    { label: "Services", value: c.services, icon: Wrench, href: "/admin/services" },
    { label: "Projects", value: c.projects, icon: FolderKanban, href: "/admin/projects" },
    { label: "Blog Posts", value: c.blog, icon: FileText, href: "/admin/blog" },
    { label: "Media Items", value: c.media, icon: ImageIcon, href: "/admin/media" },
    {
      label: "Testimonials",
      value: c.testimonials,
      icon: MessageSquareQuote,
      href: "/admin/testimonials",
    },
    { label: "FAQs", value: c.faqs, icon: HelpCircle, href: "/admin/faqs" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-slate-900">Dashboard</h1>
      <p className="mt-1 text-slate-500">
        Welcome back. Here&apos;s an overview of your website.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card card-hover p-5">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.accent}`}
            >
              <s.icon className="h-5 w-5" />
            </div>
            <div className="mt-4 font-display text-3xl font-extrabold text-slate-900">
              {s.value}
            </div>
            <div className="text-sm text-slate-500">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Recent leads */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-slate-900">
              Recent Leads
            </h2>
            <Link
              href="/admin/leads"
              className="text-sm font-semibold text-brand-600 hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="mt-4 divide-y divide-slate-100">
            {leads.slice(0, 5).map((l) => (
              <div key={l.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <div className="truncate font-medium text-slate-900">{l.name}</div>
                  <div className="truncate text-xs text-slate-500">
                    {l.service || "General enquiry"} · {l.phone}
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_STYLE[l.status]}`}
                >
                  {l.status}
                </span>
              </div>
            ))}
            {leads.length === 0 && (
              <p className="py-6 text-center text-sm text-slate-400">No leads yet.</p>
            )}
          </div>
        </div>

        {/* Content quick links */}
        <div className="card p-6">
          <h2 className="font-display text-lg font-bold text-slate-900">Content</h2>
          <div className="mt-4 space-y-2">
            {content.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm hover:bg-slate-50"
              >
                <span className="flex items-center gap-2.5 text-slate-700">
                  <item.icon className="h-4 w-4 text-slate-400" /> {item.label}
                </span>
                <span className="font-semibold text-slate-900">{item.value}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
