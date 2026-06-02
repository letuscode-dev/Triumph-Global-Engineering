import { NextResponse } from "next/server";
import { addLead } from "@/lib/leads-store";
import { sendLeadNotification } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import { leadInputSchema, parseJsonBody } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const parsed = parseJsonBody(leadInputSchema, body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const data = parsed.data;

    // Honeypot: bots fill hidden fields. Pretend success and drop silently.
    if (data.website || data.company_url) {
      return NextResponse.json({ ok: true });
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const limit = await rateLimit(`lead:${ip}`, 5, 10 * 60 * 1000);
    if (!limit.ok) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil(limit.retryAfterMs / 1000)) },
        }
      );
    }

    const lead = await addLead({
      name: data.name,
      phone: data.phone,
      message: data.message,
      company: data.company,
      email: data.email,
      location: data.location,
      service: data.service,
      budget: data.budget,
      source: data.source,
    });

    await sendLeadNotification(lead);

    return NextResponse.json({ ok: true, id: lead.id });
  } catch {
    return NextResponse.json(
      { error: "Could not process your request." },
      { status: 500 }
    );
  }
}
