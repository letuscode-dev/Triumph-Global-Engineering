import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSiteSettings, saveSiteSettings } from "@/lib/site-settings";
import { parseJsonBody, siteSettingsSchema } from "@/lib/validation";

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json({ settings });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const parsed = parseJsonBody(siteSettingsSchema, body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const result = await saveSiteSettings(parsed.data);
  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? "Save failed." }, { status: 500 });
  }

  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
