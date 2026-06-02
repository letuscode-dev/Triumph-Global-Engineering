import { getLeads } from "@/lib/leads-store";
import { LeadsTable } from "@/components/admin/LeadsTable";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const leads = await getLeads();

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-slate-900">Leads</h1>
      <p className="mt-1 text-slate-500">
        Manage quotation requests and customer inquiries. Update status and export to CSV.
      </p>
      <div className="mt-6">
        <LeadsTable initialLeads={leads} />
      </div>
    </div>
  );
}
