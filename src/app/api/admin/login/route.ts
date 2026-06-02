import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_TTL_MS,
  createSessionToken,
} from "@/lib/admin-auth";
import { validateAdminPassword } from "@/lib/admin-credentials";
import { rateLimit } from "@/lib/rate-limit";
import { adminLoginSchema, parseJsonBody } from "@/lib/validation";

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const limit = await rateLimit(`admin-login:${ip}`, 10, 15 * 60 * 1000, {
    failClosed: true,
  });
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(limit.retryAfterMs / 1000)) } }
    );
  }

  const body = await request.json().catch(() => ({}));
  const parsed = parseJsonBody(adminLoginSchema, body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  if (!(await validateAdminPassword(parsed.data.password))) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const isHttps =
    new URL(request.url).protocol === "https:" ||
    request.headers.get("x-forwarded-proto") === "https";

  const token = await createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isHttps,
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
