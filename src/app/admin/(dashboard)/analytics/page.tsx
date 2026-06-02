import { ExternalLink, Inbox, TrendingUp } from "lucide-react";
import Link from "next/link";
import { getLeads } from "@/lib/leads-store";
import { getServices } from "@/lib/repository";
import { AdminHeader } from "@/components/admin/AdminHeader";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const [leads, services] = await Promise.all([getLeads(), getServices()]);
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  const serviceCounts = services
    .map((s) => ({
      name: s.shortTitle,
      count: leads.filter((l) => l.service === s.title).length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
  const maxCount = Math.max(1, ...serviceCounts.map((s) => s.count));

  const statuses = ["new", "contacted", "quoted", "won", "lost"] as const;
  const statusCounts = statuses.map((s) => ({
    status: s,
    count: leads.filter((l) => l.status === s).length,
  }));

  const won = leads.filter((l) => l.status === "won").length;
  const conversion = leads.length ? Math.round((won / leads.length) * 100) : 0;

  const cards = [
    { label: "Total Leads", value: String(leads.length), icon: Inbox },
    { label: "Win Rate", value: `${conversion}%`, icon: TrendingUp },
  ];

  return (
    <div>
      <AdminHeader
        title="Lead Insights"
        description="Lead statistics from your website forms. Website traffic is tracked in Google Analytics."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <div key={c.label} className="card p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <c.icon className="h-5 w-5" />
            </div>
            <div className="mt-4 font-display text-3xl font-extrabold text-slate-900">
              {c.value}
            </div>
            <div className="text-sm text-slate-500">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="card mt-6 p-6">
        <h2 className="font-display text-lg font-bold text-slate-900">Website traffic</h2>
        {gaId ? (
          <p className="mt-2 text-sm text-slate-600">
            Google Analytics is connected ({gaId}). View live traffic, acquisition, and engagement
            in your GA4 dashboard.
          </p>
        ) : (
          <p className="mt-2 text-sm text-slate-600">
            Set <code className="font-mono text-xs">NEXT_PUBLIC_GA_MEASUREMENT_ID</code> in your
            environment to enable cookie-consent-gated analytics on the public site.
          </p>
        )}
        <a
          href="https://analytics.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline mt-4 inline-flex py-2 text-sm"
        >
          Open Google Analytics <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="font-display text-lg font-bold text-slate-900">
            Popular Services (by leads)
          </h2>
          <div className="mt-5 space-y-4">
            {serviceCounts.map((s) => (
              <div key={s.name}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-slate-700">{s.name}</span>
                  <span className="font-semibold text-slate-900">{s.count}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-600 to-leaf-500"
                    style={{ width: `${(s.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {serviceCounts.every((s) => s.count === 0) && (
              <p className="text-sm text-slate-500">No leads with a service selected yet.</p>
            )}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-display text-lg font-bold text-slate-900">
            Lead Status Breakdown
          </h2>
          <div className="mt-5 space-y-4">
            {statusCounts.map((s) => (
              <div key={s.status}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="capitalize text-slate-700">{s.status}</span>
                  <span className="font-semibold text-slate-900">{s.count}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-brand-500"
                    style={{
                      width: `${leads.length ? (s.count / leads.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <Link href="/admin/leads" className="btn-outline mt-6 inline-flex py-2 text-sm">
            Manage leads
          </Link>
        </div>
      </div>
    </div>
  );
}
