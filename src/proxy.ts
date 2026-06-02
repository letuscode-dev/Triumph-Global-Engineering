import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin-auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow the login page and the auth API through.
  if (pathname === "/admin/login" || pathname.startsWith("/api/admin/login")) {
    return NextResponse.next();
  }

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (isAdminPage || isAdminApi) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const valid = await verifySessionToken(token);
    if (!valid) {
      // API routes get a 401; pages get redirected to the login screen.
      if (isAdminApi) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
