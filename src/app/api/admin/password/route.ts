import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/admin-auth";
import { changeAdminPassword } from "@/lib/admin-credentials";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const currentPassword = String(body.currentPassword || "");
  const newPassword = String(body.newPassword || "");
  const confirmPassword = String(body.confirmPassword || "");

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { error: "Current and new password are required." },
      { status: 400 }
    );
  }

  if (newPassword !== confirmPassword) {
    return NextResponse.json({ error: "New passwords do not match." }, { status: 400 });
  }

  const result = await changeAdminPassword(currentPassword, newPassword);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  // Force re-login with the new password.
  const res = NextResponse.json({ ok: true, reauth: true });
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
