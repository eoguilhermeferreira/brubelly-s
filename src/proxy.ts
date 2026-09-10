import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "brubellys_admin_session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedAdminRoute =
    pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");

  if (!isProtectedAdminRoute) {
    return NextResponse.next();
  }

  const hasSession = request.cookies.get(SESSION_COOKIE)?.value === "active";

  if (!hasSession) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
