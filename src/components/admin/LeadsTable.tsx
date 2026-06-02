"use client";

import { useMemo, useState } from "react";
import { Download, Search } from "lucide-react";
import type { Lead } from "@/lib/types";

const STATUSES: Lead["status"][] = ["new", "contacted", "quoted", "won", "lost"];

const STATUS_STYLE: Record<string, string> = {
  new: "bg-brand-100 text-brand-700",
  contacted: "bg-amber-100 text-amber-700",
  quoted: "bg-purple-100 text-purple-700",
  won: "bg-leaf-100 text-leaf-700",
  lost: "bg-slate-200 text-slate-600",
};

export function LeadsTable({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Lead["status"] | "all">("all");

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      const matchesStatus = filter === "all" || l.status === filter;
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        l.name.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        (l.service || "").toLowerCase().includes(q) ||
        (l.location || "").toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [leads, query, filter]);

  async function changeStatus(id: string, status: Lead["status"]) {
    const previous = leads.find((l) => l.id === id)?.status;
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    const res = await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (!res.ok) {
      setLeads((prev) =>
        prev.map((l) => (l.id === id && previous ? { ...l, status: previous } : l))
      );
      alert("Could not update lead status. Please try again.");
    }
  }

  function exportCsv() {
    const headers = [
      "Name",
      "Company",
      "Phone",
      "Email",
      "Location",
      "Service",
      "Budget",
      "Message",
      "Status",
      "Source",
      "Created",
    ];
    const rows = filtered.map((l) =>
      [
        l.name,
        l.company || "",
        l.phone,
        l.email || "",
        l.location || "",
        l.service || "",
        l.budget || "",
        l.message.replace(/\n/g, " "),
        l.status,
        l.source,
        new Date(l.createdAt).toLocaleString(),
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${
              filter === "all" ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            All ({leads.length})
          </button>
          {STATUSES.map((s) => {
            const n = leads.filter((l) => l.status === s).length;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setFilter(s)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize ${
                  filter === s ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {s} ({n})
              </button>
            );
          })}
        </div>
        <button type="button" onClick={exportCsv} className="btn-outline py-2 text-xs">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, phone, service or location..."
          className="input pl-10"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Contact</th>
              <th className="px-4 py-3 font-semibold">Service / Budget</th>
              <th className="px-4 py-3 font-semibold">Message</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((l) => (
              <tr key={l.id} className="align-top hover:bg-slate-50/50">
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900">{l.name}</div>
                  {l.company && <div className="text-xs text-slate-500">{l.company}</div>}
                  <a
                    href={`tel:${l.phone}`}
                    className="text-xs text-brand-600 hover:underline"
                  >
                    {l.phone}
                  </a>
                  {l.email && (
                    <div>
                      <a
                        href={`mailto:${l.email}`}
                        className="text-xs text-slate-500 hover:underline"
                      >
                        {l.email}
                      </a>
                    </div>
                  )}
                  {l.location && (
                    <div className="text-xs text-slate-400">{l.location}</div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="text-slate-700">{l.service || "—"}</div>
                  <div className="text-xs text-slate-400">{l.budget || ""}</div>
                  <span className="mt-1 inline-block rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium uppercase text-slate-500">
                    {l.source}
                  </span>
                </td>
                <td className="max-w-xs px-4 py-3 text-slate-600">{l.message}</td>
                <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                  {new Date(l.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={l.status}
                    onChange={(e) => changeStatus(l.id, e.target.value as Lead["status"])}
                    className={`rounded-full border-0 px-2.5 py-1 text-xs font-semibold capitalize focus:ring-2 focus:ring-brand-500 ${STATUS_STYLE[l.status]}`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-slate-400">No leads found.</p>
        )}
      </div>
    </div>
  );
}
