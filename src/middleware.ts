import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

// Use the edge-compatible config (no Prisma, no bcrypt) to keep the
// middleware bundle well under Vercel's 1 MB Edge Function limit.
const { auth } = NextAuth(authConfig);

const PROTECTED_PREFIXES = ["/dashboard", "/lesson", "/admin", "/pvp"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthed = !!req.auth?.user?.id;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  if (isAuthed && (pathname === "/" || pathname === "/login")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!isAuthed && isProtected) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname.startsWith("/admin") && req.auth?.user?.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*", "/lesson/:path*", "/admin/:path*", "/pvp/:path*"],
};
