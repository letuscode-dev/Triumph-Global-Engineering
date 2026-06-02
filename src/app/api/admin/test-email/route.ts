import { NextResponse } from "next/server";
import { sendTestEmail } from "@/lib/email";

export async function POST() {
  const result = await sendTestEmail();
  if (!result.ok) {
    return NextResponse.json({ error: result.error || "Could not send test email." }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
