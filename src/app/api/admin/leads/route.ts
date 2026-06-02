import { NextResponse } from "next/server";
import { updateLeadStatus } from "@/lib/leads-store";
import { leadStatusSchema, parseJsonBody } from "@/lib/validation";

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => ({}));
  const parsed = parseJsonBody(leadStatusSchema, body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  await updateLeadStatus(parsed.data.id, parsed.data.status);
  return NextResponse.json({ ok: true });
}
