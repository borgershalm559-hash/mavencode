import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const sessionToken =
    req.cookies.get("authjs.session-token")?.value ||
    req.cookies.get("__Secure-authjs.session-token")?.value;

  const { pathname } = req.nextUrl;

  // Authenticated user on auth page → redirect to dashboard
  if (sessionToken && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Unauthenticated user on protected page → redirect to auth
  if (
    !sessionToken &&
    (pathname.startsWith("/dashboard") ||
      pathname.startsWith("/lesson") ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/pvp"))
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/lesson/:path*", "/admin/:path*", "/pvp/:path*"],
};
