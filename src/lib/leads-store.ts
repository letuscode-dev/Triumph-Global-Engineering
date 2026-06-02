import type { Lead } from "./types";
import { createAdminClient } from "./supabase/server";

// In-memory fallback store (demo mode). When Supabase is configured, leads are
// persisted to the `leads` table instead. The demo store resets on restart.
const demoLeads: Lead[] = [
  {
    id: "demo-1",
    name: "Tatenda Sibanda",
    company: "Sibanda Farms",
    phone: "0771 234 567",
    email: "tatenda@example.com",
    location: "Mazowe",
    service: "Irrigation System Design and Installation",
    budget: "$5,000 – $10,000",
    message: "Looking to install drip irrigation on 3 hectares of vegetables.",
    status: "new",
    source: "quote",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: "demo-2",
    name: "Privilege Mhaka",
    phone: "0712 987 654",
    email: "privilege@example.com",
    location: "Chitungwiza",
    service: "Borehole Drilling and Casing",
    budget: "$2,000 – $5,000",
    message: "Need a domestic borehole drilled and a pump installed.",
    status: "contacted",
    source: "quote",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
  },
  {
    id: "demo-3",
    name: "Chiedza Marufu",
    phone: "0783 555 111",
    location: "Borrowdale",
    service: "Solar Installations",
    message: "Interested in a solar backup system for my home.",
    status: "quoted",
    source: "contact",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
];

export async function getLeads(): Promise<Lead[]> {
  const supabase = createAdminClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) {
      return data.map(mapRow);
    }
  }
  return [...demoLeads].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addLead(
  input: Omit<Lead, "id" | "status" | "createdAt">
): Promise<Lead> {
  const lead: Lead = {
    ...input,
    id: `lead-${Date.now()}`,
    status: "new",
    createdAt: new Date().toISOString(),
  };

  const supabase = createAdminClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("leads")
      .insert({
        name: lead.name,
        company: lead.company,
        phone: lead.phone,
        email: lead.email,
        location: lead.location,
        service: lead.service,
        budget: lead.budget,
        message: lead.message,
        status: lead.status,
        source: lead.source,
      })
      .select()
      .single();
    if (!error && data) return mapRow(data);
  }

  demoLeads.unshift(lead);
  return lead;
}

export async function updateLeadStatus(id: string, status: Lead["status"]) {
  const supabase = createAdminClient();
  if (supabase) {
    await supabase.from("leads").update({ status }).eq("id", id);
    return;
  }
  const lead = demoLeads.find((l) => l.id === id);
  if (lead) lead.status = status;
}

function mapRow(row: Record<string, unknown>): Lead {
  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    company: (row.company as string) ?? undefined,
    phone: String(row.phone ?? ""),
    email: (row.email as string) ?? undefined,
    location: (row.location as string) ?? undefined,
    service: (row.service as string) ?? undefined,
    budget: (row.budget as string) ?? undefined,
    message: String(row.message ?? ""),
    status: (row.status as Lead["status"]) ?? "new",
    source: (row.source as Lead["source"]) ?? "quote",
    createdAt: String(row.created_at ?? new Date().toISOString()),
  };
}
